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
    server.tool(
        tools.deleteBranch,
        'Deletes a branch from a GitHub repository. Cannot delete the default branch',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            branch: z.string().describe('The name of the branch to delete'),
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
                sendError(transport, new Error(`Failed to delete branch: ${error}`), tools.deleteBranch);
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
