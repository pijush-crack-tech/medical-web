'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, BookOpen, Send, AlertCircle, Timer, Check, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useExamStore } from '@/store/ExamStore';

// Enhanced ExamCard component to handle different question types
const EnhancedExamCard = ({ 
  questionNumber, 
  question, 
  options, 
  questionType,
  selectedOption, 
  onOptionSelect, 
  showResult, 
  explanation, 
  disabled 
}) => {
  const isMultipleChoice = questionType === '1' || questionType === '3';
  const isSingleChoice = questionType === '2' || questionType === '4';

  const handleSingleChoice = (optionIndex) => {
    if (!disabled) {
      onOptionSelect(optionIndex);
    }
  };

  const handleMultipleChoice = (optionIndex) => {
    if (!disabled) {
      // For multiple choice, selectedOption should be an array or object
      const currentSelections = selectedOption || {};
      const newSelections = {
        ...currentSelections,
        [optionIndex]: !currentSelections[optionIndex]
      };
      onOptionSelect(newSelections);
    }
  };

  const isOptionSelected = (optionIndex) => {
    if (isMultipleChoice) {
      return selectedOption && selectedOption[optionIndex];
    }
    return selectedOption === optionIndex;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
              Q{questionNumber}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              isMultipleChoice 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {isMultipleChoice ? 'Multiple Select' : 'Single Select'}
            </span>
          </div>
          
          <div 
            className="text-gray-900 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: question }}
          />

          {/* Instructions based on question type */}
          {isMultipleChoice && (
            <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-700 font-medium">
                📝 Instructions: Select True or False for each option
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: disabled ? 1 : 1.01 }}
            whileTap={{ scale: disabled ? 1 : 0.99 }}
            className={`
              p-4 rounded-lg border-2 transition-all cursor-pointer
              ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:shadow-md'}
              ${isOptionSelected(index)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
              }
            `}
            onClick={() => {
              if (isMultipleChoice) {
                handleMultipleChoice(index);
              } else {
                handleSingleChoice(index);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                {/* Selection Indicator */}
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${isOptionSelected(index)
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                  }
                `}>
                  {isOptionSelected(index) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Option Text */}
                <div 
                  className="flex-1 text-gray-800"
                  dangerouslySetInnerHTML={{ __html: option }}
                />
              </div>

              {/* Multiple Choice True/False Buttons */}
              {isMultipleChoice && (
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!disabled) {
                        const currentSelections = selectedOption || {};
                        const newSelections = { ...currentSelections, [index]: true };
                        onOptionSelect(newSelections);
                      }
                    }}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-full transition-all
                      ${selectedOption && selectedOption[index] === true
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                      }
                      ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    disabled={disabled}
                  >
                    True
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!disabled) {
                        const currentSelections = selectedOption || {};
                        const newSelections = { ...currentSelections, [index]: false };
                        onOptionSelect(newSelections);
                      }
                    }}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-full transition-all
                      ${selectedOption && selectedOption[index] === false
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                      }
                      ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    disabled={disabled}
                  >
                    False
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Explanation (if available and should be shown) */}
      {showResult && explanation && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Explanation:</h4>
          <div 
            className="text-yellow-700"
            dangerouslySetInnerHTML={{ __html: explanation }}
          />
        </div>
      )}
    </div>
  );
};

// Component that uses useSearchParams - needs to be wrapped in Suspense
const ExamContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const question_id = searchParams.get('question_id');

  const {
    examApi,
    examData,
    setQuestionId,
    questionId,
    loading,
    error,
    selectedAnswers,
    setSelectedAnswer,
    timeRemaining,
    examStarted,
    examCompleted,
    startExam,
    updateTimer,
    initializeTimer,
    resetExam,
    submitExam
  } = useExamStore();

  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [timerRestored, setTimerRestored] = useState(false);

  // Fetch exam data on component mount
  useEffect(() => {
    if (question_id && !examData) {
      examApi(question_id);
    }
    
    // Initialize timer on component mount (handles page refresh)
    if (examStarted && !examCompleted && timeRemaining > 0) {
      initializeTimer();
      setTimerRestored(true);
      // Hide the restored message after 3 seconds
      setTimeout(() => setTimerRestored(false), 3000);
    }
  }, [question_id, examData, examApi, initializeTimer, examStarted, examCompleted, timeRemaining]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (examStarted && timeRemaining > 0 && !examCompleted) {
      interval = setInterval(() => {
        updateTimer();
      }, 1000);
    } else if (timeRemaining === 0 && !examCompleted) {
      // Auto-submit when time is up
      handleSubmitExam();
    }
    
    return () => clearInterval(interval);
  }, [examStarted, timeRemaining, examCompleted, updateTimer]);

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Enhanced option selection handler
  const handleOptionSelect = (questionId, selection) => {
    if (!examCompleted) {
      setSelectedAnswer(questionId, selection);
    }
  };

  // Convert selectedAnswers to API format for submission
  const formatAnswersForSubmission = () => {
    const formattedAnswers = [];
    
    examData?.question_sheet?.forEach((question) => {
      const questionId = question.id;
      const questionType = question.type;
      const selectedAnswer = selectedAnswers[questionId];
      
      let formattedAnswer = '';
      
      if (questionType === '1' || questionType === '3') {
        // Multiple choice format: "1-2-0-0-0" (1=true, 2=false, 0=not answered)
        const answerArray = ['0', '0', '0', '0', '0']; // Default to not answered
        
        if (selectedAnswer && typeof selectedAnswer === 'object') {
          Object.entries(selectedAnswer).forEach(([optionIndex, value]) => {
            const index = parseInt(optionIndex);
            if (index >= 0 && index < 5) {
              if (value === true) {
                answerArray[index] = '1';
              } else if (value === false) {
                answerArray[index] = '2';
              }
              // If undefined/null, keep as '0'
            }
          });
        }
        
        formattedAnswer = answerArray.join('-');
      } else if (questionType === '2' || questionType === '4') {
        // Single choice format: option index or "-1" for not answered
        if (selectedAnswer !== undefined && selectedAnswer !== null) {
          formattedAnswer = selectedAnswer.toString();
        } else {
          formattedAnswer = '-1';
        }
      }
      
      formattedAnswers.push({
        q: questionId,
        t: questionType,
        a: formattedAnswer
      });
    });
    
    return formattedAnswers;
  };

  // Handle exam submission with proper formatting
  const handleSubmitExam = async () => {
    try {
      const formattedAnswers = formatAnswersForSubmission();
      const submissionData = {
        question_id: parseInt(questionId),
        answers: formattedAnswers
      };
      
      console.log('Submitting exam data:', submissionData);
      
      // Call the store's submitExam with formatted data
      await submitExam(submissionData);
      setShowConfirmSubmit(false);
    } catch (error) {
      console.error('Failed to submit exam:', error);
    }
  };

  // Enhanced answered questions count with proper validation
  const getAnsweredCount = () => {
    let count = 0;
    examData?.question_sheet?.forEach(question => {
      const questionType = question.type;
      const answer = selectedAnswers[question.id];
      
      if (questionType === '1' || questionType === '3') {
        // Multiple choice - check if any option has true/false selected
        if (answer && typeof answer === 'object') {
          const hasValidSelection = Object.values(answer).some(val => val === true || val === false);
          if (hasValidSelection) count++;
        }
      } else if (questionType === '2' || questionType === '4') {
        // Single choice - check if an option is selected (not -1)
        if (answer !== undefined && answer !== null && answer !== -1) count++;
      }
    });
    return count;
  };

  // Calculate total questions
  const getTotalQuestions = () => {
    return examData?.question_sheet?.length || 0;
  };

  // Check if time is running low (less than 5 minutes)
  const isTimeRunningLow = () => {
    return timeRemaining < 300; // 5 minutes
  };

  // Enhanced submission validation with proper API format preview
  const getSubmissionSummary = () => {
    let singleChoiceAnswered = 0;
    let multipleChoiceAnswered = 0;
    let singleChoiceTotal = 0;
    let multipleChoiceTotal = 0;

    examData?.question_sheet?.forEach(question => {
      const questionType = question.type;
      const answer = selectedAnswers[question.id];
      
      if (questionType === '1' || questionType === '3') {
        multipleChoiceTotal++;
        if (answer && typeof answer === 'object') {
          const hasValidSelection = Object.values(answer).some(val => val === true || val === false);
          if (hasValidSelection) multipleChoiceAnswered++;
        }
      } else if (questionType === '2' || questionType === '4') {
        singleChoiceTotal++;
        if (answer !== undefined && answer !== null && answer !== -1) singleChoiceAnswered++;
      }
    });

    return {
      singleChoiceAnswered,
      multipleChoiceAnswered,
      singleChoiceTotal,
      multipleChoiceTotal,
      totalAnswered: singleChoiceAnswered + multipleChoiceAnswered,
      totalQuestions: singleChoiceTotal + multipleChoiceTotal
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-6 rounded-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  

  if (examCompleted) {
    const summary = getSubmissionSummary();
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-green-50 p-8 rounded-lg max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">Exam Completed!</h2>
          <p className="text-green-700 mb-4">
            You've successfully submitted your exam. Thank you for participating.
          </p>
          <div className="text-sm text-green-600 mb-6 space-y-1">
            <p>Total Questions Answered: {summary.totalAnswered} / {summary.totalQuestions}</p>
            <p>Single Choice: {summary.singleChoiceAnswered} / {summary.singleChoiceTotal}</p>
            <p>Multiple Choice: {summary.multipleChoiceAnswered} / {summary.multipleChoiceTotal}</p>
          </div>
          <button
            onClick={() => {
              resetExam()
              router.push('/')
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    ); 
  }
  
  if (!examData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No exam data available</p>
        <button
            onClick={() => {
              router.push('/')
              resetExam()
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Return to Home
          </button>

      </div>
    );
  }

   

  const summary = getSubmissionSummary();

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          {/* Exam Title and Syllabus */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-600 truncate">
                {examData.syllabus}
              </p>
            </div>
          </div>

          {/* Progress and Controls */}
          {examStarted && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="text-sm">
                  <span className="text-gray-600">Progress: </span>
                  <span className="font-semibold">
                    {summary.totalAnswered} / {summary.totalQuestions}
                  </span>
                </div>
                <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(summary.totalAnswered / summary.totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                {examStarted && (
                  <div className="flex flex-col items-end">
                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-mono font-semibold ${
                      isTimeRunningLow() ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      <Timer className="h-4 w-4" />
                      <span>{formatTime(timeRemaining)}</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setShowConfirmSubmit(true)}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                >
                  <Send className="h-3 w-3" />
                  <span>Submit</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content with top padding */}
      <div className={`${examStarted ? 'pt-24' : 'pt-8'} py-16 text-black`}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Pre-exam start panel */}
          {!examStarted && (
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Ready to Start?</h2>
                <p className="text-gray-600 mb-4">
                  You have {examData.examtime} minutes to complete this exam with {getTotalQuestions()} questions.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Available from {examData.start_time} to {examData.end_time}
                </p>
                <button
                  onClick={startExam}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Start Exam
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="ml-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  Back Home
                </button>
              </div>
            </div>
          )}

          {/* Questions */}
          {examStarted && (
            <div className="space-y-6">
              {examData.question_sheet.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EnhancedExamCard
                    questionNumber={parseInt(question.id)}
                    question={question.question}
                    questionType={question.type}
                    options={[
                      question.option1,
                      question.option2,
                      question.option3,
                      question.option4,
                      question.option5
                    ].filter(Boolean)}
                    selectedOption={selectedAnswers[question.id]}
                    onOptionSelect={(selection) => handleOptionSelect(question.id, selection)}
                    showResult={false}
                    explanation={question.explaination}
                    disabled={examCompleted}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Submit Confirmation Modal */}
          {showConfirmSubmit && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Confirm Submission</h3>
                <div className="space-y-3 mb-4">
                  <p className="text-gray-600">
                    Are you sure you want to submit your exam?
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="space-y-1">
                      <p><span className="font-medium">Total Questions:</span> {summary.totalQuestions}</p>
                      <p><span className="font-medium">Answered:</span> {summary.totalAnswered}</p>
                      <p><span className="font-medium">Single Choice:</span> {summary.singleChoiceAnswered}/{summary.singleChoiceTotal}</p>
                      <p><span className="font-medium">Multiple Choice:</span> {summary.multipleChoiceAnswered}/{summary.multipleChoiceTotal}</p>
                    </div>
                  </div>
                  
                  {/* Debug Preview - Remove in production */}
                  <details className="bg-blue-50 p-3 rounded-lg">
                    <summary className="text-sm font-medium text-blue-800 cursor-pointer">
                      Preview submission data (Debug)
                    </summary>
                    <pre className="text-xs bg-white p-2 rounded mt-2 overflow-x-auto max-h-40 overflow-y-auto">
                      {JSON.stringify({
                        question_id: parseInt(question_id),
                        answers: formatAnswersForSubmission().slice(0, 5) // Show first 5 for preview
                      }, null, 2)}
                    </pre>
                    <p className="text-xs text-blue-600 mt-1">
                      Showing first 5 answers. Total: {formatAnswersForSubmission().length} answers
                    </p>
                  </details>
                </div>
                <p className="text-sm text-red-600 mb-6">
                  This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmSubmit(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitExam}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading fallback component
const ExamLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading exam...</p>
    </div>
  </div>
);

// Main component wrapped with Suspense
const QuestionCardDemo = () => {
  return (
    <Suspense fallback={<ExamLoadingFallback />}>
      <ExamContent />
    </Suspense>
  );
};

export default QuestionCardDemo;