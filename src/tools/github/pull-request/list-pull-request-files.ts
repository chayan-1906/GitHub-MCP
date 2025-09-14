import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { CommitFile } from "../../../types";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const listPullRequestFiles = async (accessToken: string, owner: string, repository: string, prNumber: number, perPage: number, currentPage: number) => {
    const files = await axios.get<CommitFile[]>(apis.listPullRequestFilesApi(owner, repository, prNumber, perPage, currentPage), buildHeader(accessToken));

    return files.data.map(({filename, status, additions, deletions, changes, patch}: CommitFile) => ({
        filename, status, additions, deletions, changes, patch,
    }));
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.listPRFiles;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            prNumber: z.number().min(1).describe(toolConfig.parameters.find(p => p.name === 'prNumber')?.techDescription || ''),
            perPage: z.number().min(1).max(100).default(30).describe(toolConfig.parameters.find(p => p.name === 'perPage')?.techDescription || ''),
            currentPage: z.number().min(1).default(1).describe(toolConfig.parameters.find(p => p.name === 'currentPage')?.techDescription || ''),
        },
        async ({owner, repository, prNumber, perPage, currentPage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const files = await listPullRequestFiles(accessToken, owner, repository, prNumber, perPage, currentPage);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(files, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to list pull request files: ${error}`), tools.listPRFiles.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to list pull request files ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
