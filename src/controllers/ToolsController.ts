import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {transport} from "../server";
import {printInConsole} from "../utils/printInConsole";

import {registerTool as myDetails} from '../tools/profile/my-details';

async function setupMcpTools(server: McpServer) {
    const start = Date.now();

    myDetails(server);

    await printInConsole(transport, `All tools loaded in ${Date.now() - start}ms`);
}

export {setupMcpTools}
