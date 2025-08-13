# Chess Club Website

A comprehensive, modern website for a chess club with both user-facing features and an admin console. Built with HTML, CSS, and JavaScript.

## Features

### User-Facing Features

#### 1. Homepage
- Hero section with call-to-action buttons
- Features overview highlighting club benefits
- Upcoming events preview
- Latest blog posts preview
- Responsive design for all devices

#### 2. Tournaments Page
- **Upcoming Tournaments Section:**
  - List of all upcoming events with tournament details
  - Tournament name, date & time, format, location
  - Registration deadline and short description
  - Prominent "Register" button for each tournament
  - Registration form with payment integration

- **Past Tournaments Archive:**
  - Table view of completed tournaments
  - Winner information and results
  - Download PGN files for games played
  - Tournament results and standings

- **Filtering and Search:**
  - Filter by tournament status (upcoming, past, completed)
  - Filter by format (Blitz, Rapid, Classical)
  - Search functionality

#### 3. Blog/News Page
- **Blog List Page:**
  - Filter buttons by categories (Tournament Recaps, Club News, Member Spotlights, Strategy)
  - Search bar for finding posts by keyword
  - Blog post previews with thumbnails, titles, excerpts, and publish dates
  - "Read More" buttons for full posts

- **Individual Blog Post Page:**
  - Full blog content with rich formatting
  - Author and publish date information
  - Tags and categories
  - Navigation back to blog list

#### 4. Contact Page
- **Contact Form:**
  - Name, email, subject, and message fields
  - Form validation and spam protection
  - Newsletter subscription option

- **Club Information:**
  - Embedded map showing club location
  - Direct contact information (email, phone, address)
  - Social media links
  - Club hours and operating times

#### 5. Member Dashboard (Logged-in Members)
- **Profile Card:**
  - Member profile picture and information
  - Membership status and rating
  - Edit profile functionality

- **Tournament History:**
  - Table of participated tournaments
  - Personal results and standings
  - Rating changes and achievements

- **Membership Management:**
  - Current membership expiration date
  - Renewal options and payment processing
  - Membership statistics

### Admin Console Features

#### 1. Dashboard Overview
- Quick statistics (total members, active tournaments, blog posts, upcoming events)
- Recent activity feed
- Quick action buttons for common tasks

#### 2. User Management
- **User List View:**
  - Complete member database with search and filters
  - Member ID, name, email, role, status, join date
  - Role management (Member, Admin, Tournament Director)

- **Add/Edit User Forms:**
  - Create new member accounts
  - Update member information
  - Manage membership status
  - Send welcome emails

#### 3. Tournament Management
- **Tournament List:**
  - All tournaments with status, participants, and actions
  - Search and filter by status/date

- **Create/Edit Tournaments:**
  - Comprehensive tournament creation form
  - Name, description, date & time, format, location
  - Registration URL, deadline, max participants, entry fee
  - Upload tournament images and banners

- **Tournament Results:**
  - Upload results and PGN files
  - View registration statistics
  - Archive completed tournaments

#### 4. Blog Management
- **Blog Posts List:**
  - All blog posts with title, author, category, publish date, status
  - Search and filter by status/date

- **Create/Edit Posts:**
  - Rich text editor for content creation
  - Featured image upload
  - Category and tag selection
  - Publish date scheduling
  - Preview functionality

#### 5. Membership Management
- **Member List:**
  - Complete membership database
  - Filter by status and membership type
  - View upcoming renewals and expired memberships

- **Membership Operations:**
  - Manual renewal processing
  - Payment tracking
  - Export membership data
  - Membership statistics

#### 6. Announcements/Newsletter Tool
- **Create Announcements:**
  - Compose announcements with rich text
  - Audience selection (All Members, Active Members, Admins)
  - Schedule send date/time or send immediately

- **Sent Announcements:**
  - View past announcements with send status
  - Resend or delete functionality

