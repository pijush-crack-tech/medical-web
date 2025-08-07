'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, BookOpen } from 'lucide-react';

const ExamCard = ({ 
  questionNumber,
  question,
  options = [],
  selectedOption,
  onOptionSelect,
  showResult = false,
  correctAnswer,
  className = ''
}) => {
  const [hoveredOption, setHoveredOption] = useState(null);

  // Get option styling based on state
  const getOptionStyle = (optionIndex) => {
    const isSelected = selectedOption === optionIndex;
    const isCorrect = correctAnswer === optionIndex;
    const isWrong = showResult && isSelected && !isCorrect;
    const isHovered = hoveredOption === optionIndex;

    if (showResult) {
      if (isCorrect) {
        return 'bg-green-50 border-green-300 text-green-800';
      } else if (isWrong) {
        return 'bg-red-50 border-red-300 text-red-800';
      } else {
        return 'bg-gray-50 border-gray-200 text-gray-600';
      }
    }

    if (isSelected) {
      return 'bg-blue-50 border-blue-300 text-blue-800';
    }

    if (isHovered) {
      return 'bg-gray-50 border-gray-300 text-gray-800';
    }

    return 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50';
  };

  const getOptionIcon = (optionIndex) => {
    const isSelected = selectedOption === optionIndex;
    const isCorrect = correctAnswer === optionIndex;
    const isWrong = showResult && isSelected && !isCorrect;

    if (showResult) {
      if (isCorrect) {
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      } else if (isWrong) {
        return <Circle className="w-5 h-5 text-red-600" />;
      } else {
        return <Circle className="w-5 h-5 text-gray-400" />;
      }
    }

    return isSelected ? 
      <CheckCircle className="w-5 h-5 text-blue-600" /> : 
      <Circle className="w-5 h-5 text-gray-400" />;
  };

  const optionLabels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">QUESTION</span>
          </div>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-medium">
            {questionNumber}
          </span>
        </div>
        <h3 className="text-lg font-medium leading-relaxed">
          {question}
        </h3>
      </div>

      {/* Options */}
      <div className="p-6 space-y-3">
        {options.map((option, index) => (
          <motion.button
            key={index}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${getOptionStyle(index)}`}
            onClick={() => !showResult && onOptionSelect(index)}
            onMouseEnter={() => !showResult && setHoveredOption(index)}
            onMouseLeave={() => setHoveredOption(null)}
            whileHover={!showResult ? { scale: 1.01 } : {}}
            whileTap={!showResult ? { scale: 0.99 } : {}}
            disabled={showResult}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-700">
                  {optionLabels[index]}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{option}</p>
              </div>
              <div className="flex-shrink-0">
                {getOptionIcon(index)}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer with result info */}
      {showResult && (
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {selectedOption === correctAnswer ? 'Correct Answer!' : 'Incorrect Answer'}
              </span>
              {selectedOption !== correctAnswer && (
                <span className="text-sm text-gray-600">
                  Correct: {optionLabels[correctAnswer]}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Demo component showing usage

export { ExamCard };