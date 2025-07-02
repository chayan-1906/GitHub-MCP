import {z} from "zod";
import axios from "axios";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {sendError} from "mcp-utils/utils";
import {transport} from "../../../server";
import {tools} from "../../../utils/constants";
import {RepositoryDetails} from "../../../types";
import {apis, buildHeader} from "../../../utils/apis";
import {getGitHubAccessToken} from "../../../services/OAuth";

const renameRepository = async (accessToken: string, owner: string, oldName: string, newName: string) => {
    const renameRepositoryResponse = await axios.patch<RepositoryDetails>(apis.renameRepositoryApi(owner, oldName), {name: newName}, buildHeader(accessToken));
    const renameRepositoryResponseData = renameRepositoryResponse.data;
    return {
        oldName,
        newName: renameRepositoryResponseData.name,
        htmlUrl: renameRepositoryResponseData.html_url,
    };
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.renameRepository,
        'Renames a GitHub repository owned by the authenticated user',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            oldName: z.string().describe('Current name of the repository'),
            newName: z.string().describe('New name to give to the repository'),
        },
        async ({owner, oldName, newName}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const response = await renameRepository(accessToken, owner, oldName, newName);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: `Repository ${response} renamed from ${response.oldName} to ${response.newName} ✅\n🔗 ${response.htmlUrl}`,
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to rename repository: ${error}`), tools.renameRepository);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to rename repository ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
