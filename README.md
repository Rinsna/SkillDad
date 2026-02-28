# SkillDad Platform

An educational platform for universities and instructors to create, manage, and conduct live educational sessions, courses, and exams.

## Features

- **Live Sessions**: Conduct live educational sessions using Zoom's embedded meeting SDK
- **Course Management**: Create and manage courses with video content and materials
- **Exam System**: Create and administer exams with automated grading
- **Payment Integration**: Support for multiple payment gateways (Stripe, HDFC SmartGateway)
- **Student Enrollment**: Automatic enrollment and access control
- **Recording Management**: Automatic cloud recording retrieval and playback
- **Notifications**: Email and WhatsApp notifications for important events

## Technology Stack

### Backend
- Node.js with Express
- MongoDB for data storage
- Redis for caching and session management
- Zoom API for live sessions
- JWT for authentication

### Frontend
- React with Vite
- Tailwind CSS for styling
- Zoom Meeting SDK for embedded meetings

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Redis (v6 or higher)
- Zoom Account (for live sessions)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd skilldad
   ```

2. **Install dependencies**:
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   # Copy the example environment file
   cp server/.env.example server/.env

   # Edit server/.env and fill in your credentials
   # See server/docs/ENVIRONMENT_VARIABLES.md for detailed documentation
   ```

4. **Start MongoDB and Redis**:
   ```bash
   # Start MongoDB
   mongod

   # Start Redis
   redis-server
   ```

5. **Start the development servers**:
   ```bash
   # Terminal 1: Start backend server
   cd server
   npm start

   # Terminal 2: Start frontend dev server
   cd client
   npm run dev
   ```

6. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3030

## Environment Variables

The platform requires several environment variables to be configured. See the comprehensive documentation:

📖 **[Environment Variables Documentation](server/docs/ENVIRONMENT_VARIABLES.md)**

Key configuration areas:
- **Zoom Integration**: API and SDK credentials for live sessions
- **Database**: MongoDB and Redis connection strings
- **Authentication**: JWT secret for token signing
- **Email**: SMTP configuration for notifications
- **Payment Gateways**: Stripe and HDFC SmartGateway credentials
- **WhatsApp**: Gupshup API for WhatsApp notifications

### Quick Setup

```bash
# Copy the example file
cp server/.env.example server/.env

# Edit the file and replace placeholders with your actual credentials
# Required for basic functionality:
# - MONGO_URI
# - JWT_SECRET
# - ZOOM_API_KEY, ZOOM_API_SECRET, ZOOM_ACCOUNT_ID
# - ZOOM_SDK_KEY, ZOOM_SDK_SECRET
```

## Live Sessions with Zoom

The platform uses Zoom for live educational sessions. This replaces the previous Bunny.net RTMP/HLS streaming infrastructure.

### Zoom Setup

1. **Create Zoom Apps**:
   - Server-to-Server OAuth app (for API access)
   - Meeting SDK app (for client embedding)

2. **Configure credentials** in `server/.env`:
   ```bash
   ZOOM_API_KEY=your_api_key
   ZOOM_API_SECRET=your_api_secret
   ZOOM_ACCOUNT_ID=your_account_id
   ZOOM_SDK_KEY=your_sdk_key
   ZOOM_SDK_SECRET=your_sdk_secret
   ZOOM_WEBHOOK_SECRET=your_webhook_secret
   ZOOM_ENCRYPTION_KEY=your_32_char_encryption_key
   ```

3. **See detailed setup guide**: [Environment Variables Documentation](server/docs/ENVIRONMENT_VARIABLES.md#zoom-integration)

### Migration from Bunny.net

⚠️ **Note**: Bunny.net environment variables are **DEPRECATED** and will be removed in a future release. All new sessions use Zoom integration.

## Project Structure

```
skilldad/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
│   └── package.json
├── server/                # Node.js backend application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   ├── docs/             # Documentation
│   │   ├── ENVIRONMENT_VARIABLES.md
│   │   └── PAYMENT_API.md
│   ├── .env              # Environment variables (not in git)
│   ├── .env.example      # Environment variables template
│   └── server.js         # Server entry point
└── README.md             # This file
```

## API Documentation

- **Payment API**: [server/docs/PAYMENT_API.md](server/docs/PAYMENT_API.md)
- **Environment Variables**: [server/docs/ENVIRONMENT_VARIABLES.md](server/docs/ENVIRONMENT_VARIABLES.md)

## Development

### Running Tests

```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

### Code Style

The project uses ESLint for code linting. Run linting with:

```bash
# Lint server code
cd server
npm run lint

# Lint client code
cd client
npm run lint
```

## Deployment

### Production Build

```bash
# Build client for production
cd client
npm run build

# Start server in production mode
cd server
NODE_ENV=production npm start
```

### Environment Configuration

- Use separate `.env` files for different environments
- Store production secrets in secure vaults (e.g., AWS Secrets Manager)
- Never commit `.env` files to version control

## Security

- All API endpoints require authentication via JWT tokens
- Zoom meeting passcodes are encrypted in the database
- Webhook events are verified using signature validation
- Payment gateway webhooks use secret verification
- Rate limiting is implemented on sensitive endpoints

## Support

For issues, questions, or contributions, please contact the development team.

## License

[Add your license information here]

---

**Version**: 2.0 (Zoom Migration)
**Last Updated**: 2024
