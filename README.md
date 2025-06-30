# Kulhudhufushidive - Diving Website

A Next.js diving website for Kulhudhufushidive, featuring modern design, image carousel, services management, and admin panel.

## Features

- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Image Carousel**: Hero section with auto-playing image carousel using Embla Carousel
- **Single Page Application**: Smooth scrolling navigation between sections
- **Services Management**: Display diving packages and courses with detailed information
- **Admin Panel**: Content management system for website updates
- **Contact Form**: Interactive contact form with service selection
- **Professional UI**: Modern design with animations and hover effects

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Carousel**: Embla Carousel React
- **Fonts**: Geist Sans & Mono

## Project Structure

```
src/
├── app/
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Main page component
└── components/
    ├── Navigation.tsx      # Navigation header
    ├── Hero.tsx           # Hero section with carousel
    ├── Services.tsx       # Services and packages
    ├── About.tsx          # About section
    ├── Contact.tsx        # Contact form
    ├── Footer.tsx         # Footer with admin access
    ├── AdminLogin.tsx     # Admin authentication
    └── AdminPanel.tsx     # Content management panel
```

## Sections

### Home (Hero)
- Image carousel with diving scenes
- Call-to-action buttons
- Navigation to other sections

### Services
- **Packages**: Beginner, Advanced, and Professional diving packages
- **Courses**: Open Water, Advanced Open Water, Rescue Diver, and Divemaster courses
- Detailed pricing and duration information

### About
- Company story and mission
- Features and achievements
- Safety and certification information

### Contact
- Contact form with service selection
- Contact information and location details
- Emergency contact information

### Admin Panel
- Content management for website information
- Service and package management
- Media library for images
- Site settings and configuration

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Admin Access

To access the admin panel:
1. Click the settings icon in the footer
2. Use the demo credentials:
   - Username: `admin`
   - Password: `admin123`

## Customization

### Adding New Services
1. Access the admin panel
2. Navigate to the "Services" tab
3. Click "Add Service" to create new packages or courses

### Updating Content
1. Access the admin panel
2. Navigate to the "Site Content" tab
3. Edit hero content, contact information, and other site details

### Managing Images
1. Access the admin panel
2. Navigate to the "Media" tab
3. Upload new images for the carousel and services

## Deployment

The website is ready for deployment on platforms like Vercel, Netlify, or any hosting service that supports Next.js.

For Vercel deployment:
```bash
npm run build
```

## Contact Information

- **Website**: Kulhudhufushidive
- **Location**: Kulhudhuffushi Island, Haa Dhaalu Atoll, Maldives
- **Phone**: +960 123-4567
- **Email**: info@kulhudhufushidive.com

## License

This project is created for Kulhudhufushidive diving center.
