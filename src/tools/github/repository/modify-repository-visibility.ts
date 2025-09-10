import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { RepositoryDetails } from "../../../types";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const modifyRepositoryVisibility = async (accessToken: string, owner: string, repository: string, visibility: 'public' | 'private' | 'internal') => {
    const renameRepositoryResponse = await axios.patch<Partial<RepositoryDetails>>(apis.modifyRepositoryVisibilityApi(owner, repository), {visibility}, buildHeader(accessToken));
    const renameRepositoryResponseData: Partial<RepositoryDetails> = renameRepositoryResponse.data;

    return renameRepositoryResponseData.visibility;
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.modifyRepositoryVisibility;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            visibility: z.enum(['public', 'private', 'internal']).describe(toolConfig.parameters.find(p => p.name === 'visibility')?.techDescription || ''),
        },
        async ({owner, repository, visibility}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const modifiedVisibility = await modifyRepositoryVisibility(accessToken, owner, repository, visibility);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: `Repository visibility updated to '${modifiedVisibility} ✅`,
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to modify repository visibility: ${error}`), tools.modifyRepositoryVisibility.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to modify repository visibility ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
