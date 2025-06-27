import {z} from "zod";
import axios from "axios";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {sendError} from "mcp-utils/utils";
import {transport} from "../../server";
import {tools} from "../../utils/constants";
import {getGitHubAccessToken} from "../../services/OAuth";
import {buildHeader, gitHubBaseUrl} from "../../utils/apis";

const commitRemoteFile = async (accessToken: string, owner: string, repository: string, branch: string, parentCommitSha: string, baseTreeSha: string, filePath: string, fileContent: string, commitMessage: string) => {
    /* 1️⃣  Create blob for the new/updated file */
    const {data: blob} = await axios.post(
        `${gitHubBaseUrl}/repos/${owner}/${repository}/git/blobs`,
        {content: fileContent, encoding: 'utf-8'},
        buildHeader(accessToken),
    );

    /* 2️⃣  Create a new tree that includes the blob */
    const {data: newTree} = await axios.post(
        `${gitHubBaseUrl}/repos/${owner}/${repository}/git/trees`,
        {
            base_tree: baseTreeSha,
            tree: [
                {path: filePath, mode: '100644', type: 'blob', sha: blob.sha},
            ],
        },
        buildHeader(accessToken),
    );

    /* 3️⃣  Create a new commit pointing to that tree */
    const {data: newCommit} = await axios.post(
        `${gitHubBaseUrl}/repos/${owner}/${repository}/git/commits`,
        {
            message: commitMessage,
            tree: newTree.sha,
            parents: [parentCommitSha],
        },
        buildHeader(accessToken),
    );

    /* 🔄  Update the branch ref to the new commit */
    await axios.patch(
        `${gitHubBaseUrl}/repos/${owner}/${repository}/git/refs/heads/${branch}`,
        {sha: newCommit.sha},
        buildHeader(accessToken),
    );

    return {
        repository: `${owner}/${repository}`,
        branch,
        filePath,
        commitMessage,
        commitSha: newCommit.sha,
        commitUrl: `https://github.com/${owner}/${repository}/commit/${newCommit.sha}`,
    };
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.commitRemoteFile,
        'Commits a file (e.g., README.md) to a GitHub Repository using GitHub API. This does not use the local file system',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            branch: z.string().describe('Name of the branch where the file should be committed'),
            parentCommitSha: z.string().describe("The SHA of the latest commit in the branch (parent commit)"),
            baseTreeSha: z.string().describe("The SHA of the base tree (usually from the parent commit)"),
            filePath: z.string().describe('Path of the file (e.g., README.md or docs/info.txt)'),
            fileContent: z.string().describe('Content of the file'),
            commitMessage: z.string().describe('Commit message to include'),
        },
        async ({owner, repository, branch, parentCommitSha, baseTreeSha, filePath, fileContent, commitMessage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const committedFile = await commitRemoteFile(accessToken, owner, repository, branch, parentCommitSha, baseTreeSha, filePath, fileContent, commitMessage);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(committedFile, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to commit remote file: ${error}`), tools.commitRemoteFile);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to commit remote file ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
