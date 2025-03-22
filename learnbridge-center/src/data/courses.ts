export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz';
  description?: string;
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  modules: Module[];
  tags: string[];
}

export const courses: Course[] = [
  {
    id: 'server-fundamentals',
    title: 'Server Fundamentals',
    description: 'Master the essentials of server administration and management. This comprehensive course covers deployment, security, and best practices for enterprise server environments.',
    instructor: 'John Smith',
    duration: '6 weeks',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2624&auto=format&fit=crop',
    tags: ['Server', 'Enterprise', 'Professional'],
    modules: [
      {
        title: 'Getting Started',
        lessons: [
          {
            id: 'server-intro',
            title: 'Introduction to Server Management',
            duration: '30 min',
            type: 'video',
            description: 'Learn the fundamentals of server management and administration.'
          }
        ]
      }
    ]
  }
];
