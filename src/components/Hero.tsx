'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselImage {
  src: string;
  alt: string;
  title: string;
}

interface HeroContent {
  mainTitle: string;
  subtitle: string;
}

const Hero = () => {
  // Create autoplay plugin with optimal settings
  const autoplayRef = useRef(
    Autoplay({
      delay: 5000, // 5 seconds for optimal viewing time
      stopOnInteraction: false, // Continue autoplay even after user interaction
      stopOnMouseEnter: true, // Pause on hover for better UX
      stopOnFocusIn: true, // Pause when focused for accessibility
      playOnInit: true, // Start autoplay immediately
      rootNode: (emblaRoot) => emblaRoot.parentElement, // Proper root node
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, // Infinite loop
      align: 'center',
      containScroll: 'trimSnaps',
      dragFree: false,
      duration: 30, // Smooth transition duration
      skipSnaps: false,
      startIndex: 0,
      watchDrag: true,
      watchResize: true,
      watchSlides: true,
      inViewThreshold: 0.7,
      direction: 'ltr',
      axis: 'x',
      // Advanced settings for seamless infinite loop
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': {
          // Optimal settings for desktop
          duration: 25,
          inViewThreshold: 0.8,
        }
      }
    },
    [autoplayRef.current] // Include autoplay plugin
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [heroContent, setHeroContent] = useState<HeroContent>({
    mainTitle: 'Welcome to Kulhudhufushidive',
    subtitle: 'Discover the underwater world with professional diving experiences'
  });
  const [images, setImages] = useState<CarouselImage[]>([]);

  // Load carousel images from localStorage if available, otherwise use default images
  useEffect(() => {
    const defaultImages: CarouselImage[] = [
      {
        src: 'images/media/Hero3.jpg',
        alt: 'Diving Experience 1',
        title: 'Professional Diving'
      },
      {
        src: 'images/media/Hero4.jpg',
        alt: 'Diving Experience 2',
        title: 'Underwater Adventure'
      },
      {
        src: 'images/media/Hero1.jpg',
        alt: 'Diving Experience 3',
        title: 'Ocean Exploration'
      },
      {
        src: 'images/media/Hero2.jpg',
        alt: 'Diving Experience 4',
        title: 'Marine Life Discovery'
      }
    ];

    const loadCarouselImages = () => {
      const savedImages = localStorage.getItem('carouselImages');
      if (savedImages) {
        try {
          const parsedImages = JSON.parse(savedImages);
          if (parsedImages.length > 0) {
            // Use uploaded images if available
            const cleanImages = parsedImages.map((img: CarouselImage, index: number) => ({
              src: img.src,
              alt: img.alt || `Diving experience ${index + 1}`,
              title: img.title || ''
            }));
            setImages(cleanImages);
          } else {
            // If no uploaded images, use default images
            setImages(defaultImages);
          }
        } catch (error) {
          console.error('Error loading carousel images:', error);
          setImages(defaultImages);
        }
      } else {
        // No saved images, use default images
        setImages(defaultImages);
      }
    };

    const loadHeroContent = () => {
      const savedContent = localStorage.getItem('heroContent');
      if (savedContent) {
        try {
          const parsedContent = JSON.parse(savedContent);
          setHeroContent(parsedContent);
        } catch (error) {
          console.error('Error loading hero content:', error);
        }
      }
    };

    // Load data on component mount
    loadCarouselImages();
    loadHeroContent();

    // Listen for updates from admin panel
    const handleCarouselUpdate = () => {
      loadCarouselImages();
    };

    const handleHeroContentUpdate = () => {
      loadHeroContent();
    };

    window.addEventListener('carouselUpdated', handleCarouselUpdate);
    window.addEventListener('heroContentUpdated', handleHeroContentUpdate);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('carouselUpdated', handleCarouselUpdate);
      window.removeEventListener('heroContentUpdated', handleHeroContentUpdate);
    };
  }, []);

  // Navigation functions with optimal UX
  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      // Reset autoplay timer on manual navigation
      autoplayRef.current.reset();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      // Reset autoplay timer on manual navigation  
      autoplayRef.current.reset();
    }
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
      // Reset autoplay timer on manual navigation
      autoplayRef.current.reset();
    }
  }, [emblaApi]);

  // Initialize carousel state and event handlers
  const onInit = useCallback(() => {
    // Carousel is initialized - ready for optimal infinite looping
  }, []);

  const onSelect = useCallback((emblaApi: UseEmblaCarouselType[1]) => {
    if (emblaApi) {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, []);

  // Setup optimal carousel behavior
  useEffect(() => {
    if (!emblaApi) return;

    onInit();
    onSelect(emblaApi);

    // Enhanced event listeners for seamless infinite loop
    emblaApi.on('reInit', onInit);
    emblaApi.on('select', onSelect);
    
    // Keyboard navigation for accessibility
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      } else if (event.key >= '1' && event.key <= '9') {
        const index = parseInt(event.key) - 1;
        if (index < images.length) {
          event.preventDefault();
          scrollTo(index);
        }
      } else if (event.key === ' ') {
        // Space bar to toggle autoplay
        event.preventDefault();
        if (autoplayRef.current) {
          autoplayRef.current.stop();
          setTimeout(() => autoplayRef.current.play(), 100);
        }
      }
    };

    // Add keyboard listener when carousel is focused
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      emblaApi.off('reInit', onInit);
      emblaApi.off('select', onSelect);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [emblaApi, onInit, onSelect, scrollPrev, scrollNext, scrollTo, images.length]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen">
      {/* Fixed Hero Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {heroContent.mainTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {heroContent.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection('services')}
              className="bg-transparent hover:bg-transparent text-white px-8 py-3 rounded-lg font-semibold transition-colors border border-transparent hover:border-white cursor-pointer"
            >
              Explore Services
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-transparent hover:bg-transparent text-white px-8 py-3 rounded-lg font-semibold transition-colors border border-transparent hover:border-white cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Background Image Carousel or Default Background */}
      {images.length > 0 ? (
        <div 
          className="overflow-hidden h-screen transition-all duration-700 ease-out" 
          ref={emblaRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Hero image carousel"
        >
          <div className="flex h-full">
            {images.map((image, index) => (
              <div 
                key={`${image.src}-${index}`} 
                className="flex-[0_0_100%] min-w-0 relative"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${images.length}: ${image.alt}`}
              >
                <div className="relative w-full h-full">
                  {/* Background Image with optimized loading */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out transform-gpu"
                    style={{
                      backgroundImage: `url(${image.src})`,
                    }}
                  />
                  {/* Preload next image for smoother transitions */}
                  {index === (selectedIndex + 1) % images.length && (
                    <link rel="preload" as="image" href={image.src} />
                  )}
                  {/* Overlay with subtle animation */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50 transition-opacity duration-700 ease-out" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Default background when no images */
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0ea5e9 100%)',
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Carousel Controls - Only show when there are images */}
      {images.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white p-3 rounded-full transition-all duration-200 ease-out z-30 cursor-pointer backdrop-blur-sm border border-white/20 hover:border-white/30 hover:scale-105 active:scale-95"
            aria-label="Previous image"
            role="button"
            tabIndex={0}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white p-3 rounded-full transition-all duration-200 ease-out z-30 cursor-pointer backdrop-blur-sm border border-white/20 hover:border-white/30 hover:scale-105 active:scale-95"
            aria-label="Next image"
            role="button"
            tabIndex={0}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Carousel Indicators - Only show when there are multiple images */}
      {images.length > 1 && (
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30"
          role="tablist"
          aria-label="Carousel pagination"
        >
          {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ease-out cursor-pointer transform hover:scale-125 focus:scale-125 focus:outline-none focus:ring-2 focus:ring-white/50 ${
              index === selectedIndex 
                ? 'bg-white shadow-lg scale-110 ring-2 ring-white/30' 
                : 'bg-white/40 hover:bg-white/70 active:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            role="tab"
            aria-selected={index === selectedIndex}
            tabIndex={index === selectedIndex ? 0 : -1}
          />
        ))}
        </div>
      )}

      {/* Keyboard Navigation Hint - Subtle indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-2 right-4 text-white/30 text-xs z-30 hidden md:block">
          ← → Navigate • Space Pause • 1-9 Direct
        </div>
      )}

      {/* Quick Access Cards */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 hidden lg:flex space-x-4 z-30">
        <button
          onClick={() => scrollToSection('services')}
          className="bg-transparent hover:bg-transparent text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-transparent hover:border-white cursor-pointer"
        >
          View Packages
        </button>
        <button
          onClick={() => scrollToSection('services')}
          className="bg-transparent hover:bg-transparent text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-transparent hover:border-white cursor-pointer"
        >
          Diving Courses
        </button>
        <button
          onClick={() => scrollToSection('about')}
          className="bg-transparent hover:bg-transparent text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-transparent hover:border-white cursor-pointer"
        >
          About Us
        </button>
      </div>
    </section>
  );
};

export default Hero;
