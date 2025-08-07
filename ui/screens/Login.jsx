// Replace the content in: app/page.js
// This is your main login page

'use client';

import { useEffect, useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '@/lib/firebase';
import useAuthStore from '@/store/AuthStore';


export default function LoginScreen() {
  // This keeps track of whether we're currently logging in
  const [isLoading, setIsLoading] = useState(false);
  // This keeps track of any error messages
  const [error, setError] = useState('');
  
  // Get login function from store
  const { login,firebaseLogin } = useAuthStore();

  // This function runs when someone clicks "Login with Google"
  const handleGoogleLogin = async () => {
    console.log("====================")
    try {
      setIsLoading(true);
      setError('');

      // Firebase Google login
      const result = await signInWithPopup(auth, googleProvider);
      
      console.log(result.user)
      // Login through store (which calls Django backend)
      const success = await firebaseLogin(result.user);
      
      if (!success) {
        setError('Login failed. Please try again.');
      }
      // If successful, AuthProvider will handle redirect
      
    } catch (error) {
      console.error('Google login failed:', error);
      setError('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // This function runs when someone clicks "Login with Facebook"
  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Firebase Facebook login
      const result = await signInWithPopup(auth, facebookProvider);
      
      // Login through store (which calls Django backend)
      const success = await firebaseLogin(result.user);
      
      if (!success) {
        setError('Facebook login failed. Please try again.');
      }
      // If successful, AuthProvider will handle redirect
      
    } catch (error) {
      console.error('Facebook login failed:', error);
      setError('Facebook login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-purple-800 mb-2">
            Medical Higher Study
          </h1>
          <p className="text-gray-600">
            Login to access your courses
          </p>
        </div>

        {/* Error message (only shows if there's an error) */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Login Buttons */}
        <div className="space-y-3">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          {/* Facebook Login Button */}
          <button
            onClick={handleFacebookLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Sign in with Facebook
              </>
            )}
          </button>
        </div>

        {/* Contact section */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="/contact" className="text-blue-600 hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}