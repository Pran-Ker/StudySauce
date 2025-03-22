
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Search, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import { useLearning } from '@/context/LearningContext';
import { Course } from '@/data/courses';

const Index = () => {
  const { courses } = useLearning();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Filter courses based on search query and filters
    const filtered = courses.filter(course => {
      const matchesSearch = 
        searchQuery === '' || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
      const matchesCategories = 
        selectedCategories.length === 0 || 
        course.tags.some(tag => selectedCategories.includes(tag));
        
      const matchesLevels = 
        selectedLevels.length === 0 || 
        selectedLevels.includes(course.level);
        
      return matchesSearch && matchesCategories && matchesLevels;
    });
    
    setFilteredCourses(filtered);
  }, [searchQuery, selectedCategories, selectedLevels, courses]);

  // Extract all unique categories and levels
  const allCategories = Array.from(new Set(courses.flatMap(course => course.tags)));
  const allLevels = Array.from(new Set(courses.map(course => course.level)));
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level) 
        : [...prev, level]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Hero Section */}
          <section className="relative mb-16 rounded-2xl overflow-hidden">
            <div className="glass-panel rounded-2xl p-8 sm:p-10 md:p-16 flex flex-col items-start">
              <div className="max-w-2xl">
                <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-4 animate-slide-up">
                  Apple Professional Training
                </h1>
                <p className="text-muted-foreground text-lg mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
                  Master Apple technologies with our comprehensive training courses designed for professionals. Learn at your own pace with interactive lessons.
                </p>
                <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                  <button 
                    onClick={() => document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-all hover:shadow-lg"
                  >
                    Explore Courses
                  </button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Search and Filters */}
          <section className="mb-10">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className={`relative w-full sm:max-w-md transition-all duration-300 ${isSearchFocused ? 'sm:max-w-xl' : ''}`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input 
                  type="text"
                  placeholder="Search for courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>
              
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-input bg-background hover:bg-secondary/50 transition-colors"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
            
            {isFilterOpen && (
              <div className="mt-4 p-4 border border-input rounded-lg bg-background animate-slide-down">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {allCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedCategories.includes(category)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Level</h3>
                    <div className="flex flex-wrap gap-2">
                      {allLevels.map((level) => (
                        <button
                          key={level}
                          onClick={() => toggleLevel(level)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedLevels.includes(level)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
          
          {/* Courses Grid */}
          <section id="courses-section">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Professional Courses</h2>
              <span className="text-muted-foreground">{filteredCourses.length} courses</span>
            </div>
            
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="animate-scale-in">
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No courses found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </section>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Apple Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
