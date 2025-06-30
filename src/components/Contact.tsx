'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, Clock, Send, MapPin } from 'lucide-react';
import Image from 'next/image';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: '+960 123-4567',
    email: 'info@kulhudhufushidive.com',
    address: 'Kulhudhuffushi Island, Haa Dhaalu Atoll, Maldives',
    hours: 'Mon - Sat: 8:00 AM - 6:00 PM'
  });

  // Load contact info from localStorage on mount
  useEffect(() => {
    const loadContactInfo = () => {
      const savedContactInfo = localStorage.getItem('contactInfo');
      if (savedContactInfo) {
        try {
          const parsedContactInfo = JSON.parse(savedContactInfo);
          setContactInfo(parsedContactInfo);
        } catch (error) {
          console.error('Error loading contact info:', error);
        }
      } else {
        // If no contactInfo, check if siteContent has contact data
        const savedSiteContent = localStorage.getItem('siteContent');
        if (savedSiteContent) {
          try {
            const parsedSiteContent = JSON.parse(savedSiteContent);
            if (parsedSiteContent.contact) {
              const contactData = {
                phone: parsedSiteContent.contact.phone,
                email: parsedSiteContent.contact.email,
                address: parsedSiteContent.contact.address,
                hours: parsedSiteContent.contact.hours
              };
              setContactInfo(contactData);
              // Save it in the expected format for future use
              localStorage.setItem('contactInfo', JSON.stringify(contactData));
            }
          } catch (error) {
            console.error('Error loading site content:', error);
          }
        }
      }
    };

    loadContactInfo();

    // Listen for contact info updates from AdminPanel
    const handleContactInfoUpdate = () => {
      loadContactInfo();
    };

    // Listen for service selection from Services page
    const handleServiceSelection = () => {
      const selectedServiceData = localStorage.getItem('selectedService');
      if (selectedServiceData) {
        try {
          const serviceData = JSON.parse(selectedServiceData);
          // Auto-populate the service field
          setFormData(prevData => ({
            ...prevData,
            service: serviceData.service
          }));
          
          // Focus on the service dropdown to highlight the selection
          setTimeout(() => {
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
              serviceSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
              serviceSelect.focus();
            }
          }, 500);
          
          // Clear the selection after use
          localStorage.removeItem('selectedService');
        } catch (error) {
          console.error('Error loading selected service:', error);
        }
      }
    };

    window.addEventListener('contactInfoUpdated', handleContactInfoUpdate);
    window.addEventListener('siteContentUpdated', handleContactInfoUpdate);
    window.addEventListener('serviceSelected', handleServiceSelection);
    
    return () => {
      window.removeEventListener('contactInfoUpdated', handleContactInfoUpdate);
      window.removeEventListener('siteContentUpdated', handleContactInfoUpdate);
      window.removeEventListener('serviceSelected', handleServiceSelection);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        alert('Thank you for your message! We will get back to you soon.');
      } else {
        alert(`Error: ${result.error || 'Failed to send message'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section 
      id="contact" 
      className="py-20 relative overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/backgrounds/BG2.jpg" 
          alt="Contact us background"
          fill
          className="object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">Contact Us</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-[0_4px_4px_rgba(0,0,0,0.7)]">
              Ready to start your diving adventure? Get in touch with us today to book your experience 
              or ask any questions about our services.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div className="bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg p-8 h-fit">
              <h3 className="text-2xl font-bold text-white-900 mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white-800 mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-white-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white-800 mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-white-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white-800 mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-white-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                      placeholder="+960 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-white-800 mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                      Service of Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg transition-all duration-200 text-white
                                bg-blue-900/30 backdrop-blur-md border border-blue-300/30 
                                hover:border-blue-400/50 focus:border-blue-500/70
                                focus:ring-2 focus:ring-blue-500/50 focus:outline-none 
                                shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)]"
                    >
                      <option value="" className="bg-blue-900/90 backdrop-blur-md text-white">Select a service</option>
                      <option value="Beginner Package" className="bg-blue-800/90 hover:bg-blue-700/90 text-white">Beginner Package</option>
                      <option value="Advanced Package" className="bg-blue-800/90 hover:bg-blue-700/90 text-white">Advanced Package</option>
                      <option value="Professional Package" className="bg-blue-800/90 hover:bg-blue-700/90 text-white">Professional Package</option>
                      <option value="Open Water Course" className="bg-blue-800/90 hover:bg-blue-700/90 text-white">Open Water Course</option>
                      <option value="Advanced Open Water" className="bg-blue-800/90 hover:bg-blue-700/90 text-white">Advanced Open Water</option>
                      <option value="Rescue Diver Course" className="bg-blue-800/90 hover:bg-blue-700/90 text-white">Rescue Diver Course</option>
                      <option value="Divemaster Course" className="bg-blue-800/90 hover:bg-blue-700/90 text-white">Divemaster Course</option>
                      <option value="Other" className="bg-blue-800/90 hover:bg-blue-700/90 text-white">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white-800 mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-white-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                    placeholder="Tell us about your diving experience level, preferred dates, and any specific questions..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 mt-5 border-2 cursor-pointer ${
                    isSubmitting 
                      ? 'bg-blue-400/20 border-blue-400/50 cursor-not-allowed backdrop-blur-sm' 
                      : 'bg-transparent border-white/30 hover:bg-white/10 hover:backdrop-blur-md hover:border-white/50 text-white shadow-[0_4px_6px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.4)]'
                  }`}
                >
                  <Send className="h-5 w-5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
                  <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </span>
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Phone */}
              <div className="bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mr-4 flex-shrink-0 shadow-md">
                    <div className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                      <Phone className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white-900 mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Phone</h4>
                    <p className="text-white-900 font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">{contactInfo.phone}</p>
                    <p className="text-white-700 text-sm mt-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">Call us anytime for immediate assistance</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mr-4 flex-shrink-0 shadow-md">
                    <div className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                      <Mail className="h-6 w-6 text-red-500" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white-900 mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Email</h4>
                    <p className="text-white-900 font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">{contactInfo.email}</p>
                    <p className="text-white-700 text-sm mt-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">Send us an email and we&apos;ll respond within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mr-4 flex-shrink-0 shadow-md">
                    <div className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                      <MapPin className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white-900 mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Address</h4>
                    <p className="text-white-900 font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">{contactInfo.address}</p>
                    <p className="text-white-700 text-sm mt-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">Visit us at our beautiful island location</p>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mr-4 flex-shrink-0 shadow-md">
                    <div className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                      <Clock className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white-900 mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Operating Hours</h4>
                    <p className="text-white-900 font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">{contactInfo.hours}</p>
                    <p className="text-white-700 text-sm mt-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">We&apos;re here to help during these hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map - Full Width */}
          <div className="mt-10 bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-white-900 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Find Us</h4>
              <button
                onClick={() => window.open('https://www.google.com/maps/place/Kulhudhuffushi/data=!4m2!3m1!1s0x3b6ce80a05f52b95:0x4010be64f168218b?sa=X&ved=1t:242&ictx=111', '_blank')}
                className="text-white-300 hover:text-white-700 text-sm font-medium transition-colors drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] cursor-pointer"
              >
                Open in Google Maps
              </button>
            </div>
            
            {/* Embedded Google Map */}
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31708.123456789!2d73.0123456!3d6.6123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b6ce80a05f52b95%3A0x4010be64f168218b!2sKulhudhuffushi%2C%20Maldives!5e0!3m2!1sen!2s!4v1640995200000!5m2!1sen!2s"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kulhudhuffushi Location"
                className="w-full h-[400px]"
              ></iframe>
              
              {/* Overlay with click handler for mobile devices */}
              <div 
                className="absolute inset-0 bg-transparent cursor-pointer lg:hidden"
                onClick={() => window.open('https://www.google.com/maps/place/Kulhudhuffushi/data=!4m2!3m1!1s0x3b6ce80a05f52b95:0x4010be64f168218b?sa=X&ved=1t:242&ictx=111', '_blank')}
                title="Open in Google Maps"
              ></div>
            </div>
            
            {/* Location Details */}
            <div className="mt-4 text-center">
              <p className="text-white-900 font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Kulhudhuffushi Island</p>
              <p className="text-white-700 text-sm drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Haa Dhaalu Atoll, Maldives</p>
              <p className="text-white-600 text-xs mt-2 lg:hidden drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Tap map to open in Google Maps</p>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-12 bg-red-50 bg-opacity-80 backdrop-blur-md border border-red-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <Phone className="h-6 w-6 text-red-600 mr-3 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]" />
              <div>
                <h4 className="text-lg font-bold text-red-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">Emergency Contact</h4>
                <p className="text-red-500 drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]">
                  For diving emergencies or urgent assistance: <strong>+960 911-DIVE (3483)</strong>
                </p>
                <p className="text-red-600 text-sm mt-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]">Available 24/7 for emergency situations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
