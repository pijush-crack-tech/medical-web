'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  TrendingUp,
  GraduationCap,
  UserCheck,
  ClipboardList,
  Award,
  CheckCircle,
  Book,
  Save,
  X,
  Plus,
  Bell,
  Settings,
  Search,
  ArrowRight,
  Clock,
  Target,
  Archive,
  Video,
  Dock,
  ChevronRight,
  Star,
  PlayCircle,
  FileText,
  Activity,
  Zap,
  Grid,
  BarChart3
} from 'lucide-react';
import { savedFacultyExam, useBatchDetailsState, useHomeStore } from '@/store/HomeStore';
import { useRouter } from 'next/navigation';
import { BatchCard } from '../component/card/BatchCard';
import BatchListModal from '../component/modal/BatchList';
import ArchiveModal from '../component/modal/CentralArchive';
import BatchDetailsModal from '../component/modal/BatchDetailsModal';
import MeritListModal from '../component/modal/MeritListModal';
import RoutineModal from '../component/modal/RoutineModal';
import { useCentralArchiveStore } from '@/store/CentralArchiveStore';
import ResultModal from '../component/modal/ResultModal';
import MarkSheetModal from '../component/modal/MarkSheetModal';
import { useBatchModalStore } from '@/store/modal/BatchModalStore';
import MyStudyModal from '../component/modal/MyStudy';

