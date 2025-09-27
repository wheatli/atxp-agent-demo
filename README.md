# Agent Demo

This project serves as a starter template for building a website agent using [ATXP](https://docs.atxp.ai). It uses a TypeScript Express backend and TypeScript React frontend.

Follow [the Express + React agent tutorial](https://docs.atxp.ai/client/guides/tutorial) to build your first ATXP-powered agent.

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Create a repo using [the template](https://github.com/new?template_name=atxp-agent-starter&template_owner=atxp-dev).

2. Clone your newly created repo:
   ```bash
   git clone git@github.com:your-github-user/your-new-repo
   cd your-new-repo
   ```

2. Install all dependencies:
   ```bash
   npm run install-all
   ```

3. Create an `backend/.env` and set the `ATXP_CONNECTION_STRING` env var with your connection string from [https://accounts.atxp.ai](https://accounts.atxp.ai). See [the docs](https://docs.atxp.ai/client/create_an_account) for more information on creating an ATXP account.
    ```bash
   cp backend/env.example backend/.env
    ```

### Usage

1. Start both frontend and backend in development mode:
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:3001`
   - Frontend development server on `http://localhost:3000`

2. Open your browser and navigate to `http://localhost:3000`

### Running Separately

- **Backend only**: `npm run server`
- **Frontend only**: `npm run client`

### Production Build

1. Build both frontend and backend for production:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Project Structure

```
agent-demo/
├── backend/                # Express server
│   ├── server.ts           # Main server file (TypeScript)
│   ├── stage.ts            # Progress tracking utilities (TypeScript)
│   ├── tsconfig.json       # TypeScript configuration
│   ├── package.json        # Backend dependencies
│   └── env.example         # Environment variables template
├── frontend/               # React application
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── App.tsx         # Main React component (TypeScript)
│   │   ├── App.css         # Component styles
│   │   ├── index.tsx       # React entry point (TypeScript)
│   │   └── index.css       # Global styles
│   ├── tsconfig.json       # TypeScript configuration
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json with scripts
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Features

- **Express Backend**: RESTful API with endpoints for text submission and retrieval
- **React Frontend**: Modern, responsive UI with real-time updates
- **Development Mode**: Hot reloading for both frontend and backend
- **Production Ready**: Build system for deployment
- **CORS Enabled**: Cross-origin requests supported
- **Error Handling**: Comprehensive error handling and user feedback

## Development Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server (TypeScript with hot reload)
- `npm run client` - Start only the frontend development server
- `npm run build` - Build both frontend and backend for production
- `npm run build:backend` - Build only the backend TypeScript code
- `npm run build:frontend` - Build only the frontend for production
- `npm run install-all` - Install dependencies for all packages and build backend
- `npm start` - Start the production server

## API Endpoints

- `GET /api/texts` - Retrieve all submitted texts
- `POST /api/texts` - Submit new text
- `GET /api/health` - Health check endpoint

## Technologies Used

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript development
- **CORS** - Cross-origin resource sharing
- **Body Parser** - Request body parsing
- **Nodemon** - Development server with auto-reload
- **ts-node** - TypeScript execution for development

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript development
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with responsive design

## License

MIT