# Drug Indications API

A modern API built with NestJS for managing drug indications and mapping them to ICD-10 codes using AI.

## Features

- 🔒 JWT Authentication
- 🏥 Drug and Medical Indications Management
- 🤖 AI-Powered ICD-10 Code Mapping
- 🕷️ Web Scraping for Drug Information
- 📚 Swagger API Documentation
- 🗄️ MongoDB Database
- ✨ TypeScript Support

## Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) v11
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) v8
- **Authentication:** [Passport](https://www.passportjs.org/) & [JWT](https://jwt.io/)
- **AI Integration:** [OpenAI API](https://openai.com/blog/openai-api)
- **Web Scraping:** [Cheerio](https://cheerio.js.org/) & [Axios](https://axios-http.com/)
- **API Documentation:** [Swagger/OpenAPI](https://swagger.io/)
- **Validation:** [class-validator](https://github.com/typestack/class-validator) & [Zod](https://zod.dev/)
- **Testing:** [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest)

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- OpenAI API Key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/docs
```

## Project Structure

```
src/
├── auth/           # Authentication module
├── drugs/          # Drug management module
├── indications/    # Medical indications module
├── mapping/        # ICD-10 mapping module
├── scraper/        # Web scraping module
├── users/          # User management module
└── app.module.ts   # Main application module
```

## Features in Detail

### Authentication

- User registration and login
- JWT-based authentication
- Role-based access control (User/Admin)

### Drug Management

- CRUD operations for drugs
- Drug information storage
- Relationship with indications

### Medical Indications

- Automated indication extraction from drug information
- ICD-10 code mapping
- Indication management and tracking

### AI Integration

- OpenAI-powered medical condition mapping
- Automatic ICD-10 code assignment
- Intelligent text processing
