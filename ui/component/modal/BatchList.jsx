
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
  List
} from 'lucide-react';
import { useBatchModalStore } from '@/store/modal/BatchModalStore';

// Mini BatchCard for the modal list
const MiniNatchCard = ({ batch, onClick, onEnroll }) => {
  const getStatus = () => {
    if (batch != null) {
      const today = new Date();
      const startDate = new Date(batch.start_date);
      const endDate = new Date(batch.end_date);
      
      today.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      if (startDate > today) return 'upcoming';      
      else if (startDate <= today && endDate >= today) return 'running';  
      else return 'completed'; 
    }
    return 'unknown';
  };

  const status = getStatus();
  
  const getStatusStyles = () => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      // onClick={() => onClick(batch)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{batch.text}</h3>
          <p className="text-xs text-gray-500">ID: {batch.id}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
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
      
      <div className="text-xs text-gray-500 flex justify-between">
        <span>{formatDate(batch.start_date)}</span>
        <span>{formatDate(batch.end_date)}</span>
      </div>
      
      {batch.published && (
        <div className="flex justify-between mt-2">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            ✓ Published
          </span>
          {(getStatus != "upcoming" && getStatus != "unknown") && 
          <motion.button 
          onClick={onEnroll}
          className='px-2 rounded-md bg-teal-900 hover:shadow-xl transition-shadow'>
            Enroll
          </motion.button>}
        </div>
      )}
    </motion.div>
  );
};

const BatchListModal = ({ isOpen, onClose, onBatchSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const itemsPerPage = 9;

  const {
    batchData,
    batchApi,
    loading,
    page,
    enrollBatch
  } = useBatchModalStore()

  useEffect(() => {
    if(isOpen && batchData == null){
      batchApi();
    }
  },[isOpen, batchData])



  // Sample batch data - replace with your actual data
  const allBatches = [
    {
      id: 1,
      text: "FCPS CRASH 2025",
      start_date: "2025-09-01",
      end_date: "2025-09-30",
      slug: "FCPS-Crash-2025",
      published: true,
      video_count: 15,
      pdf_count: 5,
      exam_count: 8
    },
    {
      id: 2,
      text: "Surgery Intensive Course",
      start_date: "2025-08-15",
      end_date: "2025-10-15",
      slug: "surgery-intensive",
      published: true,
      video_count: 25,
      pdf_count: 8,
      exam_count: 12
    },
    {
      id: 3,
      text: "Pediatrics Foundation",
      start_date: "2025-10-01",
      end_date: "2025-12-01",
      slug: "pediatrics-foundation",
      published: true,
      video_count: 20,
      pdf_count: 12,
      exam_count: 15
    },
    {
      id: 4,
      text: "Cardiology Advanced",
      start_date: "2025-11-01",
      end_date: "2025-12-15",
      slug: "cardiology-advanced",
      published: false,
      video_count: 18,
      pdf_count: 6,
      exam_count: 10
    },
    {
      id: 5,
      text: "Emergency Medicine",
      start_date: "2025-07-01",
      end_date: "2025-07-31",
      slug: "emergency-medicine",
      published: true,
      video_count: 22,
      pdf_count: 9,
      exam_count: 14
    },
    {
      id: 6,
      text: "Radiology Basics",
      start_date: "2025-12-01",
      end_date: "2026-01-15",
      slug: "radiology-basics",
      published: true,
      video_count: 16,
      pdf_count: 7,
      exam_count: 9
    }
  ];

  // Filter batches based on search and status filter
  const getFilteredBatches = () => {
    let filtered = allBatches.filter(batch =>
      batch.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== 'all') {
      filtered = filtered.filter(batch => {
        const today = new Date();
        const startDate = new Date(batch.start_date);
        const endDate = new Date(batch.end_date);
        
        today.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        const status = startDate > today ? 'upcoming' : 
                      (startDate <= today && endDate >= today) ? 'running' : 
                      'completed';
        
        return status === filterStatus;
      });
    }

    return filtered;
  };

  const filteredBatches = getFilteredBatches();
  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBatches = filteredBatches.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleBatchClick = (batch) => {
    onBatchSelect(batch);
    onClose();
  };

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
                <h1 className="text-2xl font-bold text-gray-800">Select a Batch</h1>
                <p className="text-gray-600">Choose from {filteredBatches.length} available batches</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              

              {/* View Mode Toggle */}
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
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {currentBatches.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <BookOpen className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No batches found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {batchData && batchData.page_data.map((batch) => (
                  <MiniNatchCard
                    key={batch.id}
                    batch={batch}
                    onClick={handleBatchClick}
                    onEnroll={()=>{enrollBatch(batch.id)}}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredBatches.length)} of {filteredBatches.length} batches
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          currentPage === page
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
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


export default BatchListModal;