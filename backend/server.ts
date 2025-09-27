import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import { sendSSEUpdate, addSSEClient, removeSSEClient, sendStageUpdate } from './stage';

// Import the ATXP client SDK
import { atxpClient, ATXPAccount } from '@atxp/client';
import { ConsoleLogger, LogLevel } from '@atxp/common';

// Load environment variables
dotenv.config();

// Create the Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Read the ATXP_CONNECTION_STRING from the environment variables
const ATXP_CONNECTION_STRING = process.env.ATXP_CONNECTION_STRING;
if (!ATXP_CONNECTION_STRING) {
  throw new Error('ATXP_CONNECTION_STRING is not set');
}

// Create an ATXPAccount object using the ATXP_CONNECTION_STRING
const account = new ATXPAccount(ATXP_CONNECTION_STRING, {network: 'base'});

// Set up CORS and body parsing middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define the Text interface that will be used to pass the results of the MCP calls to the frontend
// TODO: Update this interface to have the properties you need for your use case
interface Text {
  id: number;
  text: string;
  timestamp: string;
}

// In-memory storage for texts (in production, use a database)
let texts: Text[] = [];

// TODO: Create a helper config object for each ATXP MCP Server you want to use
// See "Step 1" at https://docs.atxp.ai/client/guides/tutorial#set-up-the-connections-to-the-mcp-servers for more details.
// For example, if you want to use the ATXP Image MCP Server, you can use the following config object:
// Helper config object for the ATXP Image MCP Server
// const imageService = {
//   mcpServer: 'https://image.mcp.atxp.ai',
//   toolName: 'image_create_image',
//   description: 'ATXP Image MCP server',
//   getArguments: (prompt: string) => ({ prompt }),
//   getResult: (result: any) => {
//     // Parse the JSON string from the result
//     const jsonString = result.content[0].text;
//     return JSON.parse(jsonString);
//   }
// };

// Express API Routes
app.get('/api/texts', (req: Request, res: Response) => {
  res.json({ texts });
});

app.post('/api/texts', async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Text is required' });
  }

  const requestId = Date.now().toString();

  // The calls to `sendStageUpdate` are not required and are just nice-to-haves
  // for showing progress during long-running calls to MCP servers.
  // TODO: Remove these calls if you don't want to show progress updates in the frontend.
  sendStageUpdate(requestId, 'initializing', 'Starting process...', 'in-progress');

  // Create the object that will be updated with the results of the MCP calls and passed to the frontend
  let newText: Text = {
    id: Date.now(),
    text: text.trim(),
    timestamp: new Date().toISOString(),
  };

  // Send stage update for client creation
  sendStageUpdate(requestId, 'creating-clients', 'Initializing ATXP clients...', 'in-progress');

  // TODO: Create a client using the `atxpClient` function for each ATXP MCP Server you want to use
  // See "Step 2" at https://docs.atxp.ai/client/guides/tutorial#set-up-the-connections-to-the-mcp-servers for more details.
  // For example, if you want to use the ATXP Image MCP Server, you can use the following code:
  // const imageClient = await atxpClient({
  //   mcpServer: imageService.mcpServer,
  //   account: account,
  // });

  // Send stage update for just before the MCP tool call
  sendStageUpdate(requestId, 'calling-mcp-tool', 'Calling ATXP MCP tool...', 'in-progress');

  try {
    // TODO: Call the MCP tool you want to use
    // For example, if you want to use the ATXP Image MCP Server, you can use the following code:
    // const result = await imageClient.callTool({
    //   name: imageService.toolName,
    //   arguments: imageService.getArguments(text),
    // });

    // Send stage update for MCP tool call completion
    sendStageUpdate(requestId, 'mcp-tool-call-completed', 'ATXP MCP tool call completed!', 'completed');

    // TODO: Process the result of the MCP tool call
    // For example, if you want to use the ATXP Image MCP Server, you can use the following code:
    // const imageResult = imageService.getResult(result);
    // console.log('Result:', imageResult);


    // Note: If you want to use the result of the MCP tool call in another MCP tool call, you will need
    // a nested try/catch block wrapping the call to the next MCP tool.

    // TODO: Save the result of the MCP tool call to the `newText` object
    // For example, if you want to use the result of the ATXP Image MCP Server, you can use the following code:
    //newText.imageUrl = imageResult.url;

    // Save the `newText` object to the `texts` array
    texts.push(newText);

    // Return the `newText` object to the frontend
    res.status(201).json(newText);
  } catch (error) {
    console.error(`Error with MCP tool call:`, error);

    // Send stage update for MCP tool call error
    sendStageUpdate(requestId, 'mcp-tool-call-error', 'Failed to call ATXP MCP tool!', 'error');

    // Return an error response if MCP tool call fails
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: 'Failed to call ATXP MCP tool', details: errorMessage });
  }
});

// Handle OPTIONS for SSE endpoint
app.options('/api/progress', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Cache-Control, Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  });
  res.end();
});

// SSE endpoint for progress updates
app.get('/api/progress', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Cache-Control, Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  });

  console.log('SSE connection established');
  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'SSE connection established' })}\n\n`);

  // Add client to the set
  addSSEClient(res);

  // Remove client when connection closes
  req.on('close', () => {
    removeSSEClient(res);
  });
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
