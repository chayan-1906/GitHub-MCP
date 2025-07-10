import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { FileTree } from "../../../types";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const listFilesInRepository = async (accessToken: string, owner: string, repository: string, branch: string) => {
    const listFilesResponse = await axios.get<FileTree>(apis.listFilesApi(owner, repository, branch), buildHeader(accessToken));
    const {tree} = listFilesResponse.data || {};
    return tree;
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.listFilesInRepository,
        'Fetches the recursive file structure (tree) of a specified GitHub repository branch. Requires repository and branch name',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub repository to list files from'),
            branch: z.string().describe('Branch name to list files from'),
        },
        async ({owner, repository, branch}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const files = await listFilesInRepository(accessToken, owner, repository, branch);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(files, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to list out all files: ${error}`), tools.listFilesInRepository);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to list out all files ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
