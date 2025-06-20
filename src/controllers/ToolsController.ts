import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {transport} from "../server";
import {printInConsole} from "../utils/printInConsole";

import {registerTool as myDetails} from '../tools/profile/my-details';

import {registerTool as listRepositories} from '../tools/github/list-repositories';
import {registerTool as repositoryDetails} from '../tools/github/repository-details';
import {registerTool as listFilesInRepository} from '../tools/github/list-files-in-repository';
import {registerTool as getFileContent} from '../tools/github/get-file-content';
import {registerTool as createRepository} from '../tools/github/create-repository';

async function setupMcpTools(server: McpServer) {
    const start = Date.now();

    myDetails(server);

    listRepositories(server);
    repositoryDetails(server);
    listFilesInRepository(server);
    getFileContent(server);
    createRepository(server);

    await printInConsole(transport, `All tools loaded in ${Date.now() - start}ms`);
}

export {setupMcpTools}
