import { HomeService } from '@/services/api-services/homeService';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBatchModalStore = create(
    persist(
        (set, get) => ({
            
            batchData : null,
            searchTerms : null,
            loading : false,
            page : 1,
            error : "",
            viewMode : 'list',
            changeViewModeToGrid : () => set({viewMode : 'grid'}),
            changeViewModeToList : () => set({viewMode : 'list'}),
            batchApi : async () => {
                console.log("Calling From Archive Store")
                set({ 
                    loading: true, 
                });
                try{
                    const data = await HomeService.getAllBatch(4,4,1);
                    set({
                        batchData : data.data,
                        loading: false
                    })
                    
                    return data.data
                }catch (error) {
                    console.error('Error fetching Batch exam:', error);
                    
                    set({ 
                        loading: false, 
                        error: error.message || 'Failed to fetch home'
                    });
                    
                    throw error;
                }
            },
            enrollBatch :  async (id) => {
                console.log("Calling From Archive Store")
                set({ 
                    loading: true, 
                });
                try{
                    const data = await HomeService.userBatchEnroll(id);
                    set({
                        batchData : data.data,
                        loading: false
                    })
                    
                    return data.data
                }catch (error) {
                    console.error('Error fetching Batch exam:', error);
                    
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
