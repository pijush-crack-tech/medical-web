'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/store/AuthStore';
import { useExamStore } from '@/store/ExamStore';

const AuthProvider = ({ children }) => {
  const { 
    isAuthenticated, 
    isLoading, 
    checkSession 
  } = useAuthStore();
  
  const {
    examStarted,
    examCompleted,
    questionId,
    timeRemaining,
    submitExam,
    resetExam,
    initializeTimer // Add this
  } = useExamStore();
  
  const router = useRouter();
  const pathname = usePathname();
  const [showExamWarning, setShowExamWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Pages that don't require authentication
  const publicRoutes = ['/contact', '/about'];
  
  // Check if current route requires authentication
  const requiresAuth = !publicRoutes.includes(pathname);

  // Check if user has an active exam
  const hasActiveExam = examStarted && !examCompleted && timeRemaining > 0;

  useEffect(() => {
    // Check session when app loads
    const initAuth = async () => {
      await checkSession();
    };

    // Initialize timer for any active exam
    initializeTimer();

    initAuth();
  }, [checkSession, initializeTimer]);

  useEffect(() => {
    // Handle route protection and exam redirection
    console.log("========> HERE <====")
    if (!isLoading) {
      
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (isAuthenticated && pathname === '/login') {
        router.replace("/");
      } else if (isAuthenticated && hasActiveExam && !pathname.startsWith('/exam')) {
        // If user has active exam but not on exam page, redirect to exam
        console.log("Redirecting to active exam...");
        router.replace(`/exam?question_id=${questionId}`);
      }else if (isAuthenticated){
         router.replace(pathname);
      }
    }

  }, [isAuthenticated, isLoading, requiresAuth, pathname, router, hasActiveExam, questionId]);

  // Handle browser back/forward navigation during exam
  useEffect(() => {
    if (hasActiveExam && pathname.startsWith('/exam')) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = 'You have an active exam. Are you sure you want to leave?';
        return 'You have an active exam. Are you sure you want to leave?';
      };

      const handlePopState = (e) => {
        e.preventDefault();
        setShowExamWarning(true);
        setPendingNavigation('back');
        // Push current state back to prevent actual navigation
        window.history.pushState(null, '', window.location.href);
      };

      // Add event listeners
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      
      // Push initial state to handle back button
      window.history.pushState(null, '', window.location.href);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [hasActiveExam, pathname]);

  // Handle programmatic navigation attempts during exam
  useEffect(() => {
    if (hasActiveExam && !pathname.startsWith('/exam')) {
      // If user somehow navigates away from exam page, show warning
      setShowExamWarning(true);
      setPendingNavigation(pathname);
    }
  }, [pathname, hasActiveExam]);

  const handleForceSubmit = async () => {
    try {
      await submitExam();
      setShowExamWarning(false);
      setPendingNavigation(null);
      
      // Navigate to pending route if any
      if (pendingNavigation && pendingNavigation !== 'back') {
        router.push(pendingNavigation);
      } else if (pendingNavigation === 'back') {
        router.back();
      }
    } catch (error) {
      console.error('Failed to submit exam:', error);
      // Still allow navigation on error
      setShowExamWarning(false);
      if (pendingNavigation && pendingNavigation !== 'back') {
        router.push(pendingNavigation);
      } else if (pendingNavigation === 'back') {
        router.back();
      }
    }
  };

  const handleContinueExam = () => {
    setShowExamWarning(false);
    setPendingNavigation(null);
    
    // Redirect back to exam if not already there
    if (!pathname.startsWith('/exam')) {
      router.push(`/exam?question_id=${questionId}`);
    }
  };

  const handleAbandonExam = () => {
    // Reset exam state
    resetExam();
    setShowExamWarning(false);
    
    // Navigate to pending route
    if (pendingNavigation && pendingNavigation !== 'back') {
      router.push(pendingNavigation);
    } else if (pendingNavigation === 'back') {
      router.back();
    } else {
      router.push('/');
    }
    setPendingNavigation(null);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      
      {/* Exam Warning Modal */}
      {showExamWarning && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.76 0L3.054 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Active Exam Detected
              </h3>
              
              <p className="text-gray-600 mb-6">
                You have an active exam in progress. You must complete or submit your exam before navigating to other pages.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleContinueExam}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Continue Exam
                </button>
                
                <button
                  onClick={handleForceSubmit}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Submit Exam Now
                </button>
                
                <button
                  onClick={handleAbandonExam}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Abandon Exam
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                Warning: Abandoning the exam will lose all your progress.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthProvider;