import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X
} from 'lucide-react';
import { useCentralArchiveStore } from '@/store/CentralArchiveStore';
import { useRouter } from 'next/navigation';
import QuestionCard from '../card/QuestionCard';
import { useExamQuestion } from '@/store/ExamStore';
import { useHomeStore } from '@/store/HomeStore';



// Main Archive Modal Component
const ArchiveModal = ({ isOpen, onClose, onItemSelect, fetchArchiveData }) => {

  const router = useRouter()

  const getExamQuestion = useExamQuestion()

  const {
    archiveData,
    archiveApi,
    loading,
    viewMode,
    changeViewModeToGrid,
    changeViewModeToList,
    
  } = useCentralArchiveStore()

  const {
    getMarkSheet,
    getQuestion
  } = useHomeStore()


  const fetchData = async () => {``
    await archiveApi();
  }


  const handleItemClick = (item) => {
    onItemSelect(item);
    onClose();
  };


  const handleResultClick = async (item) => {
    await getMarkSheet(item.question_id, 2)
  }

  const handleQuestionClick = async (item) => {
    await getQuestion(item.question_id)
    router.replace('/question-view')
  }



  const handlePageChange = (page) => {
    if (page >= 1 && page <= archiveData?.num_pages) {
      fetchData(page);
    }
  };


  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
                <h1 className="text-2xl font-bold text-gray-800">Archive</h1>
                <p className="text-gray-600">
                  {archiveData?.total_items || 0} items available
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className='flex gap-3 text-black'>
              <motion.button
                className="bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-2 hover:shadow-xl transition-shadow"
              >
                All
              </motion.button>

              <motion.button
                className="bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-2 hover:shadow-xl transition-shadow"
              >
                Attended
              </motion.button>

              <motion.button
                className="bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-2 hover:shadow-xl transition-shadow"
              >
                Unattended
              </motion.button>
            </div>
            
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {archiveData && archiveData.page_data.map((item) => (
                  <QuestionCard
                    key={item.question_id}
                    item={item}
                    onTakeExam={async () => {
                        await getExamQuestion(item?.question_id)
                        router.push('/exam')
                    }}
                    onClick={handleItemClick}
                    onViewResult = { async () => await handleResultClick(item)}
                    onViewQuestions = { async () => await handleQuestionClick(item)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {archiveData?.num_pages > 1 && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {archiveData.current_page} of {archiveData.num_pages} 
                  ({archiveData.total_items} total items)
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(archiveData.previous_page_number)}
                    disabled={!archiveData.has_previous}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: archiveData.num_pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          archiveData.current_page === page
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(archiveData.next_page_number)}
                    disabled={!archiveData.has_next}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};



export default ArchiveModal;