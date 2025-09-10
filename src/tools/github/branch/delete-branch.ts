import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const deleteBranch = async (accessToken: string, owner: string, repository: string, branch: string) => {
    await axios.delete(apis.deleteBranchApi(owner, repository, branch), buildHeader(accessToken));

    return {
        repository: `${owner}/${repository}`,
        deletedBranch: branch,
        message: `Branch '${branch}' has been deleted ✅`,
    };
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.deleteBranch;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            branch: z.string().describe(toolConfig.parameters.find(p => p.name === 'branch')?.techDescription || ''),
        },
        async ({owner, repository, branch}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const response = await deleteBranch(accessToken, owner, repository, branch);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(response, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to delete branch: ${error}`), tools.deleteBranch.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to delete branch ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
