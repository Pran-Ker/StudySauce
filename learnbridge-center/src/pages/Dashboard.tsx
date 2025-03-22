
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Clock, BarChart2, Award, Check, List, Grid } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import ProgressBar from '@/components/ProgressBar';
import { useLearning } from '@/context/LearningContext';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { 
    courses, 
    enrolledCourses, 
    getCourseProgress, 
    getLastAccessedDate 
  } = useLearning();
  
  const enrolledCoursesData = courses.filter(course => 
    enrolledCourses.includes(course.id)
  );
  
  const inProgressCourses = enrolledCoursesData.filter(course => 
    getCourseProgress(course.id) > 0 && getCourseProgress(course.id) < 100
  );
  
  const completedCourses = enrolledCoursesData.filter(course => 
    getCourseProgress(course.id) === 100
  );
  
  const notStartedCourses = enrolledCoursesData.filter(course => 
    getCourseProgress(course.id) === 0
  );
  
  const totalProgress = enrolledCoursesData.length 
    ? Math.round(
        enrolledCoursesData.reduce((sum, course) => sum + getCourseProgress(course.id), 0) / 
        enrolledCoursesData.length
      )
    : 0;
  
  const formatLastAccessed = (courseId: string) => {
    const date = getLastAccessedDate(courseId);
    if (!date) return 'Never';
    
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Dashboard Header */}
          <section className="mb-10">
            <h1 className="text-3xl font-bold mb-2">My Learning Dashboard</h1>
            <p className="text-muted-foreground">Track your progress and continue learning</p>
          </section>
          
          {/* Stats Overview */}
          <section className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">Courses Enrolled</p>
                    <h3 className="text-3xl font-bold">{enrolledCoursesData.length}</h3>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Book className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="glass-panel rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">Courses Completed</p>
                    <h3 className="text-3xl font-bold">{completedCourses.length}</h3>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="glass-panel rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">Overall Progress</p>
                    <h3 className="text-3xl font-bold">{totalProgress}%</h3>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <BarChart2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <ProgressBar progress={totalProgress} className="mt-4" size="sm" showLabel={false} />
              </div>
            </div>
          </section>
          
          {enrolledCoursesData.length > 0 ? (
            <>
              {/* In Progress Courses */}
              {inProgressCourses.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">In Progress</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                          "p-2 rounded-md transition-colors",
                          viewMode === 'grid' ? "bg-secondary" : "hover:bg-secondary/50"
                        )}
                      >
                        <Grid className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                          "p-2 rounded-md transition-colors",
                          viewMode === 'list' ? "bg-secondary" : "hover:bg-secondary/50"
                        )}
                      >
                        <List className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {inProgressCourses.map(course => (
                        <div key={course.id} className="animate-fade-in">
                          <CourseCard course={course} enrolled={true} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inProgressCourses.map(course => {
                        const progress = getCourseProgress(course.id);
                        return (
                          <div 
                            key={course.id} 
                            className="bg-white dark:bg-gray-900 border border-border rounded-xl overflow-hidden animate-fade-in"
                          >
                            <div className="flex flex-col sm:flex-row">
                              <div className="sm:w-48 h-32 sm:h-auto">
                                <img 
                                  src={course.thumbnail} 
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-5 flex-1">
                                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mb-4">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>Last accessed: {formatLastAccessed(course.id)}</span>
                                </div>
                                <div className="mb-3">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Progress</span>
                                    <span>{progress}%</span>
                                  </div>
                                  <ProgressBar progress={progress} size="sm" showLabel={false} />
                                </div>
                                <button
                                  onClick={() => navigate(`/course/${course.id}`)}
                                  className="text-primary hover:underline text-sm font-medium"
                                >
                                  Continue Learning
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}
              
              {/* Not Started Courses */}
              {notStartedCourses.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-semibold mb-6">Not Started Yet</h2>
                  
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {notStartedCourses.map(course => (
                        <div key={course.id} className="animate-fade-in">
                          <CourseCard course={course} enrolled={true} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notStartedCourses.map(course => (
                        <div 
                          key={course.id} 
                          className="bg-white dark:bg-gray-900 border border-border rounded-xl overflow-hidden animate-fade-in"
                        >
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-48 h-32 sm:h-auto">
                              <img 
                                src={course.thumbnail} 
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-5 flex-1">
                              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                              <p className="text-muted-foreground text-sm mb-4">{course.description}</p>
                              <button
                                onClick={() => navigate(`/course/${course.id}`)}
                                className="text-primary hover:underline text-sm font-medium"
                              >
                                Start Learning
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
              
              {/* Completed Courses */}
              {completedCourses.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Completed</h2>
                  
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {completedCourses.map(course => (
                        <div key={course.id} className="relative animate-fade-in">
                          <CourseCard course={course} enrolled={true} />
                          <div className="absolute top-2 right-2 z-10">
                            <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                              <Check className="h-3 w-3" />
                              <span>Completed</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {completedCourses.map(course => (
                        <div 
                          key={course.id} 
                          className="bg-white dark:bg-gray-900 border border-border rounded-xl overflow-hidden animate-fade-in"
                        >
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-48 h-32 sm:h-auto relative">
                              <img 
                                src={course.thumbnail} 
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2">
                                <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                                  <Check className="h-3 w-3" />
                                  <span>Completed</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-5 flex-1">
                              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground mb-4">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Last accessed: {formatLastAccessed(course.id)}</span>
                              </div>
                              <button
                                onClick={() => navigate(`/course/${course.id}`)}
                                className="text-primary hover:underline text-sm font-medium"
                              >
                                Review Course
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </>
          ) : (
            <section className="my-12 py-16 text-center">
              <div className="max-w-md mx-auto">
                <Book className="h-16 w-16 mx-auto text-primary mb-6 animate-float" />
                <h2 className="text-2xl font-semibold mb-3">No courses enrolled yet</h2>
                <p className="text-muted-foreground mb-8">
                  Explore our course catalog and enroll in courses to start your learning journey.
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-all hover:shadow-lg"
                >
                  Browse Courses
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LearnBridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
