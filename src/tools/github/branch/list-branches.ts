import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { BranchDetails } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const listBranches = async (accessToken: string, owner: string, repository: string, perPage: number, currentPage: number) => {
    const branches = await axios.get<Partial<BranchDetails>[]>(apis.listAllBranchesApi(owner, repository, perPage, currentPage), buildHeader(accessToken));

    return branches.data.map(({name, commit, protected: isProtected}: Partial<BranchDetails>) => ({
        name: name || '',
        sha: commit ? commit.sha : '',
        isProtected: isProtected ?? false,
    }));
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.listBranches;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            perPage: z.number().min(1).max(60).default(30).describe(toolConfig.parameters.find(p => p.name === 'perPage')?.techDescription || ''),
            currentPage: z.number().min(1).default(1).describe(toolConfig.parameters.find(p => p.name === 'currentPage')?.techDescription || '')
        },
        async ({owner, repository, perPage, currentPage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const branches = await listBranches(accessToken, owner, repository, perPage, currentPage);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(branches, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to list out all branches: ${error}`), tools.listBranches.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to list out all branches ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
