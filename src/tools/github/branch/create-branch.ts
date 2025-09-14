import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const createBranch = async (accessToken: string, owner: string, repository: string, newBranch: string, sha: string, fromBranch?: string) => {
    await axios.post(`${apis.createBranchApi(owner, repository)}/git/refs`,
        {ref: `refs/heads/${newBranch}`, sha},
        buildHeader(accessToken),
    );

    return {
        repository: `${owner}/${repository}`,
        newBranch,
        fromBranch,
        url: `https://github.com/${owner}/${repository}/tree/${newBranch}`,
    };
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.createBranch;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            newBranch: z.string().describe(toolConfig.parameters.find(p => p.name === 'newBranch')?.techDescription || ''),
            sha: z.string().describe(toolConfig.parameters.find(p => p.name === 'sha')?.techDescription || ''),
            fromBranch: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'fromBranch')?.techDescription || ''),
        },
        async ({owner, repository, newBranch, sha, fromBranch}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const createdBranch = await createBranch(accessToken, owner, repository, newBranch, sha, fromBranch);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(createdBranch, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to create branch: ${error}`), tools.createBranch.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to create branch ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
