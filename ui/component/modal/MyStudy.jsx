import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  BookOpen,
  Video,
  FileText,
  Filter,
  Grid,
  List,
  Clock,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  User
} from 'lucide-react';
import { useHomeStore } from '@/store/HomeStore';
import { useExamStore } from '@/store/ExamStore';
import { useRouter } from 'next/navigation';

// Current Batch Card
const CurrentBatchCard = ({ batch }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-6 mb-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-blue-900 mb-1">{batch.text}</h3>
          <p className="text-blue-700 text-sm">Current Active Batch</p>
        </div>
        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {batch.is_live ? 'Live' : 'Active'}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2 text-blue-700">
          <BookOpen className="w-4 h-4" />
          <span className="text-sm">{batch.exam_count} Exams</span>
        </div>
        <div className="flex items-center gap-2 text-blue-700">
          <Video className="w-4 h-4" />
          <span className="text-sm">{batch.video_count} Videos</span>
        </div>
        <div className="flex items-center gap-2 text-blue-700">
          <FileText className="w-4 h-4" />
          <span className="text-sm">{batch.pdf_count} PDFs</span>
        </div>
        <div className="flex items-center gap-2 text-blue-700">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{formatDate(batch.start_date)}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        {batch.has_exam_access && (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            Exam Access
          </span>
        )}
        {batch.has_content_access && (
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
            <PlayCircle className="w-3 h-3" />
            Content Access
          </span>
        )}
      </div>
    </motion.div>
  );
};

// Missed Exam Card
const MissedExamCard = ({ exam , onTakeExam}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-red-50 border border-red-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-red-900 text-sm mb-1">{exam.text}</h4>
          <p className="text-xs text-red-600 mb-1">Question ID: {exam.question_id}</p>
          <p className="text-xs text-gray-600">{exam.syllabus}</p>
        </div>
        <div className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
          <AlertCircle className="w-3 h-3" />
          {exam.status}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(exam.date)}
        </div>
        <button 
            onClick={onTakeExam}
        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors">
          Take Now
        </button>
      </div>
    </motion.div>
  );
};

// User Batch Card
const UserBatchCard = ({ batch, onMakeDefault }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{batch.text}</h3>
          <p className="text-xs text-gray-500">Batch ID: {batch.id}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.is_active)}`}>
          {batch.is_active ? 'Active' : 'Inactive'}
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          {batch.exam_count}
        </div>
        <div className="flex items-center gap-1">
          <Video className="w-3 h-3" />
          {batch.video_count}
        </div>
        <div className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {batch.pdf_count}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-gray-500">
          <Calendar className="w-3 h-3" />
          {formatDate(batch.start_date)}
        </div>
        <button 
        onClick={onMakeDefault}
        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors">
          Make Default
        </button>
      </div>
    </motion.div>
  );
};

const MyStudyModal = ({ isOpen, onClose, studyData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const router = useRouter()

  const {
    myStudy,
    makeBatchDefault,
    home
   } = useHomeStore()

   const {
     examApi,
     resetExam
   } = useExamStore()

  // Filter user batches based on search
  const filteredUserBatches = myStudy?.user_batch?.filter(batch =>
    batch.text.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Study Dashboard</h1>
                <p className="text-gray-600">Track your progress and manage your courses</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 mt-4 border-b">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'batches', label: 'My Batches', icon: BookOpen },
                { id: 'missed', label: 'Missed Exams', icon: AlertCircle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'missed' && myStudy?.missed_exam?.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {myStudy.missed_exam.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Current Batch */}
                {myStudy?.my_batch && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Batch</h2>
                    <CurrentBatchCard batch={myStudy.my_batch} />
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-8 h-8" />
                      <div>
                        <p className="text-green-100 text-sm">Total Batches</p>
                        <p className="text-2xl font-bold">{myStudy?.user_batch?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-400 to-red-600 text-white p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-8 h-8" />
                      <div>
                        <p className="text-red-100 text-sm">Missed Exams</p>
                        <p className="text-2xl font-bold">{myStudy?.missed_exam?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8" />
                      <div>
                        <p className="text-blue-100 text-sm">Active Batches</p>
                        <p className="text-2xl font-bold">
                          {myStudy?.user_batch?.filter(batch => batch.is_active)?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Batches Tab */}
            {activeTab === 'batches' && (
              <div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search your batches..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {filteredUserBatches.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No batches found</h3>
                    <p className="text-gray-500">You haven't enrolled in any batches yet</p>
                  </div>
                ) : (
                  <div className={`grid gap-4 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {filteredUserBatches.map((batch) => (
                      <UserBatchCard key={batch.user_batch_table_id} batch={batch} 
                      onMakeDefault={async () => {
                        await makeBatchDefault(batch.id)
                         await home()
                      }}/>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Missed Exams Tab */}
            {activeTab === 'missed' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Missed Exams</h2>
                {!myStudy?.missed_exam || myStudy.missed_exam.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">All caught up!</h3>
                    <p className="text-gray-500">You have no missed exams</p>
                  </div>
                ) : (
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {myStudy.missed_exam.map((exam, index) => (
                      <MissedExamCard key={`${exam.question_id}-${index}`} exam={exam} 
                      onTakeExam={
                        async () => {
                            resetExam()
                            await examApi(exam.question_id)
                            router.push('/exam')
                        }
                      }/>
                    ))}
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

export default MyStudyModal;