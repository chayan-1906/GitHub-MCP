import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";
import {tools} from "../../utils/constants";
import {sendError} from "../../utils/sendError";
import {transport} from "../../server";
import axios from "axios";
import {apis, buildHeader} from "../../utils/apis";
import {getGitHubAccessToken, getSessionTokenFromSessionFile} from "../../services/OAuth";
import {FileTree} from "../../types";

const listFilesInRepository = async (accessToken: string, repository: string, branch: string) => {
    const {username} = await getSessionTokenFromSessionFile() || {};

    const listFilesResponse = await axios.get<FileTree>(apis.listFilesApi(username, repository, branch), buildHeader(accessToken));
    const {tree} = listFilesResponse.data || {};
    return tree;
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.listFilesInRepository,
        'Fetches the recursive file structure (tree) of a specified GitHub repository branch. Requires repository and branch name',
        {
            repository: z.string().describe('The name of the GitHub repository to list files from'),
            branch: z.string().describe('Branch name to list files from'),
        },
        async ({repository, branch}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const files = await listFilesInRepository(accessToken, repository, branch);

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