const HomeScreen = () => {
  // Modal states for exam selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [savedSelections, setSavedSelections] = useState([]);

  // Your original store and router usage
  const { 
    getFacultyExam, 
    facultyExam,
    handleSelection,
    home,
    userBatch,
    upcommingBatches,
    setBatchModalClose,
    setBatchModalOpen,
    openBatchModal,
    archiveQuestions,
    isArchiveModalOpen,
    openArchiveModal,
    closeArchiveModal,
    isLoading,
    isOpenBatchDetailsModal,
    onBatchDetailsModalOpen,
    onBatchDetailsModalClose,
    getBatchDetails,
    batchDetails,
    isMeritListOpen,
    onMeritModalClose,
    onMeritModalOpen,
    isRoutineModalOpen,
    onRoutineModalClose,
    getResult,
    isResultModalOpen,
    onResultModalClose,
    isMArkSheetModalOpen,
    onMarkSheetClose,
    isMyStudyOpen,
    onMyStudyClose
  } = useHomeStore();



  const { batchApi } = useBatchModalStore();
  const { archiveApi } = useCentralArchiveStore();
  const selectedFacultyExam = savedFacultyExam();
  const router = useRouter();

  useEffect(() => {
    getFacultyExam();
    home();
  }, []);

  // Modal functions
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
    setSelectedFaculty(null);
  };

  const handleExamSelect = (exam) => {
    setSelectedExam(exam);
    setSelectedFaculty(null);
  };

  const handleFacultySelect = (faculty) => {
    setSelectedFaculty(faculty);
  };

  const handleSave = async () => {
    if (selectedExam && selectedFaculty) {
      const newSelection = {
        examId: selectedExam.id,
        examName: selectedExam.name,
        facultyId: selectedFaculty.id,
        facultyName: selectedFaculty.name,
        timestamp: new Date().toLocaleString()
      };
      
      setSavedSelections([...savedSelections, newSelection]);
      await handleSelection(newSelection);
      closeModal();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // Action items
  const quickActions = [
    {
      title: 'Central Archive',
      icon: Archive,
      color: 'from-purple-500 to-purple-600',
      action: async () => {
        if (selectedFacultyExam) {
          await archiveApi(selectedFacultyExam.facultyId, selectedFacultyExam.examId, 1, 1);
          openArchiveModal();
        }
      }
    },
    {
      title: 'Central Results',
      icon: BarChart3,
      color: 'from-emerald-500 to-emerald-600',
      action: async () => await getResult("")
    },
    {
      title: 'Video Library',
      icon: Video,
      color: 'from-red-500 to-red-600',
      action: () => {}
    },
    {
      title: 'PDF Resources',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      action: () => {}
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100  md:mt-15 lg:mt-15">
      <div className="h-full max-w-6xl mx-auto flex flex-col">
        
        

        {/* Main Content - Perfect Vertical Flow */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 p-4 sm:p-6 space-y-6"
        >
          
          {/* Section 1: My Active Batch */}
          <motion.div variants={itemVariants}>
            <div className='w-full flex justify-between mb-4'>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">My Active Batch</h2>
              </div>
              <motion.button 
              onClick={openModal}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 hover:shadow-xl transition-all"
            >
              {selectedFacultyExam && selectedFacultyExam?.examId != 0 ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">{selectedFacultyExam.examName}</p>
                    <p className="text-xs text-gray-500">{selectedFacultyExam.facultyName}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">Select Exam & Faculty</p>
                    <p className="text-xs text-gray-500">Choose your specialization</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </motion.button>
            </div>
            
            
            <div>
              {userBatch && userBatch.batch_id == 0 ? (
                <motion.button
                  onClick={async () => {
                    if (selectedFacultyExam.examId == null || selectedFacultyExam.examId == 0){
                      openModal()
                    }else{
                      batchApi(facultyExam.facultyId,facultyExam.examId);
                      setBatchModalOpen()
                    }
                    
                  }}
                  whileHover={{ scale: 1.01 }}
                  className="w-full text-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <Plus className="w-6 h-6 bg" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold">Enroll in a Batch</h3>
                      <p className="text-blue-600 text-sm">Start your learning journey today</p>
                    </div>
                  </div>
                </motion.button>
              ) : (
                <div>
                  {isLoading ? (
                    <div className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ) : userBatch ? (
                    <BatchCard
                      batch={userBatch}
                      onClick={async () => {
                        await getBatchDetails(userBatch.batch_id);
                        onBatchDetailsModalOpen();
                      }}
                    />
                  ) : (
                    <div className="bg-white rounded-2xl p-6 shadow-lg text-center text-gray-500">
                      No batch data available
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Section 2: Quick Actions */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  onClick={action.action}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-lg transition-all group"
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{action.title}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Section 3: Upcoming Batches - Horizontal Scroll */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-gray-900">Upcoming Batches</h2>
              </div>
              <motion.button
                onClick={async () => {
                  await batchApi(facultyExam.facultyId,facultyExam.examId);
                  setBatchModalOpen();
                }}
                whileHover={{ scale: 1.05 }}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
              >
                View All
              </motion.button>
            </div>

            {/* Horizontal Scrollable List */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex space-x-4" style={{ width: 'max-content' }}>
                {upcommingBatches.filter(item => item.status !== "running").map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => console.log('Selected batch:', item)}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group flex-shrink-0 w-72"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                          {item.batch_name || item.text}
                        </h3>
                        <p className="text-xs text-gray-500">
                          ID: {item.batch_id || item.id}
                        </p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Upcoming
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {item.exam_count || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {item.batch_video_count || item.video_count || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {item.batch_pdf_count || item.pdf_count || 0}
                      </div>
                    </div>
                    
                    {(item.batch_start_date || item.start_date) && (
                      <div className="text-xs text-gray-500 flex justify-between items-center">
                        <span>Starts: {new Date(item.batch_start_date || item.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {upcommingBatches.filter(item => item.status !== "running").length === 0 && (
                  <div className="text-center py-8 text-gray-500 w-full min-w-[300px]">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No upcoming batches available</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* All Modals */}
        <BatchListModal isOpen={openBatchModal} onClose={setBatchModalClose} onBatchSelect={() => {}} />
        <ArchiveModal isOpen={isArchiveModalOpen} onClose={closeArchiveModal} onItemSelect={() => {}} />
        <BatchDetailsModal isOpen={isOpenBatchDetailsModal} onClose={onBatchDetailsModalClose} batch={batchDetails?.batch} liveExam={batchDetails?.todays_exam} />
        <MeritListModal isOpen={isMeritListOpen} onClose={onMeritModalClose} />
        <RoutineModal isOpen={isRoutineModalOpen} onClose={onRoutineModalClose} />
        <ResultModal isOpen={isResultModalOpen} onClose={onResultModalClose} />
        <MarkSheetModal isOpen={isMArkSheetModalOpen} onClose={onMarkSheetClose} />
        <MyStudyModal isOpen={isMyStudyOpen} onClose={onMyStudyClose} />

        {/* Exam Selection Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-bold">Select Exam & Faculty</h1>
                      <p className="text-blue-100 text-sm">Choose your specialization</p>
                    </div>
                    <button onClick={closeModal} className="p-2 hover:bg-white/20 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[65vh] overflow-y-auto">
                  {/* Exam Selection */}
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Exam</h2>
                    <div className="grid gap-3">
                      {facultyExam.map((exam) => (
                        <motion.div
                          key={exam.id}
                          onClick={() => handleExamSelect(exam)}
                          whileHover={{ scale: 1.01 }}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedExam?.id === exam.id
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-800">{exam.name}</h3>
                              <p className="text-sm text-gray-600">{exam.faculty.length} faculties available</p>
                            </div>
                            {selectedExam?.id === exam.id && (
                              <CheckCircle className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Faculty Selection */}
                  <AnimatePresence>
                    {selectedExam && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Faculty</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                          {selectedExam.faculty.map((faculty) => (
                            <motion.div
                              key={faculty.id}
                              onClick={() => handleFacultySelect(faculty)}
                              whileHover={{ scale: 1.01 }}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                selectedFaculty?.id === faculty.id
                                  ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                                  : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-800">{faculty.name}</h3>
                                {selectedFaculty?.id === faculty.id && (
                                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <AnimatePresence>
                  {selectedExam && selectedFaculty && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="border-t border-gray-200 px-6 py-4 bg-gray-50"
                    >
                      <div className="flex gap-3">
                        <button
                          onClick={closeModal}
                          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                          Save Selection
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomeScreen;