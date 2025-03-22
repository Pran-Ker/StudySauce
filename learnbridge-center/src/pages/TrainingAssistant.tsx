
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLearning } from '@/context/LearningContext';
import { Lesson, Module } from '@/data/courses';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, PlayCircle, FileText, HelpCircle } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

const TrainingAssistant = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const lessonId = searchParams.get('lessonId');
  
  const { getCourse, markLessonCompleted, getLessonStatus } = useLearning();
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [questionMode, setQuestionMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  
  // Mock quiz questions - in a real app, these would come from an API
  const mockQuestions = [
    {
      question: "What is the primary benefit of using this approach?",
      options: [
        "Faster processing speed",
        "Better user experience",
        "Lower memory usage",
        "Enhanced security"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of the following is a best practice for implementation?",
      options: [
        "Always use default settings",
        "Customize for each specific use case",
        "Avoid documentation",
        "Ignore performance considerations"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the recommended approach for troubleshooting issues?",
      options: [
        "Restart the system",
        "Check log files first",
        "Contact support immediately",
        "Reinstall the software"
      ],
      correctAnswer: 1
    }
  ];

  useEffect(() => {
    if (courseId && lessonId) {
      const course = getCourse(courseId);
      if (course) {
        // Find the lesson and its module
        let foundLesson: Lesson | null = null;
        let foundModule: Module | null = null;
        
        for (const module of course.modules) {
          const lesson = module.lessons.find(l => l.id === lessonId);
          if (lesson) {
            foundLesson = lesson;
            foundModule = module;
            break;
          }
        }
        
        if (foundLesson && foundModule) {
          setCurrentLesson(foundLesson);
          setCurrentModule(foundModule);
          
          // Initialize question mode if it's a quiz
          if (foundLesson.type === 'quiz') {
            setQuestionMode(true);
          }
          
          document.title = `Training Assistant - ${foundLesson.title}`;
        }
      }
    }
  }, [courseId, lessonId, getCourse]);

  const handleAnswer = (answerIndex: number) => {
    // Save the user's answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = String(answerIndex);
    setUserAnswers(newAnswers);
    
    // Move to next question or show results
    if (currentQuestion < mockQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      // Show results when all questions answered
      const correctAnswers = mockQuestions.filter(
        (q, i) => Number(newAnswers[i]) === q.correctAnswer
      ).length;
      
      const percentage = Math.round((correctAnswers / mockQuestions.length) * 100);
      
      toast({
        title: "Quiz completed!",
        description: `You scored ${correctAnswers}/${mockQuestions.length} (${percentage}%)`,
        duration: 5000,
      });
      
      // Mark lesson as completed
      if (courseId && lessonId) {
        markLessonCompleted(courseId, lessonId);
      }
    }
  };

  const completeLesson = () => {
    if (courseId && lessonId) {
      markLessonCompleted(courseId, lessonId);
      toast({
        title: "Lesson completed!",
        description: "Your progress has been updated.",
        duration: 3000,
      });
    }
  };

  const renderLessonContent = () => {
    if (!currentLesson) return null;
    
    if (currentLesson.type === 'quiz' && questionMode) {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Question {currentQuestion + 1} of {mockQuestions.length}
            </h2>
            <Progress value={(currentQuestion / mockQuestions.length) * 100} className="w-32" />
          </div>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">
              {mockQuestions[currentQuestion].question}
            </h3>
            <div className="space-y-3">
              {mockQuestions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant={userAnswers[currentQuestion] === String(index) ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      );
    }
    
    // For video or article content
    return (
      <div className="space-y-6">
        <div className="bg-secondary/20 rounded-lg p-8 text-center">
          {currentLesson.type === 'video' ? (
            <div className="space-y-4">
              <PlayCircle className="h-16 w-16 mx-auto text-primary" />
              <p className="text-lg">Video lesson content would play here</p>
            </div>
          ) : (
            <div className="space-y-4">
              <FileText className="h-16 w-16 mx-auto text-primary" />
              <p className="text-lg">Article content would display here</p>
            </div>
          )}
        </div>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Lesson Summary</h3>
          <p className="text-muted-foreground mb-4">
            {currentLesson.description || "This lesson covers important concepts related to the topic."}
          </p>
          
          <Button onClick={completeLesson} className="w-full">
            Mark as Completed
          </Button>
        </Card>
      </div>
    );
  };

  if (!currentLesson || !currentModule) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading training assistant...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen flex flex-col">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
            <p className="text-muted-foreground">
              {currentModule.title} • {currentLesson.duration}
            </p>
          </div>
          
          {currentLesson.type === 'quiz' && !questionMode && (
            <Button onClick={() => setQuestionMode(true)}>
              Start Quiz
            </Button>
          )}
        </div>
        <Separator className="my-4" />
      </header>
      
      <main className="flex-grow">
        {renderLessonContent()}
      </main>
      
      <footer className="mt-8 pt-4 border-t">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Apple Professional Training
          </p>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span>Help</span>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrainingAssistant;
