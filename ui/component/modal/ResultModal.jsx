import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
   X,
   Trophy,
   FileText,
   BarChart3,
   Calendar,
   Users,
   ChevronLeft,
   ChevronRight,
   BookOpen,
   AlertCircle
} from 'lucide-react';
import { useHomeStore } from '@/store/HomeStore';
import { useRouter } from 'next/navigation';

// Main Result Modal Component
const ResultModal = ({ isOpen, onClose }) => {
    const router = useRouter()
    const {
        result,
        getResult,
        loading,
        getMarkSheet,
        getAnswerSheet
    } = useHomeStore();

    // Show all results without filtering for demo
    const displayResults = result?.page_data || [];

    // Get result type display name
    const getResultTypeName = (type) => {
        switch (type) {
            case '1': return 'Final Result';
            case '2': return 'Practice Test';
            case '3': return 'Mock Exam';
            default: return 'Unknown';
        }
    };

    // Get result type color
    const getResultTypeColor = (type) => {
        switch (type) {
            case '1': return 'text-green-600 bg-green-50 border-green-200';
            case '2': return 'text-blue-600 bg-blue-50 border-blue-200';
            case '3': return 'text-purple-600 bg-purple-50 border-purple-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    // Handle answer sheet view
    const handleAnswerSheet = async (resultItem) => {
        console.log('View answer sheet for:', resultItem);
        await getAnswerSheet(resultItem.question_id, resultItem.answer_id, 0)
        router.push('/answer-sheet')
        // Implementation for opening answer sheet
        // You can add your navigation logic here
    };

    // Handle mark sheet view
    const handleMarkSheet = async (resultItem) => {
        console.log('View mark sheet for:', resultItem);
        await getMarkSheet(resultItem.question_id)
        
        // Implementation for opening mark sheet
        // You can add your navigation logic here
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
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
                >
                    {/* Modal Header */}
                    <div className="bg-white border-b border-gray-200 p-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <Trophy className="w-8 h-8 text-emerald-600" />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Exam Results</h2>
                                    <p className="text-gray-600">View your exam performance and detailed results</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                            </div>
                        ) : (
                            <div>
                                {!result?.page_data?.length ? (
                                    <div className="text-center py-12">
                                        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 text-lg">No results found.</p>
                                        <p className="text-gray-500 text-sm mt-2">Complete some exams to see your results here.</p>
                                    </div>
                                ) : displayResults.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 text-lg">No results found.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Results List */}
                                        <div className="space-y-4">
                                            {displayResults.map((resultItem, index) => (
                                                <motion.div
                                                    key={`${resultItem.question_id}-${resultItem.answer_id}`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
                                                >
                                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                                                        <div className="flex-1">
                                                            <div className="flex items-start space-x-4">
                                                                <div className="flex-shrink-0">
                                                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white">
                                                                        <Trophy className="w-7 h-7" />
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center space-x-3 mb-2">
                                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                                            {resultItem.syllabus}
                                                                        </h3>
                                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getResultTypeColor(resultItem.result_type)}`}>
                                                                            {getResultTypeName(resultItem.result_type)}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-600 mb-3">{resultItem.text}</p>
                                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                                        <div className="flex items-center space-x-1">
                                                                            <Calendar className="w-4 h-4" />
                                                                            <span>{resultItem.date}</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1">
                                                                            <BookOpen className="w-4 h-4" />
                                                                            <span>Question ID: {resultItem.question_id}</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1">
                                                                            <FileText className="w-4 h-4" />
                                                                            <span>Answer ID: {resultItem.answer_id}</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1">
                                                                            <Users className="w-4 h-4" />
                                                                            <span>User ID: {resultItem.user_id}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Action Buttons */}
                                                        <div className="flex flex-col sm:flex-row gap-3">
                                                            {resultItem.has_exam_access ? (
                                                                <>
                                                                    <button
                                                                        onClick={async () => {await handleAnswerSheet(resultItem)}}
                                                                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                                    >
                                                                        <FileText className="w-4 h-4" />
                                                                        <span>Answer Sheet</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={ async () => { await handleMarkSheet(resultItem)}}
                                                                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                                                                    >
                                                                        <BarChart3 className="w-4 h-4" />
                                                                        <span>Mark Sheet</span>
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <div className="flex flex-col items-center space-y-2">
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            disabled
                                                                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium"
                                                                        >
                                                                            <FileText className="w-4 h-4" />
                                                                            <span>Answer Sheet</span>
                                                                        </button>
                                                                        <button
                                                                            disabled
                                                                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium"
                                                                        >
                                                                            <BarChart3 className="w-4 h-4" />
                                                                            <span>Mark Sheet</span>
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-xs text-red-600">Access Restricted</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {result && result.num_pages > 1 && (
                                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                                <div className="text-sm text-gray-600">
                                                    Page {result.current_page} of {result.num_pages} 
                                                    <span className="ml-2">({result.total_items} total items)</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        disabled={!result.has_previous}
                                                        className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                        <span>Previous</span>
                                                    </button>
                                                    <span className="px-3 py-2 text-sm text-gray-500">
                                                        {result.current_page}
                                                    </span>
                                                    <button
                                                        disabled={!result.has_next}
                                                        className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                                    >
                                                        <span>Next</span>
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



export default ResultModal;