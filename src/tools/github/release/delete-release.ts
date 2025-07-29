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
    server.tool(
        tools.deleteRelease,
        'Deletes a GitHub release by release ID. This action is irreversible',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            releaseId: z.number().describe('The unique ID of the release to delete'),
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
                sendError(transport, new Error(`Failed to delete release: ${error}`), tools.deleteRelease);
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
