'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Target
} from 'lucide-react';

const BatchCard = ({ batch, onClick }) => {
  
  const progress = 65; 
  
  const getStatus = () => {
    if (batch != null) {
      const today = new Date();
      const startDate = new Date(batch.start_date);
      const endDate = new Date(batch.end_date);
      
      // Reset time to compare only dates
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

  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Format dates for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
 
  return (batch &&
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 cursor-pointer hover:shadow-xl transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{batch.text}</h3>
          <p className="text-sm text-gray-500">ID: {batch.id || batch.batch_id}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
          {getStatusText()}
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Content Statistics */}
        <div className="grid grid-cols-3 gap-2 text-xs mb-3">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-800">{batch.exam_count || batch.batch_exam_count }</div>
            <div className="text-blue-600">Exams</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-800">{batch.video_count}</div>
            <div className="text-green-600">Videos</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <div className="font-semibold text-purple-800">{batch.pdf_count}</div>
            <div className="text-purple-600">PDFs</div>
          </div>
        </div>

        {getStatus == 'running' || getStatus() == 'completed' && (
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
            </div>

            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  status === 'completed' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                    : status === 'running'
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target className="w-4 h-4" />
                {Math.round(progress)}% Complete
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}

        
        
        {/* Date Information */}
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex justify-between">
            <span>Start: {formatDate(batch.start_date)}</span>
            <span>End: {formatDate(batch.end_date)}</span>
          </div>
          {batch.published && (
            <div className="mt-1 text-green-600 font-medium">
              ✓ Published
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export { BatchCard };