'use client';

import { Facebook, Instagram, X, Mail, Phone, MapPin, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface FooterProps {
  onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const { isAuthenticated } = useAuth();
  const scrollToSection = (sectionId: string) => {
    console.log('Footer: Scrolling to section:', sectionId);
    const element = document.getElementById(sectionId);
    console.log('Footer: Found element:', element);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('Footer: Element not found with ID:', sectionId);
    }
  };

  const quickLinks = [
    { name: 'Home', action: () => scrollToSection('home') },
    { name: 'Services', action: () => scrollToSection('services') },
    { name: 'About', action: () => scrollToSection('about') },
    { name: 'Contact', action: () => scrollToSection('contact') }
  ];

  const services = [
    'Beginner Package',
    'Advanced Package',
    'Professional Package',
    'Open Water Course',
    'Advanced Open Water',
    'Rescue Diver Course'
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: '#', label: 'Facebook' },
    { icon: <Instagram className="h-5 w-5" />, href: '#', label: 'Instagram' },
    { icon: <X className="h-5 w-5" />, href: '#', label: 'X (formerly Twitter)' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">Kulhudhufushidive</h3>
            <p className="text-gray-300 mb-6">
              Your premier diving destination in the Maldives. Discover the underwater world 
              with our expert guidance and professional training.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-3 text-blue-400" />
                <span className="text-sm">Kulhudhuffushi Island, Maldives</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-3 text-blue-400" />
                <span className="text-sm">+960 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-3 text-blue-400" />
                <span className="text-sm">info@kulhudhufushidive.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.action}
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm cursor-pointer"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm cursor-pointer"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors cursor-pointer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">
                Subscribe to our newsletter for diving tips and special offers.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm focus:outline-none focus:border-blue-500 text-white"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition-colors cursor-pointer">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>&copy; 2024 Kulhudhufushidive. All rights reserved.</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="text-gray-400 hover:text-gray-300 text-sm transition-colors cursor-pointer">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-gray-300 text-sm transition-colors cursor-pointer">
                Terms of Service
              </button>
              
              {/* Admin Button */}
              <button
                onClick={onAdminClick}
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors group cursor-pointer"
                title={isAuthenticated ? "Admin Panel" : "Admin Login"}
              >
                <Settings className={`h-4 w-4 group-hover:text-gray-300 ${
                  isAuthenticated ? 'text-blue-400' : 'text-gray-400'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
