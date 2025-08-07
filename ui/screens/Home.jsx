'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Dock
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


// Mock store hooks - replace with your actual store
const useFacultyExam = () => {
  return [
    {
      id: 4,
      name: "FCPS",
      faculty: [
        { id: 1, name: "Gynae" },
        { id: 2, name: "Surgery" },
        { id: 3, name: "Paediatrics" },
        { id: 4, name: "Medicine" }
      ]
    },
    {
      id: 5,
      name: "MRCP",
      faculty: [
        { id: 5, name: "Internal Medicine" },
        { id: 6, name: "Cardiology" },
        { id: 7, name: "Neurology" }
      ]
    }
  ];
};



const HomeScreen = () => {
  // Modal states for exam selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [savedSelections, setSavedSelections] = useState([]);

  // Your original store and router usage
  const { 
    getFacultyExam, 
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
  } = useHomeStore();

  const {
    archiveApi
  } = useCentralArchiveStore()

  const selectedFacultyExam = savedFacultyExam();

  const facultyExam = useFacultyExam();
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
      
      await handleSelection(newSelection)
      
      closeModal();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  // Your original batch data
  const batch = [
    {
      batchName: "Medical Batch 2024",
      batchId: "1",
      totalExam: 10,
      givenExam: 7,
      status: 'running'
    },
    {
      batchName: "Surgery Batch A",
      batchId: "SB2024002", 
      totalExam: 8,
      givenExam: 0,
      status: 'upcomming'
    },
    {
      batchName: "Pediatrics Batch",
      batchId: "PB2024003",
      totalExam: 12,
      givenExam: 0,
      status: 'upcomming'
    },
    {
      batchName: "Cardiology Batch",
      batchId: "CB2024004",
      totalExam: 6,
      givenExam: 0,
      status: 'upcomming'
    }
  ];

  // Your original quick actions data
  const quickActions = [
    { title: 'Smart Search', icon: Users, color: 'bg-blue-500', href: '/students' },
    { title: 'Central Result', icon: BookOpen, color: 'bg-green-500', href: '/batch' },
    { title: 'Central Archive', icon: Calendar, color: 'bg-purple-500', href: '/exam' },
    { title: 'Central Favorite', icon: UserCheck, color: 'bg-yellow-500', href: '/attendance' },
    { title: 'Quiz Master', icon: ClipboardList, color: 'bg-red-500', href: '/assignments' },
    { title: 'Wrong & Unanswered', icon: GraduationCap, color: 'bg-indigo-500', href: '/exams' }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 md:mt-10 lg:mt-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with Exam Selection Button */}
        


        {/* Modals */}
        <BatchListModal
          isOpen={openBatchModal}
          onClose={setBatchModalClose}
          onBatchSelect={()=>{}}
        />

        <ArchiveModal
          isOpen={isArchiveModalOpen}
          onClose={closeArchiveModal}
          onItemSelect={()=>{}}
        />

        <BatchDetailsModal
          isOpen={isOpenBatchDetailsModal}
          onClose={onBatchDetailsModalClose}
          batch={batchDetails?.batch}
          liveExam={batchDetails?.todays_exam}
        />

        <MeritListModal
          isOpen={isMeritListOpen}
          onClose={onMeritModalClose}
        />

        <RoutineModal
          isOpen={isRoutineModalOpen}
          onClose={onRoutineModalClose}
        />

        <ResultModal
            isOpen={isResultModalOpen}
            onClose={onResultModalClose}
        />

        <MarkSheetModal
            isOpen={isMArkSheetModalOpen}
            onClose={onMarkSheetClose}
        />


        {/* Stats Grid - Your original layout */}
        <div className='flex justify-between py-2'>
            <h2 className="text-gray-900 text-xl md:text-xl font-semibold mb-4 font-geist-sans">
              My Batch
            </h2>

            <motion.button 
              onClick={openModal}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 hover:shadow-xl transition-shadow"
            >

              {selectedFacultyExam != null ? (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedFacultyExam.examName} | {selectedFacultyExam.facultyName}</h3>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Plus className="w-5 h-5" />
                    <div>
                      <h3 className="font-semibold text-gray-900"> Select Exam & Faculty</h3>
                    </div>
                  </div>
                )
              }
                  
            </motion.button>
        </div>
        
        
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1  lg:grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 mb-4"
        >
          {userBatch && userBatch.batch_id == 0 ? <motion.button
            onClick={setBatchModalOpen}
            className="flex items-center justify-center gap-3 bg-white text-black rounded-xl text-xl font-bold shadow-lg border border-gray-200 p-2 hover:shadow-xl transition-shadow"
          >
            <Plus className="w-6 h-6 text-blue-600 rounded-lg shadow-md"/>
            Enroll A Batch
            </motion.button> : <div>
            
            {isLoading ? (
              <div>Loading...</div>
            ) : userBatch ? (
              <BatchCard
                batch={userBatch}
                onClick={async () => {
                  await getBatchDetails(userBatch.batch_id)
                  onBatchDetailsModalOpen()
                }}/>
            ) : (
              <div>No batch data available</div>
            )}
          </div>}
          
          <div className='grid grid-cols-1 lg:grid-cols-2  md:grid-cols-2 gap-8'>
            <motion.div variants={itemVariants} className="">
            <h2 className="text-gray-900 text-xl md:text-xl font-semibold mb-4 md:mb-2 font-geist-sans">
              Premium Section
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-1 gap-3 md:gap-4">
              {/* <motion.button
                onClick={()=>{}}
                variants={cardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
              >
                <div className="text-center">
                  <div className={`bg-teal-900 rounded-lg p-3 md:p-4 mx-auto w-fit mb-3`}>
                    <Search className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <p className="text-xs font-bold md:text-sm  text-gray-900 group-hover:text-gray-700">
                    Smart Search
                  </p>
                </div>
              </motion.button> */}
              <motion.button
                onClick={async () => {

                  await archiveApi()
                  openArchiveModal()

                }}
                variants={cardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
              >
                <div className="text-center">
                  <div className={`bg-teal-900 rounded-lg p-3 md:p-4 mx-auto w-fit mb-3`}>
                    <Archive className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <p className="text-xs font-bold md:text-sm  text-gray-900 group-hover:text-gray-700">
                    Central Archive
                  </p>
                </div>
              </motion.button>

              {/* <motion.button
                onClick={()=>{}}
                variants={cardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
              >
                <div className="text-center">
                  <div className={`bg-teal-900 rounded-lg p-3 md:p-4 mx-auto w-fit mb-3`}>
                    <Archive className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <p className="text-xs font-bold md:text-sm  text-gray-900 group-hover:text-gray-700">
                    Quiz Master
                  </p>
                </div>
              </motion.button> */}

              <motion.button
                onClick={async () => { await getResult("") }}
                variants={cardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
              >
                <div className="text-center">
                  <div className={`bg-teal-900 rounded-lg p-3 md:p-4 mx-auto w-fit mb-3`}>
                    <Archive className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <p className="text-xs font-bold md:text-sm  text-gray-900 group-hover:text-gray-700">
                    Central Result
                  </p>
                </div>
              </motion.button>

              {/* <motion.button
                onClick={()=>{}}
                variants={cardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
              >
                <div className="text-center">
                  <div className={`bg-teal-900 rounded-lg p-3 md:p-4 mx-auto w-fit mb-3`}>
                    <Archive className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <p className="text-xs font-bold md:text-sm  text-gray-900 group-hover:text-gray-700">
                    Central Favourite
                  </p>
                </div>
              </motion.button> */}

              {/* <motion.button
                onClick={()=>{}}
                variants={cardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
              >
                <div className="text-center">
                  <div className={`bg-teal-900 rounded-lg p-3 md:p-4 mx-auto w-fit mb-3`}>
                    <Archive className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <p className="text-xs font-bold md:text-sm  text-gray-900 group-hover:text-gray-700">
                    Wrong & Unanswered
                  </p>
                </div>
              </motion.button> */}
            </div>
            <div>

            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="lg:col-span-1 md:col-span-1">
            <h2 className="text-gray-900 text-xl md:text-xl font-semibold mb-4 md:mb-2 font-geist-sans">
              Study Toolkit
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-1 md:grid-cols-1 gap-3 md:gap-4">
              <motion.button
                onClick={()=>{}}
                variants={cardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
              >
                <div className="text-center">
                  <div className={`bg-teal-900 rounded-lg p-3 md:p-4 mx-auto w-fit mb-3`}>
                    <Video className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <p className="text-xs font-bold md:text-sm  text-gray-900 group-hover:text-gray-700">
                    Video Section
                  </p>
                </div>
              </motion.button>
              <motion.button
                onClick={openArchiveModal}
                variants={cardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer group"
              >
                <div className="text-center">
                  <div className={`bg-teal-900 rounded-lg p-3 md:p-4 mx-auto w-fit mb-3`}>
                    <Dock className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <p className="text-xs font-bold md:text-sm  text-gray-900 group-hover:text-gray-700">
                    PDF Section
                  </p>
                </div>
              </motion.button>
              
            </div>
            <div>

            </div>
          </motion.div>
          </div>
          
        </motion.div>

        {/* Upcoming Batch - Your original section */}
        <div className='flex gap-4'>
            <h2 className="text-xl md:text-xl font-semibold text-gray-900 mb-2 md:mb-2 font-geist-sans">
              Upcomming Batch
            </h2>

            <button
              onClick={setBatchModalOpen}
              className="p-2 bg-teal-800 hover:bg-teal-500 rounded-md transition-colors duration-200"
            >
             See All Batch
            </button>
        </div>
        <motion.div 
          className="overflow-x-auto overflow-y-hidden mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex space-x-4 p-2" style={{ width: 'max-content' }}>
            {upcommingBatches.map((item, index) => 
              item.status !== "running" && (
                <motion.div
                  key={item.id}
                  className="flex-shrink-0 w-80"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BatchCard
                    batch={item}
                    onClick={() => {
                      console.log('Selected batch:', item);
                    }}
                  />
                </motion.div>
              )
            )}
          </div>
        </motion.div>

        {/* Recent Activity - Your original section */}
       
      </div>

      {/* Exam Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Select Exam & Faculty</h1>
                  <p className="text-gray-600">Choose your exam and faculty combination</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Selection Card */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                {/* Exam Selection */}
                <div className="p-6 bg-white border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Book className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-800">Select Exam</h2>
                  </div>
                  
                  <div className="grid gap-3">
                    {facultyExam.map((exam) => (
                      <div
                        key={exam.id}
                        onClick={() => handleExamSelect(exam)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedExam?.id === exam.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
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
                      </div>
                    ))}
                  </div>
                </div>

                {/* Faculty Selection */}
                {selectedExam && (
                  <div className="p-6 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="w-6 h-6 text-green-600" />
                      <h2 className="text-xl font-semibold text-gray-800">Select Faculty</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {selectedExam.faculty.map((faculty) => (
                        <div
                          key={faculty.id}
                          onClick={() => handleFacultySelect(faculty)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            selectedFaculty?.id === faculty.id
                              ? 'border-green-500 bg-green-50 shadow-md'
                              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">{faculty.name}</h3>
                            {selectedFaculty?.id === faculty.id && (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Current Selection Summary */}
                    {selectedFaculty && (
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Current Selection:</h3>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            Exam: {selectedExam.name} (ID: {selectedExam.id})
                          </span>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                            Faculty: {selectedFaculty.name} (ID: {selectedFaculty.id})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            {selectedExam && selectedFaculty && (
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => await handleSave()}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-5 h-5" />
                    Save Selection
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default HomeScreen;