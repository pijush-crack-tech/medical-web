'use client'

import React, { useState } from "react";
import { useHomeStore } from "@/store/HomeStore";
import { 
  FileText, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Target,
  Clock,
  BookOpen,
  Award,
  X,
  HelpCircle
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Explanation Modal Component
const ExplanationModal = ({ isOpen, onClose, explanation, questionNumber }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Modal Header */}
          <div className="bg-blue-600 text-white p-6">
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

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div 
              className="prose prose-sm max-w-none text-gray-800 leading-relaxed [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_img]:border [&_img]:border-gray-300 [&_img]:shadow-sm [&_p]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-2 [&_strong]:text-gray-900 [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_h4]:text-sm"
              dangerouslySetInnerHTML={{ __html: explanation }}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const AnswerSheet = () => {
  const { answerSheet } = useHomeStore();
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [showAnswers, setShowAnswers] = useState(true);
  const [explanationModal, setExplanationModal] = useState({ isOpen: false, explanation: '', questionNumber: '' });

  // Parse answer strings (format: "1-1-2-1-2")
  const parseAnswers = (answerString) => {
    return answerString.split('-').map(num => parseInt(num));
  };

  // Get answer status for a question
  const getAnswerStatus = (question) => {
    const correctAnswers = parseAnswers(question.answer);
    const givenAnswers = parseAnswers(question.given_answer);
    
    // Check if question was attempted
    const isAttempted = givenAnswers.some(answer => answer !== 0);
    if (!isAttempted) return 'unattempted';
    
    // Check if all answers match
    const isCorrect = correctAnswers.every((correct, index) => correct === givenAnswers[index]);
    return isCorrect ? 'correct' : 'incorrect';
  };

  // Get option letter
  const getOptionLetter = (index) => {
    return String.fromCharCode(97 + index); // a, b, c, d, e
  };

  // Toggle question expansion
  const toggleQuestion = (questionId) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  // Open explanation modal
  const openExplanationModal = (explanation, questionNumber) => {
    setExplanationModal({
      isOpen: true,
      explanation,
      questionNumber
    });
  };

  // Close explanation modal
  const closeExplanationModal = () => {
    setExplanationModal({
      isOpen: false,
      explanation: '',
      questionNumber: ''
    });
  };

  // Calculate statistics
  const getStatistics = () => {
    if (!answerSheet?.question_sheet) return { attempted: 0, correct: 0, incorrect: 0, unattempted: 0 };
    
    const stats = { attempted: 0, correct: 0, incorrect: 0, unattempted: 0 };
    answerSheet.question_sheet.forEach(question => {
      const status = getAnswerStatus(question);
      if (status === 'unattempted') {
        stats.unattempted++;
      } else {
        stats.attempted++;
        if (status === 'correct') stats.correct++;
        else stats.incorrect++;
      }
    });
    
    return stats;
  };

  const stats = getStatistics();

  if (!answerSheet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No answer sheet available</p>
          <p className="text-gray-500 text-sm mt-2">Complete an exam to view your answer sheet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-14">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Answer Sheet</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{answerSheet.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{answerSheet.question_sheet?.length || 0} Questions</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showAnswers 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showAnswers ? 'Hide' : 'Show'} Answers</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attempted</p>
                <p className="text-2xl font-bold text-blue-600">{stats.attempted}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Correct</p>
                <p className="text-2xl font-bold text-green-600">{stats.correct}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Incorrect</p>
                <p className="text-2xl font-bold text-red-600">{stats.incorrect}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unattempted</p>
                <p className="text-2xl font-bold text-gray-600">{stats.unattempted}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {answerSheet.question_sheet?.map((question, index) => {
            const status = getAnswerStatus(question);
            const correctAnswers = parseAnswers(question.answer);
            const givenAnswers = parseAnswers(question.given_answer);
            const isExpanded = expandedQuestions.has(question.id);
            
            const statusConfig = {
              correct: { 
                color: 'border-green-200 bg-green-50', 
                icon: <CheckCircle className="w-5 h-5 text-green-600" />,
                badge: 'bg-green-100 text-green-700'
              },
              incorrect: { 
                color: 'border-red-200 bg-red-50', 
                icon: <XCircle className="w-5 h-5 text-red-600" />,
                badge: 'bg-red-100 text-red-700'
              },
              unattempted: { 
                color: 'border-gray-200 bg-gray-50', 
                icon: <AlertCircle className="w-5 h-5 text-gray-500" />,
                badge: 'bg-gray-100 text-gray-700'
              }
            };

            return (
              <div 
                key={question.id}
                className={`bg-white rounded-xl border-2 overflow-hidden transition-all duration-200 ${statusConfig[status].color}`}
              >
                {/* Question Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-opacity-80 transition-colors"
                  onClick={() => toggleQuestion(question.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm">
                          {question.question_number}
                        </span>
                        {statusConfig[status].icon}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusConfig[status].badge}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-gray-800 font-medium leading-relaxed">
                        {question.question}
                      </p>
                    </div>
                    <button className="ml-4 p-1 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors">
                      {isExpanded ? 
                        <ChevronUp className="w-5 h-5 text-gray-600" /> : 
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      }
                    </button>
                  </div>
                </div>

                {/* Question Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-white">
                    <div className="p-4">
                      {/* Options */}
                      <div className="space-y-3 mb-4">
                        {[question.option1, question.option2, question.option3, question.option4, question.option5].map((option, optionIndex) => {
                          const isCorrect = correctAnswers[optionIndex] === 1;
                          const isSelected = givenAnswers[optionIndex] === 1;
                          const isWrongSelection = isSelected && !isCorrect;
                          
                          return (
                            <div 
                              key={optionIndex}
                              className={`p-3 rounded-lg border transition-colors ${
                                showAnswers && isCorrect ? 'border-green-300 bg-green-50' :
                                isWrongSelection ? 'border-red-300 bg-red-50' :
                                isSelected ? 'border-blue-300 bg-blue-50' :
                                'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-800">{option}</span>
                                <div className="flex items-center space-x-2">
                                  {isSelected && (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      isWrongSelection ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                      Your Answer
                                    </span>
                                  )}
                                  {showAnswers && isCorrect && (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                      Correct
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Answer Summary and Explanation Button */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <p className="font-medium text-gray-700 mb-1">Your Selection:</p>
                            <p className="text-gray-600">
                              {givenAnswers.map((answer, idx) => answer === 1 ? getOptionLetter(idx) : '').filter(Boolean).join(', ') || 'Not attempted'}
                            </p>
                          </div>
                          {showAnswers && (
                            <div>
                              <p className="font-medium text-gray-700 mb-1">Correct Answer:</p>
                              <p className="text-green-600 font-medium">
                                {correctAnswers.map((answer, idx) => answer === 1 ? getOptionLetter(idx) : '').filter(Boolean).join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {/* Explanation Button */}
                        {question.explaination && question.explaination !== "Explaination" && (
                          <div className="flex justify-center">
                            <button
                              onClick={() => openExplanationModal(question.explaination, question.question_number)}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              <HelpCircle className="w-4 h-4" />
                              <span>View Explanation</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Footer */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center">
            <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Exam Summary</h3>
            <p className="text-gray-600 mb-4">
              You attempted {stats.attempted} out of {answerSheet.question_sheet?.length || 0} questions
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.correct}</p>
                <p className="text-sm text-gray-500">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.incorrect}</p>
                <p className="text-sm text-gray-500">Incorrect</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{stats.unattempted}</p>
                <p className="text-sm text-gray-500">Unattempted</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Modal */}
      <ExplanationModal
        isOpen={explanationModal.isOpen}
        onClose={closeExplanationModal}
        explanation={explanationModal.explanation}
        questionNumber={explanationModal.questionNumber}
      />
    </div>
  );
};

// Demo wrapper with sample data
const AnswerSheetDemo = () => {
  return (
    <div>
      <AnswerSheet />
    </div>
  );
};

export default AnswerSheetDemo;