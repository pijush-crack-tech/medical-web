import { HomeService } from '@/services/api-services/homeService';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCentralArchiveStore = create(
    persist(
        (set, get) => ({
            
            archiveData : null,
            searchTerms : null,
            loading : false,
            page : 1,
            error : "",
            viewMode : 'list',
            changeViewModeToGrid : () => set({viewMode : 'grid'}),
            changeViewModeToList : () => set({viewMode : 'list'}),

            archiveApi : async (faculty_id,exam_id,filter=1,page=1) => {
                
                set({ 
                    loading: true, 
                });
                try{
                    const data = await HomeService.getArchiveQuestions(faculty_id,exam_id,filter=1,page=1);
                    set({
                        archiveData : data.data,
                        loading: false
                    })
                    
                    return data.data
                }catch (error) {
                    console.error('Error fetching faculty exam:', error);
                    
                    set({ 
                        loading: false, 
                        error: error.message || 'Failed to fetch home'
                    });
                    
                    throw error;
                }
            },

            
        }),
        
    )
);
