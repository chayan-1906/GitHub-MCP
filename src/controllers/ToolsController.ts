import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {transport} from "../server";
import {printInConsole} from "mcp-utils/utils";

import {registerTool as myDetails} from '../tools/profile/my-details';

import {registerTool as listRepositories} from '../tools/github/list-repositories';
import {registerTool as getRepositoryDetails} from '../tools/github/get-repository-details';
import {registerTool as createRepository} from '../tools/github/create-repository';
import {registerTool as updateRepository} from '../tools/github/update-repository';
import {registerTool as renameRepository} from '../tools/github/rename-repository';
import {registerTool as deleteRepository} from '../tools/github/delete-repository';
import {registerTool as modifyRepositoryVisibility} from '../tools/github/modify-repository-visibility';
import {registerTool as getAllCollaborators} from '../tools/github/get-all-collaborators';
import {registerTool as addRemoveCollaborators} from '../tools/github/add-remove-collaborators';

import {registerTool as listBranches} from '../tools/github/list-branches';
import {registerTool as getBranchDetails} from '../tools/github/get-branch-details';
import {registerTool as createBranch} from '../tools/github/create-branch';
import {registerTool as setDefaultBranch} from '../tools/github/set-default-branch';

import {registerTool as listFilesInRepository} from '../tools/github/list-files-in-repository';
import {registerTool as getFileContent} from '../tools/github/get-file-content';

import {registerTool as commitRemoteFile} from '../tools/github/commit-remote-file';

async function setupMcpTools(server: McpServer) {
    const start = Date.now();

    myDetails(server);

    listRepositories(server);
    getRepositoryDetails(server);
    createRepository(server);
    updateRepository(server);
    renameRepository(server);
    deleteRepository(server);
    modifyRepositoryVisibility(server);
    getAllCollaborators(server);
    addRemoveCollaborators(server);

    listBranches(server);
    getBranchDetails(server);
    createBranch(server);

    setDefaultBranch(server);

    listFilesInRepository(server);
    getFileContent(server);

    commitRemoteFile(server);

    await printInConsole(transport, `All tools loaded in ${Date.now() - start}ms`);
}

export {setupMcpTools}
