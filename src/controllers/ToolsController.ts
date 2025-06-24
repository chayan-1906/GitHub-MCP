import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {transport} from "../server";
import {printInConsole} from "mcp-utils/utils";

import {registerTool as myDetails} from '../tools/profile/my-details';

import {registerTool as listRepositories} from '../tools/github/list-repositories';
import {registerTool as repositoryDetails} from '../tools/github/repository-details';
import {registerTool as listFilesInRepository} from '../tools/github/list-files-in-repository';
import {registerTool as getFileContent} from '../tools/github/get-file-content';
import {registerTool as createRepository} from '../tools/github/create-repository';
import {registerTool as deleteRepository} from '../tools/github/delete-repository';
import {registerTool as renameRepository} from '../tools/github/rename-repository';
import {registerTool as modifyRepositoryVisibility} from '../tools/github/modify-repository-visibility';
import {registerTool as getAllCollaborators} from '../tools/github/get-all-collaborators';
import {registerTool as addRemoveCollaborators} from '../tools/github/add-remove-collaborators';

async function setupMcpTools(server: McpServer) {
    const start = Date.now();

    myDetails(server);

    listRepositories(server);
    repositoryDetails(server);
    listFilesInRepository(server);
    getFileContent(server);
    createRepository(server);
    deleteRepository(server);
    renameRepository(server);
    modifyRepositoryVisibility(server);
    getAllCollaborators(server);
    addRemoveCollaborators(server);

    await printInConsole(transport, `All tools loaded in ${Date.now() - start}ms`);
}

export {setupMcpTools}
