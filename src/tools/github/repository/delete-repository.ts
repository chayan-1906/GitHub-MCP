import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const deleteRepository = async (accessToken: string, owner: string, repository: string) => {
    await axios.delete(apis.deleteRepositoryApi(owner, repository), buildHeader(accessToken));
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.deleteRepository;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
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
                sendError(transport, new Error(`Failed to delete repository: ${error}`), tools.deleteRepository.name);
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
