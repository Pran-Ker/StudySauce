
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Module, Lesson, courses } from '../data/courses';

type Progress = {
  [courseId: string]: {
    completed: string[];
    lastAccessed: Date;
  }
};

type LearningContextType = {
  courses: Course[];
  enrolledCourses: string[];
  progress: Progress;
  enrollInCourse: (courseId: string) => void;
  unenrollFromCourse: (courseId: string) => void;
  markModuleComplete: (courseId: string, moduleId: string) => void;
  markModuleIncomplete: (courseId: string, moduleId: string) => void;
  getCourseProgress: (courseId: string) => number;
  isModuleCompleted: (courseId: string, moduleId: string) => boolean;
  getLastAccessedDate: (courseId: string) => Date | null;
  updateLastAccessed: (courseId: string) => void;
  // Added functions needed by components
  getCourse: (courseId: string) => Course | null;
  isEnrolled: (courseId: string) => boolean;
  getLessonStatus: (courseId: string, lessonId: string) => boolean;
  markLessonCompleted: (courseId: string, lessonId: string) => void;
  enrollCourse: (courseId: string) => void;
};

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [progress, setProgress] = useState<Progress>({});

  // Load saved state from localStorage on initial render
  useEffect(() => {
    const savedEnrolledCourses = localStorage.getItem('enrolledCourses');
    const savedProgress = localStorage.getItem('courseProgress');
    
    if (savedEnrolledCourses) {
      setEnrolledCourses(JSON.parse(savedEnrolledCourses));
    }
    
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
    localStorage.setItem('courseProgress', JSON.stringify(progress));
  }, [enrolledCourses, progress]);

  const enrollInCourse = (courseId: string) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
      
      // Initialize progress tracking for this course
      if (!progress[courseId]) {
        setProgress({
          ...progress,
          [courseId]: {
            completed: [],
            lastAccessed: new Date()
          }
        });
      }
    }
  };

  // Alias for enrollInCourse to match component usage
  const enrollCourse = (courseId: string) => enrollInCourse(courseId);

  const unenrollFromCourse = (courseId: string) => {
    setEnrolledCourses(enrolledCourses.filter(id => id !== courseId));
  };

  const markModuleComplete = (courseId: string, moduleId: string) => {
    const courseProgress = progress[courseId] || { completed: [], lastAccessed: new Date() };
    
    if (!courseProgress.completed.includes(moduleId)) {
      const updatedCompleted = [...courseProgress.completed, moduleId];
      
      setProgress({
        ...progress,
        [courseId]: {
          ...courseProgress,
          completed: updatedCompleted
        }
      });
    }
  };

  // Function to mark a lesson as completed (same implementation as markModuleComplete)
  const markLessonCompleted = (courseId: string, lessonId: string) => markModuleComplete(courseId, lessonId);

  const markModuleIncomplete = (courseId: string, moduleId: string) => {
    const courseProgress = progress[courseId];
    
    if (courseProgress && courseProgress.completed.includes(moduleId)) {
      setProgress({
        ...progress,
        [courseId]: {
          ...courseProgress,
          completed: courseProgress.completed.filter(id => id !== moduleId)
        }
      });
    }
  };

  const getCourseProgress = (courseId: string): number => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;
    
    const courseProgress = progress[courseId];
    if (!courseProgress) return 0;
    
    // Count the total number of modules in the course
    const totalModules = course.modules.reduce((count, section) => count + section.lessons.length, 0);
    if (totalModules === 0) return 0;
    
    // Calculate the percentage of completed modules
    return Math.round((courseProgress.completed.length / totalModules) * 100);
  };

  const isModuleCompleted = (courseId: string, moduleId: string): boolean => {
    const courseProgress = progress[courseId];
    return courseProgress ? courseProgress.completed.includes(moduleId) : false;
  };

  // Alias for isModuleCompleted to match component usage
  const getLessonStatus = (courseId: string, lessonId: string): boolean => isModuleCompleted(courseId, lessonId);

  const getLastAccessedDate = (courseId: string): Date | null => {
    const courseProgress = progress[courseId];
    return courseProgress ? new Date(courseProgress.lastAccessed) : null;
  };

  const updateLastAccessed = (courseId: string) => {
    const courseProgress = progress[courseId] || { completed: [], lastAccessed: new Date() };
    
    setProgress({
      ...progress,
      [courseId]: {
        ...courseProgress,
        lastAccessed: new Date()
      }
    });
  };

  // Function to get a course by ID
  const getCourse = (courseId: string): Course | null => {
    return courses.find(c => c.id === courseId) || null;
  };

  // Function to check if a course is enrolled
  const isEnrolled = (courseId: string): boolean => {
    return enrolledCourses.includes(courseId);
  };

  // Make sure all functions are properly provided to the context
  const contextValue: LearningContextType = {
    courses,
    enrolledCourses,
    progress,
    enrollInCourse,
    enrollCourse,
    unenrollFromCourse,
    markModuleComplete,
    markModuleIncomplete,
    getCourseProgress,
    isModuleCompleted,
    getLastAccessedDate,
    updateLastAccessed,
    getCourse,
    isEnrolled,
    getLessonStatus,
    markLessonCompleted
  };

  return (
    <LearningContext.Provider value={contextValue}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = (): LearningContextType => {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
