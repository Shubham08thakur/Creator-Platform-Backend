# Creator Platform

A modern platform for content creators to share their work, build an audience, and earn credits through engagement.

<div align="center">
  <img src="frontend/public/logo192.svg" alt="Creator Platform Logo" width="120" height="120">
</div>

## Features

### For Users
- **User Authentication**: Secure sign up, login, and profile management
- **Content Discovery**: Browse content from various creators in different formats (articles, videos, images, audio)
- **Engagement**: Like, comment on, and share creator content
- **Content Reporting**: Report inappropriate content for moderation
- **Credit System**: Earn credits through platform engagement and content creation

### For Creators
- **Content Publishing**: Upload and publish content in multiple formats
- **Audience Building**: Grow your audience through engaging content
- **Analytics**: Track content performance and audience engagement
- **Monetization**: Earn credits based on content engagement metrics

### For Admins
- **User Management**: Manage user accounts and roles
- **Content Moderation**: Review and moderate reported content
- **Analytics Dashboard**: Monitor platform performance and engagement metrics
- **Credit Management**: Oversee the platform's credit economy

## Tech Stack

- **Frontend**: React, Material-UI, Context API
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Backend deployed on Render, frontend ready for deployment

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas account)

### Installation & Local Development

#### Option 1: Using the Deployed Backend

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/creator-platform.git
   cd creator-platform
   ```

2. **Frontend Setup**
   ```
   cd frontend
   npm install
   ```

3. **Start the frontend development server**
   ```
   npm start
   ```

4. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`
   
   The frontend will connect to our deployed backend at:
   ```
   https://creator-platform-backend-679j.onrender.com/api
   ```

5. **Setup Admin User (if needed)**
   
   Visit `https://creator-platform-backend-679j.onrender.com/api/auth/setup-admin` in your browser to create an admin user with:
   - Email: admin@example.com
   - Password: admin123

#### Option 2: Local Development (Full Stack)

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/creator-platform.git
   cd creator-platform
   ```

2. **Backend Setup**
   ```
   cd backend
   npm install
   ```

3. **Create a .env file in the backend directory with the following variables**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/creator-platform
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```

4. **Start the backend server**
   ```
   npm run dev
   ```

5. **Frontend Setup (in a new terminal)**
   ```
   cd frontend
   npm install
   ```

6. **Update the API URL in `frontend/src/services/config.js` to use localhost**
   ```javascript
   // API URL configuration
   export const API_URL = 'http://localhost:5000/api';
   ```

7. **Start the frontend development server**
   ```
   npm start
   ```

8. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

## Deployment

### Backend Deployment

The backend is already deployed at:
```
https://creator-platform-backend-679j.onrender.com/api
```

If you need to deploy your own instance:

1. **Prepare your backend for production**
   ```
   cd backend
   npm run build
   ```

2. **Deploy to your preferred hosting service**
   
   Options include Render, Heroku, AWS, Digital Ocean, or any Node.js-supporting platform.
   
   Make sure to set the following environment variables:
   - `PORT`
   - `MONGODB_URI` (pointing to your production database)
   - `JWT_SECRET` (use a strong, unique value)
   - `JWT_EXPIRE`
   - `NODE_ENV=production`

### Frontend Deployment

1. **Build the frontend for production**
   ```
   cd frontend
   npm run build
   ```

2. **Deploy the contents of the `build` folder**
   
   Options include Netlify, Vercel, Firebase Hosting, or any static site hosting service.
   
   The frontend is already configured to connect to the deployed backend.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Material-UI for the component library
- MongoDB for the database infrastructure
- The Node.js and React communities for their excellent documentation and resources