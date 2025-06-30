'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Waves, Users, Award, Camera } from 'lucide-react';
import Image from 'next/image';

interface Service {
  id: string | number;
  title: string;
  description: string;
  price: string;
  duration: string;
  includes: string[];
  icon?: React.ReactNode;
  active: boolean;
  type: 'package' | 'course';
  level?: string;
}

const Services = () => {
  const [packages, setPackages] = useState<Service[]>([]);
  const [courses, setCourses] = useState<Service[]>([]);

  // Function to scroll to contact section and pre-select service
  const handleBookNow = (serviceTitle: string, serviceType: 'package' | 'course') => {
    // Store the selected service in localStorage for the Contact form
    const serviceData = {
      service: serviceTitle,
      type: serviceType,
      timestamp: Date.now()
    };
    localStorage.setItem('selectedService', JSON.stringify(serviceData));
    
    // Scroll to contact section
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
      
      // Small delay to ensure scrolling starts before dispatching event
      setTimeout(() => {
        window.dispatchEvent(new Event('serviceSelected'));
      }, 100);
    }
  };

  // Default services data (fallback) - memoized to prevent re-renders
  const defaultPackages: Service[] = useMemo(() => [
    {
      id: 'beginner',
      type: 'package',
      title: 'Beginner Package',
      description: 'Perfect for first-time divers. Includes basic training and guided shallow water dives.',
      price: '$150',
      duration: 'Half Day',
      includes: ['Basic equipment', 'Instructor guidance', 'Shallow water dive', 'Certificate'],
      icon: <Waves className="h-8 w-8" />,
      active: true
    },
    {
      id: 'advanced',
      type: 'package',
      title: 'Advanced Package',
      description: 'For experienced divers seeking deeper adventures and marine life encounters.',
      price: '$250',
      duration: 'Full Day',
      includes: ['Advanced equipment', 'Deep water dives', 'Marine life tour', 'Underwater photos'],
      icon: <Users className="h-8 w-8" />,
      active: true
    },
    {
      id: 'professional',
      type: 'package',
      title: 'Professional Package',
      description: 'Complete diving experience with multiple dive sites and professional guidance.',
      price: '$400',
      duration: '2 Days',
      includes: ['Premium equipment', 'Multiple dive sites', 'Night diving', 'Professional certification'],
      icon: <Award className="h-8 w-8" />,
      active: true
    }
  ], []);

  const defaultCourses: Service[] = useMemo(() => [
    {
      id: 'open-water',
      type: 'course',
      title: 'Open Water Course',
      description: 'Get your open water diving certification with our comprehensive course.',
      price: '$350',
      duration: '3-4 Days',
      level: 'Beginner',
      includes: ['Theory sessions', 'Pool training', 'Open water dives', 'PADI certification'],
      icon: <Waves className="h-8 w-8" />,
      active: true
    },
    {
      id: 'advanced-open-water',
      type: 'course',
      title: 'Advanced Open Water',
      description: 'Build on your skills with advanced diving techniques and deeper exploration.',
      price: '$450',
      duration: '2-3 Days',
      level: 'Intermediate',
      includes: ['5 Adventure dives', 'Deep dive', 'Navigation dive', 'Advanced certification'],
      icon: <Users className="h-8 w-8" />,
      active: true
    },
    {
      id: 'rescue-diver',
      type: 'course',
      title: 'Rescue Diver Course',
      description: 'Learn rescue techniques and become a more confident, capable diver.',
      price: '$550',
      duration: '3-4 Days',
      level: 'Advanced',
      includes: ['Rescue scenarios', 'Emergency procedures', 'First aid training', 'Certification'],
      icon: <Award className="h-8 w-8" />,
      active: true
    },
    {
      id: 'divemaster',
      type: 'course',
      title: 'Divemaster Course',
      description: 'Professional level training for those looking to guide other divers.',
      price: '$800',
      duration: '2-3 Weeks',
      level: 'Professional',
      includes: ['Leadership training', 'Dive theory', 'Practical skills', 'Professional certification'],
      icon: <Camera className="h-8 w-8" />,
      active: true
    }
  ], []);

  // Load services from localStorage
  const loadServices = useCallback(() => {
    try {
      const savedServices = localStorage.getItem('adminServices');
      if (savedServices) {
        const parsedServices: Service[] = JSON.parse(savedServices);
        const activeServices = parsedServices.filter((service: Service) => service.active);
        
        if (activeServices.length > 0) {
          // Separate packages and courses
          const servicePackages = activeServices
            .filter((service: Service) => service.type === 'package')
            .map((service: Service) => ({
              ...service,
              icon: getServiceIcon(service.title)
            }));
          
          const serviceCourses = activeServices
            .filter((service: Service) => service.type === 'course')
            .map((service: Service) => ({
              ...service,
              icon: getServiceIcon(service.title),
              level: getServiceLevel(service.title)
            }));
          
          setPackages(servicePackages.length > 0 ? servicePackages : defaultPackages);
          setCourses(serviceCourses.length > 0 ? serviceCourses : defaultCourses);
          return;
        }
      }
      
      // Fallback to default data
      setPackages(defaultPackages);
      setCourses(defaultCourses);
    } catch (error) {
      console.error('Error loading services:', error);
      // Fallback to default data
      setPackages(defaultPackages);
      setCourses(defaultCourses);
    }
  }, [defaultPackages, defaultCourses]);

  // Get appropriate icon based on service title
  const getServiceIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('beginner') || lowerTitle.includes('open water')) {
      return <Waves className="h-8 w-8" />;
    } else if (lowerTitle.includes('advanced') || lowerTitle.includes('rescue')) {
      return <Users className="h-8 w-8" />;
    } else if (lowerTitle.includes('professional') || lowerTitle.includes('divemaster')) {
      return <Camera className="h-8 w-8" />;
    } else {
      return <Award className="h-8 w-8" />;
    }
  };

  // Get service level for courses
  const getServiceLevel = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('beginner') || lowerTitle.includes('open water')) {
      return 'Beginner';
    } else if (lowerTitle.includes('advanced')) {
      return 'Intermediate';
    } else if (lowerTitle.includes('rescue')) {
      return 'Advanced';
    } else if (lowerTitle.includes('divemaster') || lowerTitle.includes('professional')) {
      return 'Professional';
    } else {
      return 'Intermediate';
    }
  };

  // Load services on component mount
  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Listen for services updates from admin panel
  useEffect(() => {
    const handleServicesUpdate = () => {
      loadServices();
    };

    window.addEventListener('servicesUpdated', handleServicesUpdate);
    
    return () => {
      window.removeEventListener('servicesUpdated', handleServicesUpdate);
    };
  }, [loadServices]);

  return (
    <section 
      id="services" 
      className="py-20 relative overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/backgrounds/BG1.jpg" 
          alt="Diving courses background"
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl shadow-black">Our Services</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-xl shadow-black">
            Discover the underwater world with our expertly crafted diving packages and professional courses
          </p>
        </div>

        {/* Packages Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-white mb-12 drop-shadow-xl shadow-black">Diving Packages</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className="relative bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
                style={{
                  backgroundImage: 'url(/images/backgrounds/BG5.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Background overlay for better text readability */}
                <div className="absolute inset-0  bg-opacity-85 backdrop-blur-sm"></div>
                
                <div className="relative z-10 p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-lg mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                    <div className="text-blue-600">
                      {pkg.icon}
                    </div>
                  </div>
                  
                  <h4 className="text-2xl font-bold text-white text-center mb-4">{pkg.title}</h4>
                  <p className="text-gray-200 text-center mb-6">{pkg.description}</p>
                  
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-gray-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.7)]">{pkg.price}</span>
                    <span className="text-gray-200 ml-2">/ {pkg.duration}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.includes.map((item: string, index: number) => (
                      <li key={index} className="flex items-center text-white">
                        <div className="w-2 h-2 bg-blue-200 rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => handleBookNow(pkg.title, 'package')}
                    className="bg-transparent hover:bg-transparent text-white px-8 py-3 rounded-lg font-semibold transition-colors border border-transparent hover:border-white cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses Section */}
        <div>
          <h3 className="text-3xl font-bold text-center text-white mb-12 drop-shadow-xl shadow-black">Diving Courses</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <div 
                key={course.id}
                className="relative bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 group cursor-pointer"
                style={{
                  backgroundImage: 'url(/images/backgrounds/BG4.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Background overlay for better text readability */}
                <div className="absolute inset-0  rounded-xl backdrop-blur-sm"></div>
                
                <div className="relative z-10 flex items-start">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-50 rounded-lg mr-6 group-hover:bg-green-200 transition-colors flex-shrink-0">
                    <div className="text-green-600">
                      {course.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-white">{course.title}</h4>
                      <span className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {course.level}
                      </span>
                    </div>
                    
                    <p className="text-white mb-4">{course.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-green-600">{course.price}</span>
                        <span className="text-gray-200 ml-2">/ {course.duration}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleBookNow(course.title, 'course')}
                      className="bg-transparent hover:bg-transparent text-white px-8 py-3 rounded-lg font-semibold transition-colors border border-transparent hover:border-white cursor-pointer"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center rounded-2xl p-12 text-white relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden z-0 bg-blue-950">
            <Image 
              src="/images/backgrounds/BG1.jpg" 
              alt="Ready to dive background"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          
          {/* Content */}
          <div className="relative z-20">
            <h3 className="text-3xl font-bold mb-4 text-white drop-shadow-2xl shadow-black">Ready to Dive In?</h3>
            <p className="text-xl mb-8 text-white drop-shadow-xl shadow-black">
              Contact us today to book your diving adventure or course
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-transparent hover:bg-transparent text-white px-8 py-3 rounded-lg font-semibold transition-colors border border-transparent hover:border-white cursor-pointer"
            >
              Get in Touch
            </button>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
