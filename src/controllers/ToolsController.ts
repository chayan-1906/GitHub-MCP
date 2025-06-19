import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {transport} from "../server";
import {printInConsole} from "../utils/printInConsole";

import {registerTool as myDetails} from '../tools/profile/my-details';

import {registerTool as listRepositories} from '../tools/github/list-repositories';
import {registerTool as getDefaultBranch} from '../tools/github/get-default-branch';
import {registerTool as listFilesInRepository} from '../tools/github/list-files-in-repository';

async function setupMcpTools(server: McpServer) {
    const start = Date.now();

    myDetails(server);

    listRepositories(server);
    getDefaultBranch(server);
    listFilesInRepository(server);

    await printInConsole(transport, `All tools loaded in ${Date.now() - start}ms`);
}

export {setupMcpTools}
