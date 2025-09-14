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
    const toolConfig = tools.setDefaultBranch;
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
                sendError(transport, new Error(`Failed to set default branch: ${error}`), tools.setDefaultBranch.name);
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
