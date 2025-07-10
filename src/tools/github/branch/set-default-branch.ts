import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const setDefaultBranch = async (accessToken: string, owner: string, repository: string, branch: string) => {
    await axios.patch(
        apis.setDefaultBranchApi(owner, repository),
        {default_branch: branch},
        buildHeader(accessToken),
    );
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.setDefaultBranch,
        'Sets the default branch in a GitHub repository',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            branch: z.string().describe('The branch name to set as default for the repository'),
        },
        async ({owner, repository, branch}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                await setDefaultBranch(accessToken, owner, repository, branch);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: `Default branch for ${owner}/${repository} set to ${branch} ✅`,
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to set default branch: ${error}`), tools.setDefaultBranch);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to set default branch ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
