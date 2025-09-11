import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../server";
import { tools } from "../../utils/constants";
import { apis, buildHeader } from "../../utils/apis";
import { getGitHubAccessToken } from "../../services/OAuth";
import { GitBlob, GitCommit, GitTree } from "../../types";

const commitRemoteFile = async (accessToken: string, owner: string, repository: string, branch: string, filePath: string, fileContent: string, commitMessage: string, parentCommitSha?: string, baseTreeSha?: string) => {
    /* Create blob for the new/updated file */
    const {data: blob} = await axios.post<GitBlob>(
        apis.createBlobApi(owner, repository),
        {content: fileContent, encoding: 'utf-8'},
        buildHeader(accessToken),
    );

    /* Create a new tree that includes the blob */
    const {data: newTree} = await axios.post<GitTree>(
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
    const commitPayload: {
        message: string;
        tree: string;
        parents?: string[];
    } = {
        message: commitMessage,
        tree: newTree.sha,
    };
    if (parentCommitSha) {
        commitPayload.parents = [parentCommitSha];
    }

    const {data: newCommit} = await axios.post<GitCommit>(
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
    const toolConfig = tools.commitRemoteFile;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            branch: z.string().describe(toolConfig.parameters.find(p => p.name === 'branch')?.techDescription || ''),
            filePath: z.string().describe(toolConfig.parameters.find(p => p.name === 'filePath')?.techDescription || ''),
            fileContent: z.string().describe(toolConfig.parameters.find(p => p.name === 'fileContent')?.techDescription || ''),
            commitMessage: z.string().describe(toolConfig.parameters.find(p => p.name === 'commitMessage')?.techDescription || ''),
            parentCommitSha: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'parentCommitSha')?.techDescription || ''),
            baseTreeSha: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'baseTreeSha')?.techDescription || ''),
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
                sendError(transport, new Error(`Failed to commit remote file: ${error}`), tools.commitRemoteFile.name);
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
