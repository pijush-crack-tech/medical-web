import { HomeService } from '@/services/api-services/homeService';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useExamStore = create(
    persist(
        (set, get) => ({
            examData: null,
            questionId: null,
            loading: false,
            error: null,
            selectedAnswers: {},
            timeRemaining: null,
            examStarted: false,
            examCompleted: false,
            examStartTime: null, // Track when exam actually started
            originalExamDuration: null, // Store original duration in seconds
            
            setQuestionId: (id) => set({ questionId: id }),
            
            // Set selected answer for a question
            setSelectedAnswer: (questionId, answer) => set((state) => ({
                selectedAnswers: {
                    ...state.selectedAnswers,
                    [questionId]: answer
                }
            })),
            
            // Start the exam timer
            startExam: () => {
                const { examData } = get();
                if (examData?.examtime) {
                    const now = Date.now();
                    const durationInSeconds = examData.examtime * 60;
                    
                    set({
                        examStarted: true,
                        examStartTime: now,
                        originalExamDuration: durationInSeconds,
                        timeRemaining: durationInSeconds,
                    });
                }
            },
            
            // Calculate and update timer based on start time
            updateTimer: () => {
                const { examStartTime, originalExamDuration, examCompleted } = get();
                
                if (!examStartTime || !originalExamDuration || examCompleted) {
                    return;
                }
                
                const now = Date.now();
                const elapsedSeconds = Math.floor((now - examStartTime) / 1000);
                const remainingTime = Math.max(0, originalExamDuration - elapsedSeconds);
                
                if (remainingTime <= 0) {
                    set({
                        timeRemaining: 0,
                        examCompleted: true
                    });
                } else {
                    set({
                        timeRemaining: remainingTime
                    });
                }
            },
            
            // Initialize timer on app load (for page refreshes)
            initializeTimer: () => {
                const { examStartTime, originalExamDuration, examStarted, examCompleted } = get();
                
                if (examStarted && !examCompleted && examStartTime && originalExamDuration) {
                    const now = Date.now();
                    const elapsedSeconds = Math.floor((now - examStartTime) / 1000);
                    const remainingTime = Math.max(0, originalExamDuration - elapsedSeconds);
                    
                    if (remainingTime <= 0) {
                        set({
                            timeRemaining: 0,
                            examCompleted: true
                        });
                    } else {
                        set({
                            timeRemaining: remainingTime
                        });
                    }
                }
            },
            
            // Reset exam state
            resetExam: () => set({
                selectedAnswers: {},
                timeRemaining: null,
                examStarted: false,
                examCompleted: false,
                examStartTime: null,
                originalExamDuration: null,
                error: null,
                examData: null,
                questionId : null
            }),
            
            // Fetch exam data
            examApi: async (id) => {
                set({ 
                    loading: true,
                    error: null 
                });
                try {
                    const data = await HomeService.getExamQuestion(id);
                    set({
                        examData: data.data,
                        loading: false,
                        questionId: id,
                        // Don't set timeRemaining here - let startExam handle it
                    });
                    return data.data;
                } catch (error) {
                    console.error('Error fetching exam:', error);
                    set({ 
                        loading: false, 
                        error: error.message || 'Failed to fetch exam'
                    });
                    throw error;
                }
            },
            
            // Submit exam with proper API format
            submitExam: async (submissionData = null) => {
                const { selectedAnswers, questionId, examData } = get();
                set({ loading: true });
                
                try {
                    let finalSubmissionData;
                    
                    if (submissionData) {
                        // Use provided formatted data
                        finalSubmissionData = submissionData;
                    } else {
                        // Format from store data (backward compatibility)
                        const formattedAnswers = [];
                        
                        examData?.question_sheet?.forEach((question) => {
                            const qId = question.id;
                            const questionType = question.type;
                            const selectedAnswer = selectedAnswers[qId];
                            
                            let formattedAnswer = '';
                            
                            if (questionType === '1' || questionType === '3') {
                                // Multiple choice format: "1-2-0-0-0"
                                const answerArray = ['0', '0', '0', '0', '0'];
                                
                                if (selectedAnswer && typeof selectedAnswer === 'object') {
                                    Object.entries(selectedAnswer).forEach(([optionIndex, value]) => {
                                        const index = parseInt(optionIndex);
                                        if (index >= 0 && index < 5) {
                                            if (value === true) {
                                                answerArray[index] = '1';
                                            } else if (value === false) {
                                                answerArray[index] = '2';
                                            }
                                        }
                                    });
                                }
                                
                                formattedAnswer = answerArray.join('-');
                            } else if (questionType === '2' || questionType === '4') {
                                // Single choice format: option index or "-1"
                                if (selectedAnswer !== undefined && selectedAnswer !== null) {
                                    formattedAnswer = selectedAnswer.toString();
                                } else {
                                    formattedAnswer = '-1';
                                }
                            }
                            
                            formattedAnswers.push({
                                q: qId,
                                t: questionType,
                                a: formattedAnswer
                            });
                        });
                        
                        finalSubmissionData = {
                            question_id: parseInt(questionId),
                            answers: formattedAnswers
                        };
                    }
                    
                    console.log('Final submission data:', finalSubmissionData);
                    
                    // Call submit API with formatted data
                    const result = await HomeService.submitExam(finalSubmissionData);

                    if(result.error == false){
                        
                    }
                    
                    set({
                        examCompleted: true,
                        loading: false,
                        examStarted: false,
                        timeRemaining: 0,
                        examStartTime: null,
                        examData : null,
                        questionId : null,
                        originalExamDuration: null,

                    });
                    
                    return result;
                } catch (error) {
                    console.error('Error submitting exam:', error);
                    set({ 
                        loading: false,
                        error: error.message || 'Failed to submit exam'
                    });
                    throw error;
                }
            },
            
            // Check if user has an active exam
            hasActiveExam: () => {
                const state = get();
                return state.examStarted && !state.examCompleted && state.timeRemaining > 0;
            },
            
            // Force complete exam (for emergency situations)
            forceCompleteExam: () => set({
                examStarted: false,
                examCompleted: true,
                timeRemaining: 0
            }),

            // Helper function to get submission preview (for debugging)
            getSubmissionPreview: () => {
                const { selectedAnswers, questionId, examData } = get();
                const formattedAnswers = [];
                
                examData?.question_sheet?.forEach((question) => {
                    const qId = question.id;
                    const questionType = question.type;
                    const selectedAnswer = selectedAnswers[qId];
                    
                    let formattedAnswer = '';
                    
                    if (questionType === '1' || questionType === '3') {
                        const answerArray = ['0', '0', '0', '0', '0'];
                        
                        if (selectedAnswer && typeof selectedAnswer === 'object') {
                            Object.entries(selectedAnswer).forEach(([optionIndex, value]) => {
                                const index = parseInt(optionIndex);
                                if (index >= 0 && index < 5) {
                                    if (value === true) {
                                        answerArray[index] = '1';
                                    } else if (value === false) {
                                        answerArray[index] = '2';
                                    }
                                }
                            });
                        }
                        
                        formattedAnswer = answerArray.join('-');
                    } else if (questionType === '2' || questionType === '4') {
                        if (selectedAnswer !== undefined && selectedAnswer !== null) {
                            formattedAnswer = selectedAnswer.toString();
                        } else {
                            formattedAnswer = '-1';
                        }
                    }
                    
                    formattedAnswers.push({
                        q: qId,
                        t: questionType,
                        a: formattedAnswer
                    });
                });
                
                return {
                    question_id: parseInt(questionId),
                    answers: formattedAnswers
                };
            }
        }),
        {
            name: 'exam-store',
            partialize: (state) => ({ 
                questionId: state.questionId,
                examData: state.examData,
                selectedAnswers: state.selectedAnswers,
                timeRemaining: state.timeRemaining,
                examStarted: state.examStarted,
                examCompleted: state.examCompleted,
                examStartTime: state.examStartTime,
                originalExamDuration: state.originalExamDuration
            }),
        }
    )
);

export const useExamQuestion = () => useExamStore(state => state.examApi);