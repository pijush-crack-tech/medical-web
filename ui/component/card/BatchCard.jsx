'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Target,
  Calendar,
  BookOpen,
  Video,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const BatchCard = ({ batch, onClick, variant = 'compact' }) => {
  
  // Early return if no batch data
  if (!batch) return null;
  
  const progress = batch?.batch_progress || 0; 
  
  const getStatus = () => {
    if (batch != null) {
      const today = new Date();
      const startDate = new Date(batch.batch_start_date || batch.start_date);
      const endDate = new Date(batch.batch_end_date || batch.end_date);
      
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
  
  const getStatusConfig = () => {
    switch (status) {
      case 'upcoming':
        return {
          color: 'bg-amber-500',
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          icon: Clock,
          label: 'Starts Soon'
        };
      case 'running':
        return {
          color: 'bg-emerald-500',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          icon: Target,
          label: 'Active'
        };
      case 'completed':
        return {
          color: 'bg-blue-500',
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          icon: CheckCircle2,
          label: 'Completed'
        };
      default:
        return {
          color: 'bg-gray-500',
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          icon: AlertCircle,
          label: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Format dates for display
  const formatDate = (dateString, compact = false) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: compact ? undefined : 'numeric'
    });
  };

  // Get exam stats - FIXED: Add null checks
  const totalExams = batch?.total_exam || batch?.batch_exam_count || batch?.exam_count || 0;
  const attendedExams = batch?.total_exam_attend || 0;
  const missedExams = batch?.missed_exam || 0;
  const remainingExams = Math.max(0, totalExams - attendedExams);

  // Compact variant for home screen
  if (variant === 'compact') {
    return (
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200 relative"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {batch.batch_name || batch.text}
            </h3>
            <p className="text-xs text-gray-500">
              Batch #{batch.batch_id || batch.batch_pk || batch.id}
            </p>
          </div>
          
          <div className={`${statusConfig.bg} ${statusConfig.text} px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0`}>
            {statusConfig.label}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mb-3 text-sm">
          <div className="flex items-center gap-1 text-blue-600">
            <BookOpen className="w-4 h-4" />
            <span className="font-medium">{totalExams}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600">
            <Video className="w-4 h-4" />
            <span className="font-medium">{batch?.batch_video_count || batch?.video_count || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-purple-600">
            <FileText className="w-4 h-4" />
            <span className="font-medium">{batch?.batch_pdf_count || batch?.pdf_count || 0}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {(status === 'running' || status === 'completed') && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Progress</span>
              <span className="text-xs font-bold text-gray-900">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${statusConfig.color}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            {attendedExams > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {attendedExams}/{totalExams} exams completed
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(batch.batch_start_date || batch.start_date, true)}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600">
            <span className="font-medium">Continue</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Live Badge */}
        {batch?.published && (
          <div className="absolute top-2 left-2">
            <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              LIVE
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Default full variant
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
    >
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${statusConfig.bg} rounded-full opacity-10 transform translate-x-16 -translate-y-16`}></div>
      
      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
              {batch.batch_name || batch.text}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              Batch #{batch.batch_id || batch.batch_pk || batch.id}
            </p>
          </div>
          
          <div className={`flex items-center gap-2 ${statusConfig.bg} ${statusConfig.text} px-3 py-2 rounded-xl font-medium text-sm border border-current border-opacity-20`}>
            <statusConfig.icon className="w-4 h-4" />
            {statusConfig.label}
          </div>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center border border-blue-100">
          <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-blue-900">{totalExams}</div>
          <div className="text-xs text-blue-600 font-medium">Exams</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3 text-center border border-emerald-100">
          <Video className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-emerald-900">{batch?.batch_video_count || batch?.video_count || 0}</div>
          <div className="text-xs text-emerald-600 font-medium">Videos</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 text-center border border-purple-100">
          <FileText className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-purple-900">{batch?.batch_pdf_count || batch?.pdf_count || 0}</div>
          <div className="text-xs text-purple-600 font-medium">PDFs</div>
        </div>
      </div>

      {/* Progress Section */}
      {(status === 'running' || status === 'completed') && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusConfig.color}`}></div>
              <span className="text-sm font-medium text-gray-700">Progress</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{Math.round(progress)}%</span>
          </div>

          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ease-out ${statusConfig.color.replace('bg-', 'bg-gradient-to-r from-').replace('-500', '-400 to-').replace('500', '600')}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Exam Progress Details */}
          <div className="space-y-2">
            {attendedExams > 0 && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Completed</span>
                </div>
                <span className="text-sm font-bold text-green-900">{attendedExams} exams</span>
              </div>
            )}

            {missedExams > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700">Missed</span>
                </div>
                <span className="text-sm font-bold text-red-900">{missedExams} exams</span>
              </div>
            )}

            {remainingExams > 0 && status === 'running' && (
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">Remaining</span>
                </div>
                <span className="text-sm font-bold text-amber-900">{remainingExams} exams</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Date Information */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Duration</span>
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-medium">{formatDate(batch.batch_start_date || batch.start_date)}</span>
          <span className="mx-2 text-gray-400">→</span>
          <span className="font-medium">{formatDate(batch.batch_end_date || batch.end_date)}</span>
        </div>
      </div>

      {/* Action Button */}
      <motion.div 
        whileHover={{ x: 4 }}
        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          {status === 'upcoming' && (
            <>
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">Get Ready</span>
            </>
          )}
          {status === 'running' && (
            <>
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">Continue Learning</span>
            </>
          )}
          {status === 'completed' && (
            <>
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">Review & Revise</span>
            </>
          )}
        </div>
        <ArrowRight className="w-5 h-5 text-blue-600 transition-transform duration-200" />
      </motion.div>

      {/* Live Badge */}
      {batch?.published && (
        <div className="absolute top-4 left-4">
          <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            LIVE
          </div>
        </div>)}
      
    </motion.div>
  );
};

export { BatchCard };