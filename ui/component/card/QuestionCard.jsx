import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Calendar,
  BookOpen,
  CheckCircle,
  Lock,
  PlayCircle,
  FileText,
  Award,
  Eye,
  Download,
  X,
  CrossIcon,
  AlertCircle
} from 'lucide-react';

const QuestionCard = ({ 
  item, 
  onClick, 
  onTakeExam, 
  onViewResult, 
  onViewQuestions, 
  onStudyMaterials,
  onUpgrade = null // Optional upgrade action callback
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAccessIcon = () => {
    if (item.has_exam_access && item.has_content_access) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (item.has_exam_access) {
      return <BookOpen className="w-4 h-4 text-blue-500" />;
    } else {
      return <Lock className="w-4 h-4 text-red-500" />;
    }
  };

  const getAccessText = () => {
    if (item.has_exam_access && item.has_content_access) {
      return 'Full Access';
    } else if (item.has_exam_access) {
      return 'Exam Only';
    } else {
      return 'No Access';
    }
  };

  const getAccessBadgeColor = () => {
    if (item.has_exam_access && item.has_content_access) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (item.has_exam_access) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else {
      return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation(); // Prevent card click when button is clicked
    action();
  };

  // Handle take exam with access validation using existing item property
  const handleTakeExamClick = (e) => {
    e.stopPropagation();
    
    if (!item.has_exam_access) {
      // Show access denied message
      const message = 'You need an active exam package to take this exam. Please upgrade your subscription.';
      
      alert(message);
      
      // Call upgrade function if provided
      if (onUpgrade) {
        onUpgrade();
      }
      return;
    }
    
    onTakeExam(item);
  };

  // Get the appropriate button style for take exam using existing item property
  const getTakeExamButtonStyle = () => {
    if (!item.has_exam_access) {
      return "w-full flex items-center justify-center gap-2 bg-gray-400 text-white py-2.5 px-4 rounded-lg font-medium cursor-not-allowed opacity-70";
    }
    return "w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-500 text-white py-2.5 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg";
  };

  return (
    <motion.div
      onClick={() => onClick && onClick(item)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white border border-gray-200 rounded-xl p-2 cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-blue-300 group"
    >
      {/* Header */}
      <div className="flex justify-between items-start ">
        <div className="flex-1 pr-4">
          <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
            {item.syllabus}
          </h3>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full font-medium shadow-sm">
              {item.attended ? <CheckCircle className="w-3 h-3" /> : <CrossIcon className="w-3 h-3"/>}
              {item.attended ? "Attended" : "Unattended"}
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getAccessBadgeColor()}`}>
            {getAccessIcon()}
            <span>{getAccessText()}</span>
          </div>
        </div>
      </div>

      {/* Content Info */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-lg">
              {item.batch}
            </span>
            {item.is_free && (
              <span className="text-xs bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full font-bold shadow-sm">
                FREE
              </span>
            )}
          </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{formatDate(item.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">৳</span>
          </div>
          <span className="font-semibold text-green-700">৳{item.quetsion_payment}</span>
        </div>
      </div>

      {/* Access Warning Banner - Show when no exam access */}
      {!item.has_exam_access && !item.attended && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-sm text-yellow-800">
                Exam access required to take this exam.
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onUpgrade) onUpgrade();
                }}
                className="text-sm font-medium text-yellow-900 underline hover:text-yellow-700 transition-colors ml-1"
              >
                Upgrade now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex grid-cols-2 gap-4">
        {/* Common Study Materials Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => handleButtonClick(e, () => onStudyMaterials(item))}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <BookOpen className="w-4 h-4" />
          Study Materials
        </motion.button>

        {/* Conditional Buttons based on attendance */}
        {item.attended ? (
          // If attended - show Result and Questions buttons
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => handleButtonClick(e, () => onViewResult(item))}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
            >
              <Award className="w-4 h-4" />
              Result
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => handleButtonClick(e, () => onViewQuestions(item))}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
            >
              <FileText className="w-4 h-4" />
              Questions
            </motion.button>
          </div>
        ) : (
          // If not attended - show Take Exam button with access control
          <motion.button
            whileHover={item.has_exam_access ? { scale: 1.02 } : {}}
            whileTap={item.has_exam_access ? { scale: 0.98 } : {}}
            onClick={handleTakeExamClick}
            disabled={!item.has_exam_access}
            className={getTakeExamButtonStyle()}
          >
            {item.has_exam_access ? (
              <>
                <PlayCircle className="w-4 h-4" />
                Take Exam
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Locked - Upgrade Required
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Hover Effect Indicator */}
      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;