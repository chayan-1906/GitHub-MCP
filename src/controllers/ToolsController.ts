import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {transport} from "../server";
import {printInConsole} from "mcp-utils/utils";

import {registerTool as myDetails} from '../tools/profile/my-details';

import {registerTool as listRepositories} from '../tools/github/repository/list-repositories';
import {registerTool as getRepositoryDetails} from '../tools/github/repository/get-repository-details';
import {registerTool as createRepository} from '../tools/github/repository/create-repository';
import {registerTool as updateRepository} from '../tools/github/repository/update-repository';
import {registerTool as renameRepository} from '../tools/github/repository/rename-repository';
import {registerTool as deleteRepository} from '../tools/github/repository/delete-repository';
import {registerTool as modifyRepositoryVisibility} from '../tools/github/repository/modify-repository-visibility';
import {registerTool as getAllCollaborators} from '../tools/github/repository/get-all-collaborators';
import {registerTool as addRemoveCollaborators} from '../tools/github/repository/add-remove-collaborators';
import {registerTool as listFilesInRepository} from '../tools/github/repository/list-files-in-repository';

import {registerTool as listBranches} from '../tools/github/branch/list-branches';
import {registerTool as getBranchDetails} from '../tools/github/branch/get-branch-details';
import {registerTool as createBranch} from '../tools/github/branch/create-branch';
import {registerTool as setDefaultBranch} from '../tools/github/branch/set-default-branch';
import {registerTool as deleteBranch} from '../tools/github/branch/delete-branch';

import {registerTool as listCommits} from '../tools/github/commit/list-commits';
import {registerTool as getCommitModifications} from '../tools/github/commit/get-commit-modifications';

import {registerTool as getFileContent} from '../tools/github/get-file-content';
import {registerTool as commitRemoteFile} from '../tools/github/commit-remote-file';

import {registerTool as runShellCommand} from '../tools/github/run-shell-command';

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
    listFilesInRepository(server);

    listBranches(server);
    getBranchDetails(server);
    createBranch(server);
    setDefaultBranch(server);
    deleteBranch(server);

    listCommits(server);
    getCommitModifications(server);

    getFileContent(server);
    commitRemoteFile(server);

    runShellCommand(server);

    await printInConsole(transport, `All tools loaded in ${Date.now() - start}ms`);
}

export {setupMcpTools}
