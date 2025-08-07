import React, { useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
   X,
   Trophy,
   Medal,
   Award,
   Crown,
   Search,
   Filter,
   Download,
   Share2,
   Calendar,
   Users,
   TrendingUp,
   ChevronLeft,
   ChevronRight,
   Clock,
   BookOpen,
   CheckCircle,
   AlertCircle,
   Play
} from 'lucide-react';
import { useHomeStore } from '@/store/HomeStore';
import { useExamStore } from '@/store/ExamStore';
import { useRouter } from 'next/navigation';

// Main Archive Modal Component
const RoutineModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const router = useRouter()

    const {
      routine,
      getRoutine,

    } = useHomeStore()
 
    const {
        examApi
    } = useExamStore()
    // Mock store functions for demo
    const batchId = routine?.text || null;
    
    const fetchData = async () => {
        // Implementation for fetching data
    };

    // Filter exams based on search and status
    const filteredExams = useMemo(() => {
        if (!routine?.exams) return [];
        
        return routine.exams.filter(exam => {
            const matchesSearch = exam.syllabus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                exam.examid.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || exam.status.toLowerCase() === statusFilter.toLowerCase();
            
            return matchesSearch && matchesStatus;
        });
    }, [routine?.exams, searchTerm, statusFilter]);

    // Status color mapping
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'live': return 'text-green-600 bg-green-50 border-green-200';
            case 'upcoming': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'completed': return 'text-gray-600 bg-gray-50 border-gray-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'live': return <Play className="w-4 h-4" />;
            case 'upcoming': return <Clock className="w-4 h-4" />;
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    if (!isOpen) return null;

    if (loading) return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span>Loading...</span>
                </div>
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
                >
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-8 h-8" />
                                <div>
                                    <h2 className="text-2xl font-bold">Routine</h2>
                                    <p className="text-blue-100">{routine?.text || 'Exam Schedule'}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                  

                    {/* Modal Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div>
                                {!batchId ? (
                                    <div className="text-center py-12">
                                        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 text-lg">Please select a batch to view routine.</p>
                                    </div>
                                ) : filteredExams.length === 0 ? (
                                    <div className="text-center py-12">
                                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 text-lg">No exams found matching your criteria.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        

                                        {/* Exam List */}
                                        <div className="space-y-3">
                                            {filteredExams.map((exam, index) => (
                                                <motion.div
                                                    key={exam.examid}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                                                        <div className="flex-1">
                                                            <div className="flex items-start space-x-4">
                                                                <div className="flex-shrink-0">
                                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                                                        {exam.examid.toUpperCase()}
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                                        {exam.syllabus}
                                                                    </h3>
                                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                                        <div className="flex items-center space-x-1">
                                                                            <Calendar className="w-4 h-4" />
                                                                            <span>{exam.date}</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1">
                                                                            <Clock className="w-4 h-4" />
                                                                            <span>{exam.examtime} PM</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1">
                                                                            <BookOpen className="w-4 h-4" />
                                                                            <span>Question ID: {exam.question_id}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(exam.status)}`}>
                                                                {getStatusIcon(exam.status)}
                                                                <span>{exam.status}</span>
                                                            </span>
                                                            {exam.attended && (
                                                                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    <span>Attended</span>
                                                                </span>
                                                            )}
                                                            {(exam.has_exam_access && exam.status === 'Live') && (
                                                                <button 
                                                                    onClick={async() =>{
                                                                        await examApi()
                                                                        router.push('/exam')
                                                                    }}
                                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                                                        
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {routine && routine.pages > 1 && (
                                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                                <div className="text-sm text-gray-600">
                                                    Page {routine.page} of {routine.pages}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        disabled={!routine.has_previous}
                                                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        disabled={!routine.has_next}
                                                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};


export default RoutineModal;