import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { printInConsole } from "mcp-utils/utils";
import { transport } from "../server";

import { registerTool as myGitHubAccount } from '../tools/profile/my-github-account';

import { registerTool as listRepositories } from '../tools/github/repository/list-repositories';
import { registerTool as getRepositoryDetails } from '../tools/github/repository/get-repository-details';
import { registerTool as createRepository } from '../tools/github/repository/create-repository';
import { registerTool as updateRepository } from '../tools/github/repository/update-repository';
import { registerTool as renameRepository } from '../tools/github/repository/rename-repository';
import { registerTool as deleteRepository } from '../tools/github/repository/delete-repository';
import { registerTool as modifyRepositoryVisibility } from '../tools/github/repository/modify-repository-visibility';
import { registerTool as listCollaborators } from '../tools/github/repository/list-collaborators';
import { registerTool as addRemoveCollaborators } from '../tools/github/repository/add-remove-collaborators';
import { registerTool as repositoryTree } from '../tools/github/repository/repository-tree';

import { registerTool as listBranches } from '../tools/github/branch/list-branches';
import { registerTool as getBranchDetails } from '../tools/github/branch/get-branch-details';
import { registerTool as createBranch } from '../tools/github/branch/create-branch';
import { registerTool as setDefaultBranch } from '../tools/github/branch/set-default-branch';
import { registerTool as deleteBranch } from '../tools/github/branch/delete-branch';

import { registerTool as listCommits } from '../tools/github/commit/list-commits';
import { registerTool as getCommitModifications } from '../tools/github/commit/get-commit-modifications';

import { registerTool as getFileContent } from '../tools/github/get-file-content';
import { registerTool as commitRemoteFile } from '../tools/github/commit-remote-file';

import { registerTool as listIssues } from '../tools/github/issue/list-issues';
import { registerTool as getIssueDetails } from '../tools/github/issue/get-issue-details';
import { registerTool as getIssueComments } from '../tools/github/issue/get-issue-comments';
import { registerTool as createIssue } from '../tools/github/issue/create-issue';
import { registerTool as updateIssue } from '../tools/github/issue/update-issue';
import { registerTool as updateIssueState } from '../tools/github/issue/update-issue-state';
import { registerTool as assignIssue } from '../tools/github/issue/assign-issue';

import { registerTool as listAllPRs } from '../tools/github/pull-request/list-all-prs';
import { registerTool as createPR } from '../tools/github/pull-request/create-pull-request';
import { registerTool as updatePR } from '../tools/github/pull-request/update-pull-request';

import { registerTool as listReleases } from '../tools/github/release/list-releases';
import { registerTool as createRelease } from '../tools/github/release/create-release';
import { registerTool as updateRelease } from '../tools/github/release/update-release';
import { registerTool as deleteRelease } from '../tools/github/release/delete-release';

async function setupMcpTools(server: McpServer) {
    const start = Date.now();

    myGitHubAccount(server);

    listRepositories(server);
    getRepositoryDetails(server);
    createRepository(server);
    updateRepository(server);
    renameRepository(server);
    deleteRepository(server);
    modifyRepositoryVisibility(server);
    listCollaborators(server);
    addRemoveCollaborators(server);
    repositoryTree(server);

    listBranches(server);
    getBranchDetails(server);
    createBranch(server);
    setDefaultBranch(server);
    deleteBranch(server);

    listCommits(server);
    getCommitModifications(server);

    getFileContent(server);
    commitRemoteFile(server);

    listIssues(server);
    getIssueDetails(server);
    getIssueComments(server);
    createIssue(server);
    updateIssue(server);
    updateIssueState(server);
    assignIssue(server);

    listAllPRs(server);
    createPR(server);
    updatePR(server);

    listReleases(server);
    createRelease(server);
    updateRelease(server);
    deleteRelease(server);

    await printInConsole(transport, `All tools loaded in ${Date.now() - start}ms`);
}

export { setupMcpTools };