#### 7. Site Settings
- **General Settings:**
  - Configure site name, contact info, social links
  - Manage payment gateway credentials
  - User roles and permissions

- **Security:**
  - Two-factor authentication options
  - Activity logs and audit trails

## Technical Features

### Frontend
- **Responsive Design:** Mobile-first approach with CSS Grid and Flexbox
- **Modern UI:** Clean, professional design with smooth animations
- **Interactive Elements:** Modals, forms, filtering, and search functionality
- **Cross-browser Compatibility:** Works on all modern browsers

### JavaScript Functionality
- **Dynamic Content Loading:** All data is loaded dynamically from JavaScript
- **Form Validation:** Client-side validation with user-friendly error messages
- **Modal System:** Reusable modal components for forms and content
- **Search and Filtering:** Real-time search and filtering across all sections
- **Data Management:** Simulated database operations with local storage

### CSS Features
- **Custom Properties:** CSS variables for consistent theming
- **Flexbox/Grid:** Modern layout techniques
- **Animations:** Smooth transitions and hover effects
- **Media Queries:** Responsive breakpoints for all screen sizes

## File Structure

```
chess_club_website/
├── index.html              # Homepage
├── tournaments.html         # Tournaments page
├── blog.html               # Blog page
├── contact.html            # Contact page
├── dashboard.html          # Member dashboard
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── main.js             # Main JavaScript functionality
│   ├── data.js             # Sample data and data management
│   ├── tournaments.js      # Tournament-specific functionality
│   ├── blog.js             # Blog-specific functionality
│   ├── contact.js          # Contact form functionality
│   └── dashboard.js        # Dashboard functionality
├── admin/
│   ├── index.html          # Admin console
│   └── admin.js            # Admin functionality
├── images/                 # Image assets
└── README.md              # This file
```

## Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Navigate through the different pages to explore the functionality

### Development Setup
1. Set up a local web server (recommended for development):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

2. Open `http://localhost:8000` in your browser

## Usage Guide

### For Club Members
1. **Browse Tournaments:** Visit the tournaments page to see upcoming events
2. **Register for Events:** Click "Register" on any tournament to sign up
3. **Read Blog Posts:** Explore the blog for news, strategy tips, and member spotlights
4. **Contact the Club:** Use the contact form for questions or feedback
5. **Access Dashboard:** Log in to view your profile, tournament history, and membership status

### For Administrators
1. **Access Admin Console:** Navigate to `/admin/` to access the admin panel
2. **Manage Users:** Add, edit, or remove member accounts
3. **Create Tournaments:** Set up new tournaments with all necessary details
4. **Write Blog Posts:** Create and publish content for the club blog
5. **Send Announcements:** Communicate with members through the announcement system
6. **Monitor Statistics:** View club statistics and member activity

## Customization

### Styling
- Modify `css/style.css` to change colors, fonts, and layout
- Update CSS variables for consistent theming
- Add custom animations and effects

### Content
- Edit `js/data.js` to update sample data
- Modify HTML files to change static content
- Update contact information and club details

### Functionality
- Extend JavaScript files to add new features
- Integrate with real backend services
- Add authentication and user management

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Future Enhancements

### Planned Features
- **User Authentication:** Real login/logout system
- **Database Integration:** Connect to a real database
- **Payment Processing:** Integrate with payment gateways
- **Email Notifications:** Automated email system
- **Mobile App:** Native mobile application
- **Live Chess:** Online chess games integration
- **Rating System:** ELO rating calculations
- **Tournament Brackets:** Automated tournament pairing

### Technical Improvements
- **Backend API:** RESTful API for data management
- **Real-time Updates:** WebSocket integration for live updates
- **Image Upload:** File upload functionality
- **Search Optimization:** Advanced search with filters
- **Performance:** Code optimization and caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Note:** This is a demonstration website with simulated data. In a production environment, you would need to:
- Implement real user authentication
- Connect to a database
- Set up proper security measures
- Configure email services
- Integrate payment processing
- Set up hosting and domain 