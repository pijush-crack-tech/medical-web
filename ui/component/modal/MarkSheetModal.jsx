import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X, 
  Trophy, 
  Medal, 
  Award, 
  Calendar,
  Users,
  Target,
  CheckCircle,
  XCircle,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { useHomeStore } from '@/store/HomeStore';

// Main MarkSheet Modal Component
const MarkSheetModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  const {
    markSheet
  } = useHomeStore();

  // Calculate performance metrics
  const getPerformanceData = () => {
    if (!markSheet) return null;
    
    const totalQuestions = markSheet.type.reduce((sum, type) => sum + type.right + type.wrong, 0);
    const totalCorrect = markSheet.type.reduce((sum, type) => sum + type.right, 0);
    const totalWrong = markSheet.type.reduce((sum, type) => sum + type.wrong, 0);
    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    const isPassed = markSheet.mark >= markSheet.pass_mark;

    return {
      totalQuestions,
      totalCorrect,
      totalWrong,
      accuracy,
      isPassed
    };
  };

  const performanceData = getPerformanceData();

  // Get grade based on performance
  const getGrade = (mark, passMark) => {
    const percentage = (mark / passMark) * 100;
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600 bg-green-50' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600 bg-green-50' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600 bg-blue-50' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-600 bg-blue-50' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-600 bg-yellow-50' };
    return { grade: 'F', color: 'text-red-600 bg-red-50' };
  };

  const gradeInfo = markSheet ? getGrade(markSheet.mark, markSheet.pass_mark) : null;

  if (!isOpen) return null;

  if (loading) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
        >
          {/* Compact Modal Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <h1 className="text-lg font-bold text-gray-800">Mark Sheet</h1>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(85vh-60px)]">
            {!markSheet ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No mark sheet data available.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Compact Performance Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Score Card */}
                  <div className={`p-3 rounded-lg border ${
                    performanceData?.isPassed 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-600 mb-1">Score</p>
                      <p className={`text-xl font-bold ${
                        performanceData?.isPassed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {markSheet.mark}
                      </p>
                      <p className="text-xs text-gray-500">/ {markSheet.pass_mark}</p>
                    </div>
                  </div>

                  {/* Position Card */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <p className="text-xs font-medium text-blue-600 mb-1">Position</p>
                      <p className="text-xl font-bold text-blue-700">{markSheet.probable_position}</p>
                      <p className="text-xs text-blue-500">/ {markSheet.total_participants}</p>
                    </div>
                  </div>

                  {/* Accuracy Card */}
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-center">
                      <p className="text-xs font-medium text-purple-600 mb-1">Accuracy</p>
                      <p className="text-xl font-bold text-purple-700">
                        {performanceData?.accuracy.toFixed(1)}%
                      </p>
                      <p className="text-xs text-purple-500">
                        {performanceData?.totalCorrect}/{performanceData?.totalQuestions}
                      </p>
                    </div>
                  </div>

                  {/* Grade Card */}
                  <div className={`p-3 rounded-lg border ${gradeInfo?.color.replace('text-', 'border-').replace('bg-', 'border-').replace('-600', '-200').replace('-50', '')}`}>
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-600 mb-1">Grade</p>
                      <p className={`text-xl font-bold ${gradeInfo?.color.split(' ')[0]}`}>
                        {gradeInfo?.grade}
                      </p>
                      <p className="text-xs text-gray-500">
                        {performanceData?.isPassed ? 'Passed' : 'Failed'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compact Exam Details */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="text-center">
                      <p className="font-medium text-gray-600">Date</p>
                      <p className="text-gray-800 mt-1">{markSheet.exam_date}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-600">Participants</p>
                      <p className="text-gray-800 mt-1">{markSheet.total_participants}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-600">Passed</p>
                      <p className="text-gray-800 mt-1">{markSheet.total_passed}</p>
                    </div>
                  </div>
                </div>

                {/* Compact Question Type Performance */}
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                    Question Types
                  </h3>
                  <div className="space-y-2">
                    {markSheet.type.map((questionType, index) => {
                      const total = questionType.right + questionType.wrong;
                      const accuracy = total > 0 ? (questionType.right / total) * 100 : 0;
                      
                      return (
                        <div key={questionType.name} className="bg-gray-50 rounded-md p-2">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-800">{questionType.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              accuracy >= 70 ? 'bg-green-100 text-green-700' :
                              accuracy >= 50 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {accuracy.toFixed(0)}%
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs mb-1">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <span className="text-green-600">{questionType.right}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-red-600" />
                              <span className="text-red-600">{questionType.wrong}</span>
                            </div>
                            <div className="text-gray-600">{total} total</div>
                          </div>
                          
                          {/* Compact Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full transition-all duration-300 ${
                                accuracy >= 70 ? 'bg-green-500' :
                                accuracy >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${accuracy}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Compact Success/Failure Message */}
                <div className={`rounded-lg p-3 text-center ${
                  performanceData?.isPassed 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                    performanceData?.isPassed ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {performanceData?.isPassed ? (
                      <Trophy className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <h3 className={`text-base font-bold mb-1 ${
                    performanceData?.isPassed ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {performanceData?.isPassed ? 'Congratulations! 🎉' : 'Keep Practicing! 💪'}
                  </h3>
                  <p className={`text-xs ${
                    performanceData?.isPassed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {performanceData?.isPassed 
                      ? `Passed with ${markSheet.mark}/${markSheet.pass_mark}`
                      : `Scored ${markSheet.mark}/${markSheet.pass_mark}`
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


export default MarkSheetModal;