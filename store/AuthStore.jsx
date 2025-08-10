// Create a new file: store/authStore.js
// This manages your authentication state globally

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Authentication state
      isAuthenticated: false,
      authorization : null,
      refreshToken : null,
      user: null,
      isLoading: false,
      error: null,

      // Actions
      setUser: (userData) => set({ 
        user: userData, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error, isLoading: false }),

      clearAuth: () => set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null 
      }),

      // Check session with Django backend
      checkSession: async () => {
        const authorization = get().authorization
        // try {
          set({ isLoading: false, error: null });
          if (authorization != null){
            set({
              isAuthenticated : true
            })
            return true
          }else{
            set({
              isAuthenticated : false
            })
            return false
          }

        //   const response = await fetch('http://dhk.cracktech.org:8004/login/', {
        //     method: 'GET',
        //     credentials: 'include',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   });

        //   if (response.ok) {
        //     const data = await response.json();
        //     console.log(data)
        //     if (data.auth) {
        //       // User is authenticated
        //       set({
        //         user: {
        //           uid: data.user.id,
        //           displayName: data.user.name,
        //           photoURL: data.user.photo,
        //         },
        //         isAuthenticated: true,
        //         isLoading: false,
        //         error: null
        //       });
        //       return true;
        //     } else {
        //       // User is not authenticated
        //       set({
        //         user: null,
        //         isAuthenticated: false,
        //         isLoading: false,
        //         error: null
        //       });
        //       return false;
        //     }
        //   } else {
        //     throw new Error('Session check failed');
        //   }
        // } catch (error) {
        //   console.error('Session check error:', error);
        //   set({
        //     user: null,
        //     isAuthenticated: false,
        //     isLoading: false,
        //     error: error.message
        //   });
        //   return false;
        // }
      },

      firebaseLogin: async (firebaseUser) => {
        try {
          set({ isLoading: true, error: null });
          const { refreshToken, authorization } = get();

          // Get the photo URL (Facebook needs special handling)
          let photoURL = firebaseUser.photoURL;
          if (firebaseUser.providerData[0]?.providerId === 'facebook.com') {
            photoURL = `https://graph.facebook.com/${firebaseUser.providerData[0].uid}/picture?type=normal`;
          }


          const requestBody = {
            "idname" : firebaseUser.uid,
            "display_name" : firebaseUser.displayName,
            "picture" : photoURL,
            "phone" : "01675736587"
          }

          const headers = {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Firebase-Token': `MedicalHigherStudy ${firebaseUser.accessToken}`,
              'Device-Id' : "1s3d4f",
              'Login-Medium' : "Browser"
            }



          const response = await apiClient.post(
            'auth/token/', 
            requestBody,
            {
              headers: headers,
              withCredentials: true, 
            }
          );

          const result = await response.json();
          
          if (response.ok) {
            // Set user data in store
            set({
              user: {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                photoURL: photoURL,
              },
              authorization : result.data.access_token,
              refreshToken : result.data.refresh_token,
              isAuthenticated: true,
              isLoading: false,
              
              error: null
            });
            return true;
          } else {
            throw new Error('Backend authentication failed');
          }
        } catch (error) {
          console.error('Login error:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message
          });
          return false;
        }
      },

      // Login function
      login: async (firebaseUser) => {
        try {
          set({ isLoading: true, error: null });

          // Get the photo URL (Facebook needs special handling)
          let photoURL = firebaseUser.photoURL;
          if (firebaseUser.providerData[0]?.providerId === 'facebook.com') {
            photoURL = `https://graph.facebook.com/${firebaseUser.providerData[0].uid}/picture?type=normal`;
          }

          // Prepare form data
          const formData = new FormData();
          formData.append('idname', firebaseUser.uid);
          formData.append('profile_name', firebaseUser.displayName);
          formData.append('photo', photoURL);

          // Send to Django backend
          const response = await fetch('http://dhk.cracktech.org:8004/api/v1/auth/token/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer your-token-here', // If you have a token
              'X-Requested-With': 'XMLHttpRequest',
            },
            body: formData,
            credentials: 'include',
          });

          const result = await response.text();
          
          if (response.ok) {
            // Set user data in store
            set({
              user: {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                photoURL: photoURL,
              },
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            return true;
          } else {
            throw new Error('Backend authentication failed');
          }
        } catch (error) {
          console.error('Login error:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message
          });
          return false;
        }
      },

      // Logout function
      logout: async () => {
        try {
          const response = await fetch('http://dhk.cracktech.org:8004/logout/', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          // Clear auth state regardless of response
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });

          return response.ok;
        } catch (error) {
          console.error('Logout error:', error);
          // Still clear auth state on error
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          return false;
        }
      },
      updateUserProfile: async (profileData) => {
        try {
          // Make API call to update user profile
          const response = await fetch('http://dhk.cracktech.org:8004/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Add auth token if needed
            },
            body: JSON.stringify(profileData),
          });
          
          if (!response.ok) {
            throw new Error('Failed to update profile');
          }
          
          const data = await response.json();

          set({
              user: {
                uid: data.user.id,
                displayName: data.user.name,
                photoURL: data.user.photo,
              },
              isAuthenticated: true,
              isLoading: false,
              error: null
          });
          
          
          return data;
          
        } catch (error) {
          console.error('Error updating user profile:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-store', // Storage key
      partialize: (state) => ({ 
        // Only persist these fields (don't persist isLoading or error)
        isAuthenticated: state.isAuthenticated,
        refreshToken : state.refreshToken,
        authorization : state.authorization,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;


