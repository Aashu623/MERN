# MERN Stack Development Setup

This guide will help you set up and run both the frontend and backend servers for the MERN stack application.

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- Git

## Quick Start

### Option 1: Using the Start Scripts (Recommended)

#### Windows (Batch Script)
```bash
# Double-click the file or run in Command Prompt
start-dev.bat
```

#### Windows (PowerShell Script)
```powershell
# Run in PowerShell
.\start-dev.ps1
```

#### Unix/Linux/macOS
```bash
# Make executable (first time only)
chmod +x start-dev.sh

# Run the script
./start-dev.sh
```

### Option 2: Using npm Scripts

```bash
# Install all dependencies (first time only)
npm run install:all

# Start both frontend and backend
npm run dev:full
```

### Option 3: Manual Setup

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd brahmi-frontend
npm install
cd ..

# Start backend (in one terminal)
npm run dev

# Start frontend (in another terminal)
cd brahmi-frontend
npm run dev
```

## Available Scripts

### Root Directory Scripts
- `npm run dev:full` - Start both frontend and backend concurrently
- `npm run backend` - Start only the backend server
- `npm run frontend` - Start only the frontend server
- `npm run install:all` - Install dependencies for both frontend and backend

### Frontend Scripts (in brahmi-frontend directory)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Server URLs

- **Backend API**: http://localhost:4000
- **Frontend**: http://localhost:5173

## Environment Variables

Make sure you have the following environment variables set up in your `.env` file in the root directory:

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_email_password
SMTP_FROM_EMAIL=your_email@gmail.com
SMTP_FROM_NAME=Your Name
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_API_KEY=your_stripe_api_key
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Backend: Change the PORT in your .env file
   - Frontend: Vite will automatically find an available port

2. **Dependencies not found**
   - Run `npm run install:all` to install all dependencies

3. **MongoDB connection issues**
   - Check your MONGODB_URI in the .env file
   - Ensure MongoDB is running

4. **Permission denied (Unix/Linux)**
   - Run `chmod +x start-dev.sh` to make the script executable

### Stopping the Servers

- Press `Ctrl+C` in the terminal where the servers are running
- This will stop both frontend and backend servers

## Development Workflow

1. Start the development servers using one of the methods above
2. Make changes to your code
3. Frontend changes will hot-reload automatically
4. Backend changes will restart the server automatically (thanks to nodemon)
5. Test your changes in the browser

## Project Structure

```
MERN/
├── backend/                 # Backend server (Node.js/Express)
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── server.js          # Server entry point
├── brahmi-frontend/        # Frontend (React/TypeScript)
│   ├── src/
│   │   ├── Components/    # React components
│   │   ├── Pages/         # Page components
│   │   ├── actions/       # Redux actions
│   │   ├── reducers/      # Redux reducers
│   │   └── store.tsx      # Redux store
│   └── package.json
├── start-dev.bat          # Windows batch script
├── start-dev.ps1          # PowerShell script
├── start-dev.sh           # Unix/Linux shell script
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

If you encounter any issues, please check the troubleshooting section above or create an issue in the repository.
