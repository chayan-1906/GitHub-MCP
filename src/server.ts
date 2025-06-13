const startTime = Date.now();

import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import express from 'express';
import {setupMcpTools} from "./controllers/ToolsController";
import {PORT} from "./config/config";
import AuthRoutes from "./routes/AuthRoutes";
import {printInConsole} from "./utils/printInConsole";
import {freezePortOnQuit, killPortOnLaunch} from "./utils/killPortOnLaunch";
import {addOrUpdateMCPServer, setEntry} from "./config/updateClaudeConfig";

const app = express();
export const transport = new StdioServerTransport();

app.use(express.json());
app.use('/', AuthRoutes);

// Create an MCP server
const server = new McpServer({
    name: 'GitHub',
    version: '1.0.0',
});

freezePortOnQuit();

const serverName = 'github';

// Start receiving messages on stdin and sending messages on stdout
async function startMcp() {
    await setupMcpTools(server);
    await server.connect(transport);
}

killPortOnLaunch().then(async () => {
    app.listen(PORT, async () => {
        await printInConsole(transport, `OAuth server running on http://localhost:${PORT}, started in ${Date.now() - startTime}ms`);

        const {entry} = setEntry() as any;
        await addOrUpdateMCPServer(serverName, entry);
        await startMcp();
        await printInConsole(transport, `All tools loaded in ${Date.now() - startTime}ms`);
    });
});
