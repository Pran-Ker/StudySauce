
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, BarChart3 } from 'lucide-react';
import { Course } from '@/data/courses';
import { useLearning } from '@/context/LearningContext';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  enrolled?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, enrolled = false }) => {
  const { getCourseProgress } = useLearning();
  const progress = enrolled ? getCourseProgress(course.id) : 0;
  
  return (
    <Link 
      to="/tavus"
      className={cn(
        'block overflow-hidden rounded-xl bg-white dark:bg-gray-900 card-hover',
        'border border-border dark:border-gray-800',
        'transition-all duration-300'
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        {enrolled && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <div className="relative h-16 w-16 mx-auto mb-2">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle 
                    cx="18" cy="18" r="16" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.3)" 
                    strokeWidth="2"
                  />
                  <circle 
                    cx="18" cy="18" r="16" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2"
                    strokeDasharray={`${progress} 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                  {progress}%
                </div>
              </div>
              <span className="text-white font-medium text-sm">In Progress</span>
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="inline-block px-2 py-1 text-xs rounded-md bg-white/90 font-medium text-primary">
            {course.level}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold line-clamp-1 mb-2">{course.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{course.description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
