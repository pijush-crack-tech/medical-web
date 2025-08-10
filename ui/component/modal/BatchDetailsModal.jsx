export const dynamic = 'force-dynamic'
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, BookOpen, Video, FileText, Target, CheckCircle, XCircle, Play, AlertCircle, Search, Archive, List, DockIcon } from 'lucide-react';
import { cardVariants } from '@/ui/animation/ContainerVariants';
import { useHomeStore } from '@/store/HomeStore';
import { useRouter } from 'next/navigation';
import { useExamStore } from '@/store/ExamStore';
import { getRedirectResult } from 'firebase/auth';
import { useCentralArchiveStore } from '@/store/CentralArchiveStore';

const BatchDetailsModal = ({ isOpen, onClose, batch, liveExam }) => {
    const { 
        openArchiveModal,
        onBatchDetailsModalClose,
        onMeritModalOpen,
        getMeritList,
        getRoutine,
        getResult,
        getMarkSheet,
        selectedFacultyExam
    } = useHomeStore();

    const {
        archiveApi,
        archiveData
    } = useCentralArchiveStore()

    const {
        examApi
    } = useExamStore()
 
    const router = useRouter();

    // Memoized status calculations
    const status = useMemo(() => {
        if (!batch) return 'unknown';
        
        const today = new Date();
        const startDate = new Date(batch.batch_start_date);
        const endDate = new Date(batch.batch_end_date);
        
        today.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        if (startDate > today) return 'upcoming';      
        else if (startDate <= today && endDate >= today) return 'running';  
        else return 'completed';
    }, [batch?.batch_start_date, batch?.batch_end_date]);

    const statusStyles = useMemo(() => {
        switch (status) {
            case 'upcoming':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'running':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'completed':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    }, [status]);

    const statusText = useMemo(() => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }, [status]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const progressColor = useMemo(() => {
        const progress = batch?.batch_progress || 0;
        if (progress >= 80) return 'bg-emerald-400';
        if (progress >= 60) return 'bg-blue-400';
        if (progress >= 40) return 'bg-amber-400';
        return 'bg-red-400';
    }, [batch?.batch_progress]);

    const handleEnterExam = async () => {
        onBatchDetailsModalClose()
        await examApi(liveExam?.question_id)
        router.push('/exam')
    };

    const handleArchiveOpen = async () => {

        await archiveApi(selectedFacultyExam.facultyId,selectedFacultyExam.examId,1,1)
    
        onBatchDetailsModalClose();
        openArchiveModal();

    };

    // Handle escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && batch && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
                        role="dialog"
                        aria-labelledby="modal-title"
                        aria-modal="true"
                    >
                        {/* Header */}
                        <div className="bg-slate-50 px-5 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h1 id="modal-title" className="text-lg font-semibold text-gray-900">
                                            {batch.batch_name}
                                        </h1>
                                        <p className="text-blue-600 text-sm">Batch ID: {batch.batch_id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${statusStyles}`}>
                                        {statusText}
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                                        aria-label="Close modal"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 100px)' }}>
                            {/* Live Exam Alert */}
                            {liveExam && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                <Play className="w-4 h-4 text-red-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-red-900">Live Exam Today</h3>
                                                <p className="text-red-700 text-sm">{liveExam.text}</p>
                                                <p className="text-red-600 text-xs mt-0.5">
                                                    {liveExam.start_time} - {liveExam.end_time} • {liveExam.syllabus}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {liveExam.attended ? (
                                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                            ) : (
                                                <button 
                                                    onClick={handleEnterExam}
                                                    className='text-white rounded-md px-2 py-1 bg-teal-700 hover:bg-teal-800 transition-colors text-sm'
                                                >
                                                    Enter Exam
                                                </button>
                                            )}
                                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                                liveExam.status === 'Live' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {liveExam.status}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Batch Overview */}
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-5">
                                {/* Progress Card */}
                                <div className="lg:col-span-2 bg-slate-50 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900 mb-3">Batch Progress</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                                                <span className="text-sm font-bold text-gray-900">{batch.batch_progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className={`h-3 rounded-full transition-all duration-500 ${progressColor}`}
                                                    style={{ width: `${batch.batch_progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            <div className="text-center">
                                                <div className="text-xl font-bold text-emerald-600">{batch.total_exam_attend}</div>
                                                <div className="text-xs text-gray-600">Exams Attended</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xl font-bold text-red-500">{batch.missed_exam}</div>
                                                <div className="text-xs text-gray-600">Exams Missed</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Card */}
                                <div className="bg-slate-50 lg:col-span-2 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900 mb-3">Performance</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Correct</p>
                                                <p className="text-sm text-gray-600">{batch.correct_answer}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <XCircle className="w-5 h-5 text-red-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Wrong</p>
                                                <p className="text-sm text-gray-600">{batch.wrong_answer}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Passed</p>
                                                <p className="text-sm text-gray-600">{batch.passed}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <AlertCircle className="w-5 h-5 text-orange-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Failed</p>
                                                <p className="text-sm text-gray-600">{batch.failed}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Duration Card */}
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900 mb-3">Duration</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Start Date</p>
                                                <p className="text-sm text-gray-600">{formatDate(batch.batch_start_date)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">End Date</p>
                                                <p className="text-sm text-gray-600">{formatDate(batch.batch_end_date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Overview */}
                            <div className="mb-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                                            <Target className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-xl font-bold text-blue-700 mb-1">{batch.batch_exam_count}</div>
                                        <div className="text-blue-600 text-sm font-medium">Total Exams</div>
                                    </div>

                                    <div className="bg-emerald-50 rounded-lg p-4 text-center">
                                        <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                                            <Video className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-xl font-bold text-emerald-700 mb-1">{batch.batch_video_count}</div>
                                        <div className="text-emerald-600 text-sm font-medium">Video Lectures</div>
                                    </div>

                                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                                        <div className="w-9 h-9 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-xl font-bold text-purple-700 mb-1">{batch.batch_pdf_count}</div>
                                        <div className="text-purple-600 text-sm font-medium">PDF Materials</div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4">
                                    <motion.button
                                        onClick={async () => {await getRoutine(batch?.batch_id)}}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
                                    >
                                        <div className="text-center">
                                            <div className="bg-teal-900 rounded-lg p-3 md:p-4 mx-auto w-fit mb-3">
                                                <Search className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                            </div>
                                            <p className="text-xs font-bold md:text-sm text-gray-900 group-hover:text-gray-700">
                                                Routine
                                            </p>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        onClick={async () => await handleArchiveOpen()}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
                                    >
                                        <div className="text-center">
                                            <div className="bg-teal-900 rounded-lg p-3 md:p-4 mx-auto w-fit mb-3">
                                                <Archive className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                            </div>
                                            <p className="text-xs font-bold md:text-sm text-gray-900 group-hover:text-gray-700">
                                                Archive
                                            </p>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        onClick={() => {}}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
                                    >
                                        <div className="text-center">
                                            <div className="bg-teal-900 rounded-lg p-3 md:p-4 mx-auto w-fit mb-3">
                                                <Video className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                            </div>
                                            <p className="text-xs font-bold md:text-sm text-gray-900 group-hover:text-gray-700">
                                                Related Video
                                            </p>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        onClick={async () => {
                                            await getResult(batch.batch_id)
                                        }}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
                                    >
                                        <div className="text-center">
                                            <div className="bg-teal-900 rounded-lg p-3 md:p-4 mx-auto w-fit mb-3">
                                                <Archive className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                            </div>
                                            <p className="text-xs font-bold md:text-sm text-gray-900 group-hover:text-gray-700">
                                                Result
                                            </p>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        onClick={async() => await getMeritList(batch.batch_id,1)}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
                                    >
                                        <div className="text-center">
                                            <div className="bg-teal-900 rounded-lg p-3 md:p-4 mx-auto w-fit mb-3">
                                                <List className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                            </div>
                                            <p className="text-xs font-bold md:text-sm text-gray-900 group-hover:text-gray-700">
                                                Merit List
                                            </p>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        onClick={() => {}}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
                                    >
                                        <div className="text-center">
                                            <div className="bg-teal-900 rounded-lg p-3 md:p-4 mx-auto w-fit mb-3">
                                                <DockIcon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                            </div>
                                            <p className="text-xs font-bold md:text-sm text-gray-900 group-hover:text-gray-700">
                                                Related PDF
                                            </p>
                                        </div>
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BatchDetailsModal;

