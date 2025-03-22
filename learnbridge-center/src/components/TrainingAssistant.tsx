
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import { Lesson } from '@/data/courses';

interface TrainingAssistantProps {
  lesson: Lesson;
  courseId: string;
}

const TrainingAssistant: React.FC<TrainingAssistantProps> = ({ lesson, courseId }) => {
  const openTrainingAssistant = () => {
    // Create URL with lesson and course information
    const assistantUrl = `/training-assistant?courseId=${courseId}&lessonId=${lesson.id}`;
    
    // Open in a new window
    window.open(assistantUrl, '_blank', 'width=800,height=600');
  };

  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2 ml-auto"
      onClick={openTrainingAssistant}
    >
      <span>Open Training Assistant</span>
      <ExternalLink className="h-4 w-4" />
    </Button>
  );
};

export default TrainingAssistant;
