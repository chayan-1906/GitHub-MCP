import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const deleteRelease = async (accessToken: string, owner: string, repository: string, releaseId: number) => {
    await axios.delete(apis.deleteReleaseApi(owner, repository, releaseId), buildHeader(accessToken));

    return {
        repository: `${owner}/${repository}`,
        releaseId,
        message: `Release with ID ${releaseId} has been deleted ✅`,
    };
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.deleteRelease;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            releaseId: z.number().describe(toolConfig.parameters.find(p => p.name === 'releaseId')?.techDescription || ''),
        },
        async ({owner, repository, releaseId}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const response = await deleteRelease(accessToken, owner, repository, releaseId);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(response, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to delete release: ${error}`), tools.deleteRelease.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to delete release ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
