import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../server";
import { tools } from "../../utils/constants";
import { getGitHubAccessToken } from "../../services/OAuth";
import { apis, buildHeader } from "../../utils/apis";

const commitRemoteFile = async (accessToken: string, owner: string, repository: string, branch: string, filePath: string, fileContent: string, commitMessage: string, parentCommitSha?: string, baseTreeSha?: string) => {
    /* Create blob for the new/updated file */
    const {data: blob} = await axios.post(
        apis.createBlobApi(owner, repository),  
        {content: fileContent, encoding: 'utf-8'},
        buildHeader(accessToken),
    );

    /* Create a new tree that includes the blob */
    const {data: newTree} = await axios.post(
        apis.createTreeApi(owner, repository),
        {
            base_tree: baseTreeSha,
            tree: [
                {path: filePath, mode: '100644', type: 'blob', sha: blob.sha},
            ],
        },
        buildHeader(accessToken),
    );

    /* Create a new commit pointing to that tree */
    const commitPayload: any = {
        message: commitMessage,
        tree: newTree.sha,
    };
    if (parentCommitSha) {
        commitPayload.parents = [parentCommitSha];
    }

    const {data: newCommit} = await axios.post(
        apis.createCommitApi(owner, repository),
        commitPayload,
        buildHeader(accessToken),
    );


    /* Update the branch ref to the new commit */
    await axios.patch(
        apis.updateBranchRefApi(owner, repository, branch),
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
        `Commits a file to a GitHub Repository using GitHub API. This does not use the local file system.  
                    • parentCommitSha & baseTreeSha: must be real SHAs.  
                    • If the repository is empty, omit these fields (don’t pass 000…000).`,
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            branch: z.string().describe('Name of the branch where the file should be committed'),
            filePath: z.string().describe('Path of the file (e.g., README.md or docs/info.txt)'),
            fileContent: z.string().describe('Content of the file'),
            commitMessage: z.string().describe('Commit message to include'),
            parentCommitSha: z.string().optional().describe('Latest commit SHA in branch (omit if repo empty)'),
            baseTreeSha: z.string().optional().describe('Tree SHA of that commit (omit if repo empty)'),
        },
        async ({owner, repository, branch, parentCommitSha, baseTreeSha, filePath, fileContent, commitMessage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const committedFile = await commitRemoteFile(accessToken, owner, repository, branch, filePath, fileContent, commitMessage, parentCommitSha, baseTreeSha);

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
