import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, User, BarChart3, CheckCircle, Circle, Video, FileText, HelpCircle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Course } from '@/data/courses';
import { useLearning } from '@/context/LearningContext';
import ProgressBar from '@/components/ProgressBar';
import TrainingAssistant from '@/components/TrainingAssistant';

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourse, enrollCourse, isEnrolled, getCourseProgress, getLessonStatus } = useLearning();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  
  useEffect(() => {
    if (courseId) {
      const fetchedCourse = getCourse(courseId);
      setCourse(fetchedCourse);
    }
  }, [courseId, getCourse]);
  
  useEffect(() => {
    if (courseId) {
      setEnrolled(isEnrolled(courseId));
      setProgress(getCourseProgress(courseId));
    }
  }, [courseId, isEnrolled, getCourseProgress]);
  
  const handleEnroll = () => {
    if (courseId) {
      enrollCourse(courseId);
      setEnrolled(true);
      setShowEnrollModal(false);
    }
  };
  
  const jumpToFirstIncompleteLesson = () => {
    if (course) {
      for (const module of course.modules) {
        const incompleteLesson = module.lessons.find(lesson => !getLessonStatus(course.id, lesson.id));
        if (incompleteLesson) {
          //window.location.href = `/course/${course.id}?lesson=${incompleteLesson.id}`;
          window.open(`/training-assistant?courseId=${course.id}&lessonId=${incompleteLesson.id}`, '_blank');
          return;
        }
      }
      // If all lessons are complete
      alert('Congratulations! You have completed all lessons in this course.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6">
        {course ? (
          <div className="container mx-auto max-w-6xl">
            {/* Course Header */}
            <div className="flex flex-col md:flex-row gap-8 mb-10">
              <div className="w-full md:w-2/3">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  {course.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span>{course.level}</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/3">
                <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full aspect-video object-cover"
                  />
                  
                  <div className="p-5">
                    {enrolled ? (
                      <div className="space-y-4">
                        <div className="flex flex-col">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Your progress</span>
                            <span className="text-sm">{progress}%</span>
                          </div>
                          <ProgressBar progress={progress} />
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => jumpToFirstIncompleteLesson()}
                        >
                          {progress > 0 && progress < 100 ? 'Continue Learning' : 'Start Learning'}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-muted-foreground text-sm">
                          Enroll in this course to track your progress and access all lessons.
                        </p>
                        <Button 
                          className="w-full"
                          onClick={() => setShowEnrollModal(true)}
                        >
                          Enroll Now
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Course Content */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Course Content</h2>
              
              <Accordion type="single" collapsible className="w-full">
                {course.modules.map((module, moduleIndex) => (
                  <AccordionItem key={moduleIndex} value={`module-${moduleIndex}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex justify-between items-center w-full pr-4">
                        <span>{module.title}</span>
                        <span className="text-muted-foreground text-sm">
                          {module.lessons.length} lessons
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 py-2">
                        {module.lessons.map((lesson) => {
                          const isCompleted = enrolled ? getLessonStatus(course.id, lesson.id) : false;
                          
                          return (
                            <div key={lesson.id} className="flex items-center p-2 rounded-md hover:bg-muted/50">
                              <div className="mr-2">
                                {isCompleted ? (
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                ) : (
                                  <Circle className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-grow">
                                <div className="flex items-center">
                                  {lesson.type === 'video' && <Video className="h-4 w-4 mr-2 text-muted-foreground" />}
                                  {lesson.type === 'article' && <FileText className="h-4 w-4 mr-2 text-muted-foreground" />}
                                  {lesson.type === 'quiz' && <HelpCircle className="h-4 w-4 mr-2 text-muted-foreground" />}
                                  <span className={isCompleted ? 'text-muted-foreground' : ''}>{lesson.title}</span>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-muted-foreground mr-4">{lesson.duration}</span>
                                {enrolled && <TrainingAssistant lesson={lesson} courseId={course.id} />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            {/* About the Instructor */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">About the Instructor</h2>
              <div className="flex items-start gap-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${course.instructor}`} />
                  <AvatarFallback>{course.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-medium mb-2">{course.instructor}</h3>
                  <p className="text-muted-foreground">
                    Apple Certified Professional Trainer with expertise in {course.tags.join(', ')}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading course details...</p>
          </div>
        )}
      </main>
      
      {/* Enrollment Modal */}
      <Dialog open={showEnrollModal} onOpenChange={setShowEnrollModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll in Course</DialogTitle>
            <DialogDescription>
              You're about to enroll in <span className="font-medium">{course?.title}</span>. You can track your progress and access all course materials.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">By enrolling, you'll be able to:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Track your progress through the course</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Access interactive lesson content</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Use the training assistant for guided learning</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Receive a completion certificate</span>
              </li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnrollModal(false)}>Cancel</Button>
            <Button onClick={handleEnroll}>Enroll Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Footer */}
      <footer className="bg-secondary/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Apple Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CourseDetails;
