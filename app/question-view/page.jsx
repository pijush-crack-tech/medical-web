'use client'

import React, { useState } from "react";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Target,
  Clock,
  BookOpen,
  Award,
  X,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  List,
  Grid3X3
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useHomeStore } from "@/store/HomeStore";


// Explanation Modal Component
const ExplanationModal = ({ isOpen, onClose, explanation, questionNumber }) => {

  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <div className="bg-blue-600 text-white p-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Award className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Question {questionNumber} - Explanation</h2>
                  <p className="text-blue-100 text-sm">Detailed explanation and solution</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-2 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div 
              className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: explanation }}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const QuestionView = () => {
  // Using mock data - replace with your actual data source
  const {answerSheet} = useHomeStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswers, setShowAnswers] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'single' or 'list'
  const [explanationModal, setExplanationModal] = useState({ isOpen: false, explanation: '', questionNumber: '' });

  // Parse answer strings for different question types
  const parseAnswers = (answerString, questionType) => {
    if (questionType === '1' || questionType === '3') {
      // Multiple true/false format: "1-1-2-1-2" (1=true, 2=false)
      return answerString.split('-').map(num => parseInt(num));
    } else {
      // Single selection format: "3"
      return parseInt(answerString);
    }
  };

  // Check if an option is correct
  const isOptionCorrect = (question, optionIndex) => {
    const questionType = question.type;
    
    if (questionType === '1' || questionType === '3') {
      // Multiple true/false: 1=true, 2=false
      const answers = parseAnswers(question.answer, questionType);
      return answers[optionIndex] === 1;
    } else {
      // Single selection: compare option number
      const correctAnswer = parseAnswers(question.answer, questionType);
      return (optionIndex + 1) === correctAnswer;
    }
  };

  // Get question type label
  const getQuestionTypeLabel = (type) => {
    switch(type) {
      case '1':
      case '3':
        return 'Multiple True/False';
      case '2':
      case '4':
        return 'Single Best Answer';
      default:
        return 'Unknown Type';
    }
  };

  // Get question type color
  const getQuestionTypeColor = (type) => {
    switch(type) {
      case '1':
      case '3':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case '2':
      case '4':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Navigation functions
  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < (answerSheet?.question_sheet?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    if (viewMode === 'list') {
      setViewMode('single');
    }
  };

  const openExplanationModal = (explanation, questionNumber) => {
    setExplanationModal({
      isOpen: true,
      explanation,
      questionNumber
    });
  };

  const closeExplanationModal = () => {
    setExplanationModal({
      isOpen: false,
      explanation: '',
      questionNumber: ''
    });
  };

  // Render single question
  const renderQuestion = (question, index, isInList = false) => {
    const options = [
      question.option1,
      question.option2, 
      question.option3,
      question.option4,
      question.option5
    ].filter(option => option && option.trim() !== '');

    return (
      <div 
        key={question.id}
        className={`bg-white text-black rounded-xl border border-gray-200 overflow-hidden shadow-sm ${isInList ? '' : ''}`}
      >
        {/* Question Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 text-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="flex items-center justify-center w-10 h-10 bg-white text-blue-600 rounded-lg font-bold text-lg">
                {index + 1}
              </span>
              <div>
                <h2 className="text-xl font-bold">Question {index + 1}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getQuestionTypeColor(question.type)} bg-white`}>
                    {getQuestionTypeLabel(question.type)}
                  </span>
                </div>
              </div>
            </div>
            
            {question.explaination && question.explaination !== "Explaination" && (
              <button
                onClick={() => openExplanationModal(question.explaination, index + 1)}
                className="flex  items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors text-sm"
              >
                <HelpCircle className="w-4 h-4 text-black" />
                <span className="text-black">Explanation</span>
              </button>
            )}
          </div>
        </div>

        {/* Question Content */}
        <div className="p-2">
          {/* Question Text */}
          <div className="mb-2">
            <div 
              className="text-lg text-gray-800 leading-relaxed font-medium prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: question.question }}
            />
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-2">
            {options.map((option, optionIndex) => {
              const isCorrect = isOptionCorrect(question, optionIndex);
              const isMultipleChoice = question.type === '1' || question.type === '3';
              
              return (
                <div 
                  key={optionIndex}
                  className={`p-2 border-2 rounded-lg transition-all duration-300 ${
                    showAnswers && isCorrect 
                      ? 'border-green-400 bg-gradient-to-r from-green-50 to-green-100 shadow-md' 
                      : showAnswers && !isCorrect && isMultipleChoice
                      ? 'border-red-200 bg-gradient-to-r from-red-50 to-red-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${
                      showAnswers && isCorrect 
                        ? 'border-green-500 bg-green-500 shadow-lg' 
                        : showAnswers && !isCorrect && isMultipleChoice
                        ? 'border-red-400 bg-red-400'
                        : 'border-gray-400 bg-gray-50'
                    }`}>
                      {showAnswers && isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : showAnswers && !isCorrect && isMultipleChoice ? (
                        <XCircle className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-sm font-bold text-gray-600">
                          {String.fromCharCode(65 + optionIndex)} {/* A, B, C, D, E */}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div 
                        className={`leading-relaxed transition-all duration-300 ${
                          showAnswers && isCorrect 
                            ? 'text-green-800 font-semibold' 
                            : showAnswers && !isCorrect && isMultipleChoice
                            ? 'text-red-700'
                            : 'text-gray-800'
                        }`}
                        dangerouslySetInnerHTML={{ __html: option }}
                      />
                      {showAnswers && (
                        <div className="flex items-center space-x-2 mt-3">
                          {isCorrect ? (
                            <div className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                              <Award className="w-3 h-3" />
                              <span>{isMultipleChoice ? 'True' : 'Correct Answer'}</span>
                            </div>
                          ) : isMultipleChoice ? (
                            <div className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                              <XCircle className="w-3 h-3" />
                              <span>False</span>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!isInList && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Question {currentQuestionIndex + 1} of {answerSheet.question_sheet?.length}</span>
              </div>

              <button
                onClick={goToNext}
                disabled={currentQuestionIndex === (answerSheet.question_sheet?.length || 0) - 1}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!answerSheet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No questions available</p>
          <p className="text-gray-500 text-sm mt-2">Load question data to view questions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-2 lg:mt-15 md:mt-15 text-black">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Question Bank</h1>
                
              </div>
            </div>

            <div>

                <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{answerSheet.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{answerSheet.question_sheet?.length || 0} Questions</span>
                  </div>

                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('single')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'single' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Single</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex items-center  text-sm font-bold text-gray-600 mt-1">
            <div className="flex items-center">
                
                <span>{answerSheet.syllabus}</span>
            </div>
            
        </div>
        </div>
        
      </div>

      

      <div className="max-w-7xl mx-auto px-6 py-6 ">
        
        {viewMode === 'single' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
            {/* Main Question Panel */}
            <div className="lg:col-span-3">
              {renderQuestion(answerSheet.question_sheet[currentQuestionIndex], currentQuestionIndex)}
            </div>

            {/* Question Navigator Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-2 sticky top-28 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>Questions</span>
                </h3>
                
                <div className="mb-6 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Questions</p>
                      <p className="text-xl font-bold text-blue-700">{answerSheet.question_sheet?.length || 0}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Jump to Question:</h4>
                  <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto">
                    {answerSheet.question_sheet?.map((question, index) => {
                      const isActive = index === currentQuestionIndex;
                      
                      return (
                        <button
                          key={question.id}
                          onClick={() => goToQuestion(index)}
                          className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            isActive 
                              ? 'bg-blue-600 text-white ring-2 ring-blue-200 shadow-md' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Question Types:</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Single Best Answer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span className="text-gray-600">Multiple True/False</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* List View - Vertically Scrollable */
          <div className="w-full text-black">
            <div className="max-w-4xl mx-auto">
              

              {/* Scrollable Questions Container */}
              <div 
                className="space-y-6 overflow-y-auto max-h-[calc(100vh-240px)] pr-2"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#CBD5E1 #F1F5F9'
                }}
              >
                {answerSheet.question_sheet?.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    {renderQuestion(question, index, true)}
                  </motion.div>
                ))}
                
                {/* End of List Indicator */}
                <div className="flex items-center justify-center py-8 border-t border-gray-200 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">End of Questions</p>
                    <p className="text-gray-500 text-sm">
                      You've reached the end of all {answerSheet.question_sheet?.length} questions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ExplanationModal
        isOpen={explanationModal.isOpen}
        onClose={closeExplanationModal}
        explanation={explanationModal.explanation}
        questionNumber={explanationModal.questionNumber}
      />
    </div>
  );
};

export default QuestionView;