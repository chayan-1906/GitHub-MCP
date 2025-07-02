import {z} from "zod";
import axios from "axios";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {sendError} from "mcp-utils/utils";
import {transport} from "../../../server";
import {tools} from "../../../utils/constants";
import {apis, buildHeader} from "../../../utils/apis";
import {getGitHubAccessToken} from "../../../services/OAuth";

const deleteRepository = async (accessToken: string, owner: string, repository: string) => {
    await axios.delete(apis.deleteRepositoryApi(owner, repository), buildHeader(accessToken));
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.deleteRepository,
        'Deletes a GitHub repository owned by the authenticated user. This action is irreversible',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
        },
        async ({owner, repository}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                await deleteRepository(accessToken, owner, repository);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: `Repository ${repository} deleted ✅`,
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to delete repository: ${error}`), tools.deleteRepository);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to delete repository ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
