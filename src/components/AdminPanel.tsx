'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Save, Edit, Plus, Trash2, ImageIcon, FileText, Users, Settings, Eye, LogOut, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminPanelProps {
  onClose: () => void;
  onPreview: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onPreview }) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('content');
  const [isEditing, setIsEditing] = useState(false);
  const [carouselUpdateStatus, setCarouselUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Hero content state
  const [heroContent, setHeroContent] = useState({
    mainTitle: 'Welcome to Kulhudhufushidive',
    subtitle: 'Discover the underwater world with professional diving experiences'
  });
  
  // Media library state - start with empty array
  const [uploadedImages, setUploadedImages] = useState<Array<{id: number, url: string, name: string, isInCarousel: boolean, filename?: string}>>([]);

  // Messages state
  const [messages, setMessages] = useState<Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>>([]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  // Load persisted images and hero content on component mount
  useEffect(() => {
    const loadData = async () => {
      // Load images
      const savedImages = localStorage.getItem('adminUploadedImages');
      if (savedImages) {
        try {
          const parsedImages = JSON.parse(savedImages);
          if (parsedImages.length > 0) {
            setUploadedImages(parsedImages);
          }
        } catch (error) {
          console.error('Error loading uploaded images:', error);
        }
      }

      // Load hero content
      const savedHeroContent = localStorage.getItem('heroContent');
      if (savedHeroContent) {
        try {
          const parsedContent = JSON.parse(savedHeroContent);
          setHeroContent(parsedContent);
        } catch (error) {
          console.error('Error loading hero content:', error);
        }
      }

      // Load site content including contact info
      const savedSiteContent = localStorage.getItem('siteContent');
      if (savedSiteContent) {
        try {
          const parsedContent = JSON.parse(savedSiteContent);
          setSiteContent(parsedContent);
        } catch (error) {
          console.error('Error loading site content:', error);
        }
      }

      // Sync contact information with Contact component's expected format
      const savedContactInfo = localStorage.getItem('contactInfo');
      if (savedContactInfo) {
        try {
          const parsedContactInfo = JSON.parse(savedContactInfo);
          // Update siteContent with contact info if it's different
          setSiteContent(prevContent => ({
            ...prevContent,
            contact: {
              phone: parsedContactInfo.phone || prevContent.contact.phone,
              email: parsedContactInfo.email || prevContent.contact.email,
              address: parsedContactInfo.address || prevContent.contact.address,
              hours: parsedContactInfo.hours || prevContent.contact.hours
            }
          }));
        } catch (error) {
          console.error('Error loading contact info:', error);
        }
      }

      // Load messages
      await loadMessages();
    };

    loadData();
  }, []);

  // Persist images to localStorage whenever uploadedImages changes
  useEffect(() => {
    localStorage.setItem('adminUploadedImages', JSON.stringify(uploadedImages));
  }, [uploadedImages]);

  // Sample data - in a real app, this would come from a database
  const [siteContent, setSiteContent] = useState({
    hero: {
      title: 'Welcome to Kulhudhufushidive',
      subtitle: 'Discover the underwater world with professional diving experiences'
    },
    about: {
      title: 'About Kulhudhufushidive',
      description: 'Your premier diving destination in the Maldives...',
      stats: [
        { number: '500+', label: 'Happy Divers' },
        { number: '50+', label: 'Dive Sites' },
        { number: '10+', label: 'Years Experience' },
        { number: '100%', label: 'Safety Record' }
      ]
    },
    contact: {
      phone: '+960 123-4567',
      email: 'info@kulhudhufushidive.com',
      address: 'Kulhudhuffushi Island, Haa Dhaalu Atoll, Maldives',
      hours: 'Mon - Sat: 8:00 AM - 6:00 PM'
    }
  });

  const [services, setServices] = useState([
    {
      id: 1,
      type: 'package',
      title: 'Beginner Package',
      price: '$150',
      duration: 'Half Day',
      description: 'Perfect for first-time divers. Includes basic training and guided shallow water dives.',
      includes: ['Basic equipment', 'Instructor guidance', 'Shallow water dive', 'Certificate'],
      active: true
    },
    {
      id: 2,
      type: 'package',
      title: 'Advanced Package',
      price: '$250',
      duration: 'Full Day',
      description: 'For experienced divers seeking deeper adventures and marine life encounters.',
      includes: ['Advanced equipment', 'Deep water dives', 'Marine life tour', 'Underwater photos'],
      active: true
    },
    {
      id: 3,
      type: 'package',
      title: 'Professional Package',
      price: '$400',
      duration: '2 Days',
      description: 'Complete diving experience with multiple dive sites and professional guidance.',
      includes: ['Premium equipment', 'Multiple dive sites', 'Night diving', 'Professional certification'],
      active: true
    },
    {
      id: 4,
      type: 'course',
      title: 'Open Water Course',
      price: '$350',
      duration: '3-4 Days',
      description: 'Get your open water diving certification with our comprehensive course.',
      includes: ['Theory sessions', 'Pool training', 'Open water dives', 'PADI certification'],
      active: true
    },
    {
      id: 5,
      type: 'course',
      title: 'Advanced Open Water',
      price: '$450',
      duration: '2-3 Days',
      description: 'Build on your skills with advanced diving techniques and deeper exploration.',
      includes: ['5 Adventure dives', 'Deep dive', 'Navigation dive', 'Advanced certification'],
      active: true
    }
  ]);

  // Services management state
  const [editingService, setEditingService] = useState<typeof services[0] | null>(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    id: 0,
    type: 'package',
    title: '',
    price: '',
    duration: '',
    description: '',
    includes: [''],
    active: true
  });

  // Load services from localStorage on component mount
  useEffect(() => {
    const savedServices = localStorage.getItem('adminServices');
    if (savedServices) {
      try {
        const parsedServices = JSON.parse(savedServices);
        if (parsedServices.length > 0) {
          setServices(parsedServices);
        }
      } catch (error) {
        console.error('Error loading services:', error);
      }
    }
  }, []);

  // Persist services to localStorage whenever services changes
  useEffect(() => {
    localStorage.setItem('adminServices', JSON.stringify(services));
    // Dispatch event to notify Services component
    window.dispatchEvent(new Event('servicesUpdated'));
  }, [services]);

  const tabs = [
    { id: 'content', label: 'Site Content', icon: <FileText className="h-4 w-4" /> },
    { id: 'services', label: 'Services', icon: <Users className="h-4 w-4" /> },
    { id: 'media', label: 'Media', icon: <ImageIcon className="h-4 w-4" /> },
    { id: 'messages', label: 'Messages', icon: <Mail className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> }
  ];

  const handleSaveHeroContent = () => {
    // Save hero content to localStorage
    localStorage.setItem('heroContent', JSON.stringify(heroContent));
    
    // Dispatch event to notify Hero component
    window.dispatchEvent(new Event('heroContentUpdated'));
    
    alert('Hero content saved successfully!');
  };

  // Image management functions
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const filesArray = Array.from(files);
      
      // Process all files and upload them to the server
      const newImages: Array<{id: number, url: string, name: string, isInCarousel: boolean, filename: string}> = [];
      
      for (const file of filesArray) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          const result = await response.json();
          
          if (result.success) {
            const newImage = {
              id: Date.now() + Math.random(), // Unique ID
              url: result.url,
              name: result.originalName,
              filename: result.filename,
              isInCarousel: false
            };
            newImages.push(newImage);
          } else {
            console.error('Upload failed:', result.error);
            alert(`Failed to upload ${file.name}: ${result.error}`);
          }
        } catch (error) {
          console.error('Upload error:', error);
          alert(`Failed to upload ${file.name}`);
        }
      }
      
      if (newImages.length > 0) {
        setUploadedImages(prev => [...prev, ...newImages]);
      }
    }
    
    // Clear the input to allow re-uploading the same files
    if (event && event.target) {
      (event.target as HTMLInputElement).value = '';
    }
  };

  const toggleCarouselImage = (imageId: number) => {
    setUploadedImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { ...img, isInCarousel: !img.isInCarousel }
          : img
      )
    );
  };

  const removeImage = async (imageId: number) => {
    const imageToRemove = uploadedImages.find(img => img.id === imageId);
    
    // If image has a filename, delete it from the server
    if (imageToRemove?.filename) {
      try {
        const response = await fetch(`/api/upload?filename=${imageToRemove.filename}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        if (!result.success) {
          console.error('Failed to delete file from server:', result.error);
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    
    // Remove from state regardless of server deletion result
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const getCarouselImages = () => {
    return uploadedImages.filter(img => img.isInCarousel);
  };

  // Update carousel display when images change
  useEffect(() => {
    const updateCarouselDisplay = () => {
      const carouselImages = uploadedImages.filter(img => img.isInCarousel).map(img => ({
        src: img.url,
        alt: `Diving experience - ${img.name}`,
        title: ''
      }));
      
      localStorage.setItem('carouselImages', JSON.stringify(carouselImages));
      window.dispatchEvent(new Event('carouselUpdated'));
    };

    updateCarouselDisplay();
  }, [uploadedImages]);

  // Storage management functions
  const clearAllStorage = async () => {
    if (confirm('This will clear all uploaded images and carousel data. Are you sure?')) {
      // Delete all uploaded files from server
      const filesToDelete = uploadedImages.filter(img => img.filename);
      for (const img of filesToDelete) {
        try {
          await fetch(`/api/upload?filename=${img.filename}`, {
            method: 'DELETE',
          });
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
      
      // Clear localStorage data
      localStorage.removeItem('adminUploadedImages');
      localStorage.removeItem('carouselImages');
      localStorage.removeItem('heroContent');
      
      // Reset to empty state instead of default images
      setUploadedImages([]);
      setHeroContent({
        mainTitle: 'Welcome to Kulhudhufushidive',
        subtitle: 'Discover the underwater world with professional diving experiences'
      });
      
      // Notify Hero component to update
      window.dispatchEvent(new Event('carouselUpdated'));
      
      alert('All storage cleared successfully!');
    }
  };

  // Message management functions
  const loadMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      const result = await response.json();
      if (result.success) {
        setMessages(result.messages || []);
      } else {
        console.error('Failed to load messages:', result.error);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: messageId, read: true }),
      });
      
      const result = await response.json();
      if (result.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await fetch(`/api/contact?id=${messageId}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        if (result.success) {
          setMessages(prev => prev.filter(msg => msg.id !== messageId));
          if (selectedMessage === messageId) {
            setSelectedMessage(null);
          }
        } else {
          alert('Failed to delete message');
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Failed to delete message');
      }
    }
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getUnreadMessagesCount = () => {
    return messages.filter(msg => !msg.read).length;
  };


  // Service management functions
  const handleAddService = () => {
    setServiceForm({
      id: 0,
      type: 'package',
      title: '',
      price: '',
      duration: '',
      description: '',
      includes: [''],
      active: true
    });
    setShowServiceForm(true);
    setEditingService(null);
  };

  const handleEditService = (service: typeof services[0]) => {
    setServiceForm({ ...service });
    setShowServiceForm(true);
    setEditingService(service);
  };

  const handleDeleteService = (serviceId: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(service => service.id !== serviceId));
    }
  };

  const handleToggleServiceStatus = (serviceId: number) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, active: !service.active }
          : service
      )
    );
  };

  const handleSaveService = () => {
    // Validate required fields
    if (!serviceForm.title.trim()) {
      alert('Please enter a service title');
      return;
    }
    if (!serviceForm.price.trim()) {
      alert('Please enter a price');
      return;
    }
    if (!serviceForm.duration.trim()) {
      alert('Please enter a duration');
      return;
    }
    if (!serviceForm.description.trim()) {
      alert('Please enter a description');
      return;
    }
    
    // Validate includes array - remove empty items
    const validIncludes = serviceForm.includes.filter(item => item.trim() !== '');
    if (validIncludes.length === 0) {
      alert('Please add at least one item to the includes list');
      return;
    }

    const serviceToSave = {
      ...serviceForm,
      includes: validIncludes,
      title: serviceForm.title.trim(),
      price: serviceForm.price.trim(),
      duration: serviceForm.duration.trim(),
      description: serviceForm.description.trim()
    };

    if (editingService) {
      // Update existing service
      setServices(prev => 
        prev.map(service => 
          service.id === editingService.id 
            ? { ...serviceToSave, id: editingService.id }
            : service
        )
      );
    } else {
      // Add new service
      const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
      setServices(prev => [...prev, { ...serviceToSave, id: newId }]);
    }

    setShowServiceForm(false);
    setEditingService(null);
    
    // Reset form
    setServiceForm({
      id: 0,
      type: 'package',
      title: '',
      price: '',
      duration: '',
      description: '',
      includes: [''],
      active: true
    });
  };

  const handleServiceFormChange = (field: string, value: string | boolean) => {
    setServiceForm(prev => ({ ...prev, [field]: value }));
  };

  const handleIncludesChange = (index: number, value: string) => {
    const newIncludes = [...serviceForm.includes];
    newIncludes[index] = value;
    setServiceForm(prev => ({ ...prev, includes: newIncludes }));
  };

  const addIncludeItem = () => {
    setServiceForm(prev => ({ ...prev, includes: [...prev.includes, ''] }));
  };

  const removeIncludeItem = (index: number) => {
    if (serviceForm.includes.length > 1) {
      const newIncludes = serviceForm.includes.filter((_, i) => i !== index);
      setServiceForm(prev => ({ ...prev, includes: newIncludes }));
    }
  };

  const renderContentTab = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">Hero Section</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Edit className="h-4 w-4" />
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
            {isEditing && (
              <button
                onClick={handleSaveHeroContent}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Hero</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Main Title</label>
            {isEditing ? (
              <input
                type="text"
                value={heroContent.mainTitle}
                onChange={(e) => setHeroContent({
                  ...heroContent,
                  mainTitle: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter main title"
              />
            ) : (
              <p className="text-black">{heroContent.mainTitle}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-2">Subtitle</label>
            {isEditing ? (
              <textarea
                value={heroContent.subtitle}
                onChange={(e) => setHeroContent({
                  ...heroContent,
                  subtitle: e.target.value
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter subtitle"
              />
            ) : (
              <p className="text-black">{heroContent.subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Carousel Management */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-black mb-4">Carousel Management</h3>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-800">Carousel Status</span>
            </div>
            <p className="text-sm text-blue-700">
              {getCarouselImages().length > 0 
                ? `You have ${getCarouselImages().length} custom carousel images. Upload more or remove all to use defaults.`
                : 'Currently using 4 beautiful default diving images. Upload your own images and mark them for carousel use to replace the defaults.'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {getCarouselImages().length > 0 ? getCarouselImages().length : '4 (default)'}
              </div>
              <div className="text-sm text-gray-600">Carousel Images</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">{uploadedImages.length}</div>
              <div className="text-sm text-gray-600">Custom Images</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <div className="text-sm text-gray-600">Always Ready</div>
            </div>
          </div>
          
          {getCarouselImages().length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Using Default Images</span>
              </div>
              <p className="text-sm text-green-700">
                The carousel is displaying 4 default diving images. Your website is ready! Upload custom images in the Media tab and mark them for carousel use to personalize your carousel.
              </p>
            </div>
          )}
          
          {getCarouselImages().length > 0 && getCarouselImages().length < 4 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-800">Partial Custom Setup</span>
              </div>
              <p className="text-sm text-yellow-700">
                You have {getCarouselImages().length} custom image(s). Add {4 - getCarouselImages().length} more for a complete custom carousel, or remove all carousel selections to return to default images.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderServicesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-black">Manage Services</h3>
          <div className="text-sm text-gray-600">
            Total: {services.length} | Active: {services.filter(s => s.active).length} | Inactive: {services.filter(s => !s.active).length}
          </div>
        </div>
        <button
          onClick={handleAddService}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <Users className="h-12 w-12 mx-auto" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No services yet</h4>
            <p className="text-gray-600 mb-4">Get started by adding your first diving service or course.</p>
            <button
              onClick={handleAddService}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your First Service</span>
            </button>
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className={`bg-white rounded-lg p-6 shadow-sm border ${!service.active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h4 className="text-lg font-medium text-black">{service.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.type === 'package' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {service.type.charAt(0).toUpperCase() + service.type.slice(1)}
                    </span>
                    <button
                      onClick={() => handleToggleServiceStatus(service.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        service.active 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                      title={service.active ? 'Click to deactivate' : 'Click to activate'}
                    >
                      {service.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  
                  <p className="text-gray-700 mb-3 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                    <span className="font-medium">Price: <span className="text-black">{service.price}</span></span>
                    <span className="font-medium">Duration: <span className="text-black">{service.duration}</span></span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Includes:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {service.includes.slice(0, 3).map((item, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {item}
                        </span>
                      ))}
                      {service.includes.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{service.includes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEditService(service)}
                    className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit service"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete service"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Service Form Modal */}
      {showServiceForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-black">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setShowServiceForm(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Service Type *</label>
                <select
                  value={serviceForm.type}
                  onChange={(e) => handleServiceFormChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="package">Package</option>
                  <option value="course">Course</option>
                </select>
              </div>

              {/* Service Title */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Service Title *</label>
                <input
                  type="text"
                  value={serviceForm.title}
                  onChange={(e) => handleServiceFormChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="e.g., Beginner Package, Open Water Course"
                />
              </div>
              
              {/* Price and Duration Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Price *</label>
                  <input
                    type="text"
                    value={serviceForm.price}
                    onChange={(e) => handleServiceFormChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="e.g., $150, $250"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Duration *</label>
                  <input
                    type="text"
                    value={serviceForm.duration}
                    onChange={(e) => handleServiceFormChange('duration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="e.g., Half Day, 3-4 Days"
                  />
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Description *</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => handleServiceFormChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Enter a detailed description of the service"
                />
              </div>
              
              {/* Includes Section */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">What&#39;s Included *</label>
                <div className="space-y-2">
                  {serviceForm.includes.map((includeItem, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={includeItem}
                        onChange={(e) => handleIncludesChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="e.g., Basic equipment, Instructor guidance"
                      />
                      <button
                        onClick={() => removeIncludeItem(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                        disabled={serviceForm.includes.length <= 1}
                        title="Remove item"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={addIncludeItem}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Include Item</span>
                </button>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="service-active"
                  checked={serviceForm.active}
                  onChange={(e) => handleServiceFormChange('active', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="service-active" className="text-sm font-medium text-black">
                  Service is active (visible on website)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowServiceForm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveService}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>{editingService ? 'Update' : 'Create'} Service</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMediaTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black">Media Library</h3>
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Images</span>
          </label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-blue-900 mb-2">How to Update Carousel:</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Upload your images using the &quot;Upload Images&quot; button above</li>
          <li>2. Click &quot;Add to Carousel&quot; on the images you want in the homepage carousel</li>
          <li>3. Review your selection in the &quot;Carousel Images&quot; section below</li>
          <li>4. Click &quot;Update Carousel&quot; to apply changes to your website</li>
          <li>5. Use &quot;Preview Site&quot; to see your changes live!</li>
        </ol>
      </div>

      {/* All Uploaded Images */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h4 className="font-medium text-black mb-4">All Images ({uploadedImages.length})</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {uploadedImages.map((image) => (
            <div key={`image-${image.id}-${image.name}`} className="relative group">
              <div className="bg-gray-200 rounded-lg h-24 flex items-center justify-center overflow-hidden">
                {image.url.startsWith('data:') || image.url.startsWith('http') ? (
                  <Image 
                    src={image.url} 
                    alt={image.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                
                {/* Image overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button
                    onClick={() => toggleCarouselImage(image.id)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      image.isInCarousel
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {image.isInCarousel ? 'Remove' : 'Add to Carousel'}
                  </button>
                  <button
                    onClick={() => removeImage(image.id)}
                    className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-black mt-1 truncate">{image.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Images Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-black">
            Carousel Images ({getCarouselImages().length > 0 ? `${getCarouselImages().length} custom` : '4 default'})
          </h4>
          {getCarouselImages().length > 0 && (
            <button
              onClick={handleUpdateCarousel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Update Carousel</span>
            </button>
          )}
        </div>
        
        {getCarouselImages().length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              ✅ Currently using 4 beautiful default images. Select uploaded images above and click &quot;Add to Carousel&quot; to replace them with your custom images.
            </p>
          </div>
        ) : getCarouselImages().length < 4 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              ⚠️ You have {getCarouselImages().length} custom image(s) selected. Add {4 - getCarouselImages().length} more for a complete custom carousel, or remove all selections to return to default images.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getCarouselImages().map((image, index) => (
              <div key={`carousel-${image.id}-${index}`} className="relative">
                <div className="bg-gray-200 rounded-lg h-24 flex items-center justify-center overflow-hidden">
                  {image.url.startsWith('data:') || image.url.startsWith('http') ? (
                    <Image 
                      src={image.url} 
                      alt={image.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-black mt-1 truncate">{image.name}</p>
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {carouselUpdateStatus === 'success' && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm">✅ Carousel updated successfully! Use &quot;Preview Site&quot; to see changes.</p>
          </div>
        )}
        
        {carouselUpdateStatus === 'error' && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">❌ Failed to update carousel. Please try again.</p>
          </div>
        )}
      </div>

      {/* Storage Management */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h4 className="font-medium text-black mb-4">Storage Management</h4>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h5 className="font-medium text-yellow-900 mb-2">⚠️ Storage Information</h5>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Images are stored in the <code>/public/images/media/</code> folder on your server</li>
            <li>• Total uploaded images: {uploadedImages.length}</li>
            <li>• Carousel images: {getCarouselImages().length > 0 ? `${getCarouselImages().length} custom` : '4 default'}</li>
            <li>• Clearing storage will delete all uploaded files from the server (default images remain)</li>
          </ul>
        </div>
        
        <button
          onClick={clearAllStorage}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear All Storage</span>
        </button>
      </div>
    </div>
  );

  const renderMessagesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Contact Messages</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {getUnreadMessagesCount()} unread messages
          </span>
          <button
            onClick={() => setMessages([])}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Clear All
          </button>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center border">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-lg p-6 border cursor-pointer transition-colors ${
                !message.read ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              } ${selectedMessage === message.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => {
                setSelectedMessage(selectedMessage === message.id ? null : message.id);
                if (!message.read) {
                  markMessageAsRead(message.id);
                }
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{message.name}</h4>
                    {!message.read && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{message.email}</p>
                  {message.phone && (
                    <p className="text-sm text-gray-600">{message.phone}</p>
                  )}
                  {message.service && (
                    <p className="text-sm text-blue-600 font-medium">
                      Service: {message.service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{formatMessageDate(message.timestamp)}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(message.id);
                    }}
                    className="mt-2 text-red-600 hover:text-red-700 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {selectedMessage === message.id && (
                <div className="border-t pt-3 mt-3">
                  <h5 className="font-medium text-gray-900 mb-2">Message:</h5>
                  <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                  <div className="mt-4 flex space-x-2">
                    <a
                      href={`mailto:${message.email}?subject=Re: Your diving inquiry&body=Hi ${message.name},%0D%0A%0D%0AThank you for your message...`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm cursor-pointer"
                    >
                      Reply via Email
                    </a>
                    {message.phone && (
                      <a
                        href={`tel:${message.phone}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Call
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => {
    const handleSaveSettings = () => {
      localStorage.setItem('siteContent', JSON.stringify(siteContent));
      
      // Also save contact info in the format expected by Contact component
      const contactInfo = {
        phone: siteContent.contact.phone,
        email: siteContent.contact.email,
        address: siteContent.contact.address,
        hours: siteContent.contact.hours
      };
      localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
      
      // Dispatch events to notify components of changes
      window.dispatchEvent(new Event('siteContentUpdated'));
      window.dispatchEvent(new Event('contactInfoUpdated'));
      
      setIsEditingSettings(false);
      alert('Settings saved successfully! Contact information has been updated.');
    };

    const handleCancelEdit = () => {
      setIsEditingSettings(false);
    };

    return (
      <div className="space-y-6">
        {/* Contact Information Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            <div className="flex space-x-2">
              {!isEditingSettings ? (
                <button
                  onClick={() => setIsEditingSettings(true)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 px-3 py-1 border rounded"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              {isEditingSettings ? (
                <input
                  type="tel"
                  value={siteContent.contact.phone}
                  onChange={(e) => setSiteContent({
                    ...siteContent,
                    contact: { ...siteContent.contact, phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Primary phone number"
                />
              ) : (
                <p className="text-gray-900">{siteContent.contact.phone}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              {isEditingSettings ? (
                <input
                  type="email"
                  value={siteContent.contact.email}
                  onChange={(e) => setSiteContent({
                    ...siteContent,
                    contact: { ...siteContent.contact, email: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Primary email"
                />
              ) : (
                <p className="text-gray-900">{siteContent.contact.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              {isEditingSettings ? (
                <textarea
                  value={siteContent.contact.address}
                  onChange={(e) => setSiteContent({
                    ...siteContent,
                    contact: { ...siteContent.contact, address: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Business address"
                />
              ) : (
                <p className="text-gray-900">{siteContent.contact.address}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
              {isEditingSettings ? (
                <textarea
                  value={siteContent.contact.hours}
                  onChange={(e) => setSiteContent({
                    ...siteContent,
                    contact: { ...siteContent.contact, hours: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Operating hours"
                />
              ) : (
                <p className="text-gray-900">{siteContent.contact.hours}</p>
              )}
            </div>
          </div>
        </div>

        {/* Admin Management */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Management</h3>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-lg font-medium text-red-800 mb-2">Danger Zone</h4>
              <p className="text-sm text-red-600 mb-4">
                These actions will permanently delete data and cannot be undone.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (confirm('This will clear all uploaded images and carousel data. Are you sure?')) {
                      clearAllStorage();
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All Storage</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return renderContentTab();
      case 'services':
        return renderServicesTab();
      case 'media':
        return renderMediaTab();
      case 'messages':
        return renderMessagesTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderContentTab();
    }
  };

  // Carousel update function
  const handleUpdateCarousel = () => {
    const carouselImages = getCarouselImages().map(img => ({
      src: img.url,
      alt: img.name,
      title: img.name.replace(/\.[^/.]+$/, "") // Remove file extension for title
    }));
    
    localStorage.setItem('carouselImages', JSON.stringify(carouselImages));
    setCarouselUpdateStatus('success');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setCarouselUpdateStatus('idle');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-100 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-black">Admin Panel</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={onPreview}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Preview Site</span>
            </button>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
