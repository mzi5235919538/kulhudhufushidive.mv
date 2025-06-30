'use client';

import { Shield, Users, Award, MapPin } from 'lucide-react';
import Image from 'next/image';

const About = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: 'Safety First',
      description: 'We prioritize safety above all with certified equipment and experienced instructors following international safety standards.'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-700" />,
      title: 'Expert Instructors',
      description: 'Our team consists of certified diving professionals with years of experience in the Maldivian waters.'
    },
    {
      icon: <Award className="h-8 w-8 text-blue-300" />,
      title: 'Certified Training',
      description: 'All our courses are internationally recognized and certified by leading diving organizations.'
    },
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      title: 'Prime Location',
      description: 'Located in the heart of the Maldives, we offer access to some of the world\'s most beautiful dive sites.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Happy Divers' },
    { number: '50+', label: 'Dive Sites' },
    { number: '10+', label: 'Years Experience' },
    { number: '100%', label: 'Safety Record' }
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="images/backgrounds/BG3.jpg" 
          alt="About us background"
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl shadow-black">About Kulhudhufushidive</h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-xl shadow-black">
            Your premier diving destination in the Maldives, offering world-class diving experiences 
            and professional training in the crystal-clear waters of the Indian Ocean.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className='bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg p-8 text-white'>
            <h3 className="text-3xl font-bold text-white mb-6 drop-shadow-xl shadow-black">Our Story</h3>
            <p className="text-gray-200 mb-6 drop-shadow-lg shadow-white">
              Founded in 2013, Kulhudhufushidive began as a passion project by a group of marine 
              enthusiasts who fell in love with the incredible underwater biodiversity of the Maldives. 
              What started as a small diving operation has grown into one of the most trusted diving 
              centers in the region.
            </p>
            <p className="text-gray-200 mb-6 drop-shadow-lg shadow-white">
              We are dedicated to sharing the magic of the underwater world while promoting marine 
              conservation and sustainable diving practices. Our team of certified professionals 
              ensures every dive is safe, educational, and unforgettable.
            </p>
            <p className="text-gray-200 drop-shadow-lg shadow-white">
              Whether you&apos;re a complete beginner or an experienced diver, we provide personalized 
              experiences that cater to your skill level and interests, making every underwater 
              adventure a memory to treasure.
            </p>
          </div>
          
          <div className="bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg p-8 text-white">
            <h4 className="text-2xl font-bold mb-6">Why Choose Us?</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <span>PADI certified instructors with local expertise</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <span>Small group sizes for personalized attention</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <span>Premium diving equipment and safety gear</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <span>Access to exclusive dive sites</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <span>Commitment to marine conservation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="text-center bg-opacity-70 backdrop-blur-md rounded-xl  p-6 shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4">
                <div>
                  {feature.icon}
                </div>
              </div>
              <h4 className="text-xl font-bold text-white drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)] mb-3">{feature.title}</h4>
              <p className="text-white-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-opacity-30 backdrop-blur-md rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-center text-white mb-12 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">Our Achievements</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-700 mb-2 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">{stat.number}</div>
                <div className="text-white-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-white mb-6 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">Our Mission</h3>
          <p className="text-xl text-white-200 max-w-4xl mx-auto drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            To provide safe, educational, and inspiring diving experiences while fostering a deep 
            appreciation for marine life and promoting the conservation of our precious ocean ecosystems 
            for future generations.
          </p>
        </div>
        </div>
      </div>
    </section>
  );
};

export default About;
