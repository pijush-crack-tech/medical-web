import { HomeService } from '@/services/api-services/homeService';
import { create } from 'zustand';
import { persist, subscribeWithSelector, shallow } from 'zustand/middleware';

export const useHomeStore = create(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                // Persistent data
                batchId : null,
                facultyExam: null,
                
                selectedFacultyExam : null,
                user : null,
                isLoading: false,
                error: null,
                lastFetchTime: null,
                upcommingBatches : [],
                userBatch : null,
                openBatchModal : false,
                
                // Archive Question Data
                isArchiveModalOpen : false,
                openArchiveModal : () => set({isArchiveModalOpen: true}),
                closeArchiveModal : () => set({isArchiveModalOpen: false}),
                archiveQuestionsData : null,

                // Batch Details
                isOpenBatchDetailsModal : false,
                onBatchDetailsModalOpen : () => set({isOpenBatchDetailsModal : true}),
                onBatchDetailsModalClose : () => set({isOpenBatchDetailsModal : false}),
                batchDetails : null,

                // Merit List Data
                isMeritListOpen : false,
                onMeritModalOpen : () => set({isMeritListOpen : true}),
                onMeritModalClose : () => set({isMeritListOpen : false}),
                meritList : null,
                

                // Routine Data
                isRoutineModalOpen : false,
                onRoutineModalOpen : () => set({isRoutineModalOpen : true}),
                onRoutineModalClose : () => set({isRoutineModalOpen : false}),
                routine : null,
                routinePageNo : 1,


                //
                isResultModalOpen : false,
                onResultModalOpen : () => set({isResultModalOpen : true}),
                onResultModalClose : () => set({isResultModalOpen : false}),
                result : null,
                resultPageNo : 1,

                // Mark Sheet Modal
                isMArkSheetModalOpen : false,
                onMarkSheetOpen : () => set({isMArkSheetModalOpen : true}),
                onMarkSheetClose : () => set({isMArkSheetModalOpen : false}),
                markSheet : null,


                // Answer Sheet
                answerSheet : null,

                setAnswerSheet : (data) => set({answerSheet : data}),

                getQuestion : async (id) => {
                    set({ 
                        loading: true,
                        error: null 
                    });
                    try {
                        const data = await HomeService.getExamQuestion(id);
                        set({
                            answerSheet: data.data
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

                getAnswerSheet : async (question_id,answer_id,sort) => {

                    try{
                        const data = await HomeService.getAnswerSheet(question_id,answer_id,0);
                        set({
                            answerSheet : data.data,
                        })
                        
                        return data.data
                    }catch (error) {
                        console.error('Error fetching Result:', error);
                        set({ 
                            isLoading: false, 
                            error: error.message || 'Failed to fetch home'
                        });
                        
                        throw error;
                    }
                },

                getMarkSheet : async (question_id, type = 1) => {
                    try{
                        const data = await HomeService.getMarkSheet(question_id, type);
                        set({
                            markSheet : data.data,
                            isMArkSheetModalOpen : true,
                        })
                        
                        return data.data
                    }catch (error) {
                        console.error('Error fetching Result:', error);
                        set({ 
                            isLoading: false, 
                            error: error.message || 'Failed to fetch home'
                        });
                        
                        throw error;
                    }
                }, 

                getResult : async (batch_id) => {
                    try{
                        const data = await HomeService.getResult(batch_id,4,4,1);
                        set({
                            result : data.data,
                            isResultModalOpen : true,
                        })
                        
                        return data.data
                    }catch (error) {
                        console.error('Error fetching Result:', error);
                        set({ 
                            isLoading: false, 
                            error: error.message || 'Failed to fetch home'
                        });
                        
                        throw error;
                    }
                },
                
                getRoutine : async (batch_id) => {

                    try{
                        const data = await HomeService.getRoutine(batch_id,4,4,1);
                        set({
                            routine : data.data,
                            isRoutineModalOpen : true,
                        })
                        
                        return data.data
                    }catch (error) {
                        console.error('Error fetching faculty exam:', error);
                        set({ 
                            isLoading: false, 
                            error: error.message || 'Failed to fetch home'
                        });
                        
                        throw error;
                    }
                    
                },

                getMeritList : async (batch_id,type) => {

                    try{
                        const data = await HomeService.getMeritList(batch_id,type,1);
                        set({
                            meritList : data.data,
                            isMeritListOpen : true,
                            batchId : batch_id
                        })

                        console.log("Merit List ---- ",data.data)
                        
                        return data.data
                    }catch (error) {
                        console.error('Error fetching faculty exam:', error);
                        set({ 
                            isLoading: false, 
                            error: error.message || 'Failed to fetch home'
                        });
                        
                        throw error;
                    }
                    
                },

                setBatchModalOpen: () => {
                    set({
                        openBatchModal : true
                    })
                },
                setBatchModalClose: () => {
                    set({
                        openBatchModal : false
                    })
                },
    
                handleSelection : async (selectedFacultyExam) => {

                    try{
                        const data = await HomeService.setUserFacultyExam(selectedFacultyExam.examId, selectedFacultyExam.facultyId);
                        
                        set({ 
                            selectedFacultyExam : selectedFacultyExam
                        });

                        
                        return data.data
                    }catch (error) {
                        console.error('Error fetching faculty exam:', error);
                        set({ 
                            isLoading: false, 
                            error: error.message || 'Failed to fetch home'
                        });
                        
                        throw error;
                    }                    

                    
                },

                getBatchDetails : async (batch_id) => {
                   
                    try{
                        const data = await HomeService.getBatchDetails(batch_id);
                        set({
                            batchDetails : data.data,
                        })

                        console.log("Batch DEtails", data.data)
                        
                        return data.data
                    }catch (error) {
                        console.error('Error fetching faculty exam:', error);
                        set({ 
                            isLoading: false, 
                            error: error.message || 'Failed to fetch home'
                        });
                        
                        throw error;
                    }
                    
                },

                home : async () => {
                    set({ isLoading: true, error: null });
                    
                    try{
                        const data = await HomeService.getHome(1,'1.0.0');
                        console.log(data.data.user_batch)
                        set({
                            upcommingBatches : data.data.upcoming_batch,
                            userBatch : data.data.user_batch,
                            isLoading: false
                        })
                        
                        return data.data
                    }catch (error) {
                        console.error('Error fetching faculty exam:', error);
                        
                        set({ 
                            isLoading: false, 
                            
                            error: error.message || 'Failed to fetch home'
                        });
                        
                        throw error;
                    }
                    
                },
                
                // Actions
                getFacultyExam: async () => {
                    const state = get();
                    
                    // Avoid duplicate requests
                    if (state.isLoading) {
                        return state.facultyExam;
                    }
                    
                    set({ isLoading: true, error: null });
                    
                    try {
                        const response = await HomeService.getExamFaculty();
                        
                        
                        set({ 
                            facultyExam: response.data.faculty,
                            user : response.data.user, 
                            isLoading: false,
                            error: null,
                            lastFetchTime: Date.now()
                        });
                        
                        return response.data || response;
                    } catch (error) {
                        console.error('Error fetching faculty exam:', error);
                        
                        set({ 
                            isLoading: false, 
                            error: error.message || 'Failed to fetch faculty exam data'
                        });
                        
                        throw error; // Re-throw so components can handle it
                    }
                },
                
                // Clear faculty exam data
                clearFacultyExam: () => set({ 
                    facultyExam: null,
                    error: null,
                    lastFetchTime: null
                }),
                
                // Refresh data (force refetch)
                refreshFacultyExam: async () => {
                    set({ facultyExam: null }); // Clear cache
                    return get().getFacultyExam();
                },
                
                // Clear only temporary state
                clearErrors: () => set({ error: null }),
                
                // Check if data is stale (older than 5 minutes)
                isDataStale: () => {
                    const { lastFetchTime } = get();
                    if (!lastFetchTime) return true;
                    return Date.now() - lastFetchTime > 5 * 60 * 1000; // 5 minutes
                },
                
                // Get faculty exam with cache check
                getFacultyExamCached: async (forceRefresh = false) => {
                    const state = get();
                    
                    // Return cached data if fresh and not forcing refresh
                    if (!forceRefresh && state.facultyExam && !state.isDataStale()) {
                        return state.facultyExam;
                    }
                    
                    // Fetch fresh data
                    return state.getFacultyExam();
                }
            }),
            {
                name: 'home-store', // Storage key
                partialize: (state) => ({ 
                    facultyExam: state.facultyExam,
                    selectedFacultyExam : state.selectedFacultyExam,
                    lastFetchTime: state.lastFetchTime,
                    user : state.user
                    // isLoading and error are excluded (temporary state)
                }),
            }
        )
    )
);



export const useFacultyExam = () => useHomeStore(state => state.facultyExam); 
export const savedFacultyExam = () => useHomeStore(state => state.selectedFacultyExam); 


