import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { RepositoryRulesetList } from "../../../types";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const listRepositoryRulesets = async (accessToken: string, owner: string, repository: string, params: {
    targets?: 'branch' | 'tag' | 'push';
    page: number;
    per_page: number;
}): Promise<RepositoryRulesetList> => {
    const url = apis.listRepositoryRulesetsApi(owner, repository);
    const response = await axios.get<RepositoryRulesetList>(url, {
        ...buildHeader(accessToken),
        params,
    });

    return response.data;
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.listRepositoryRulesets;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            targets: z.enum(['branch', 'tag', 'push']).optional().describe(toolConfig.parameters.find(p => p.name === 'targets')?.techDescription || ''),
            currentPage: z.number().default(1).describe(toolConfig.parameters.find(p => p.name === 'currentPage')?.techDescription || ''),
            perPage: z.number().max(100).default(30).describe(toolConfig.parameters.find(p => p.name === 'perPage')?.techDescription || ''),
        },
        async ({owner, repository, targets, currentPage, perPage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const params = {
                    page: currentPage,
                    per_page: perPage,
                    ...(targets && {targets}),
                };

                const rulesets = await listRepositoryRulesets(accessToken, owner, repository, params);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(rulesets, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to list repository rulesets: ${error}`), tools.listRepositoryRulesets.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to list repository rulesets ❌: ${error.response?.data?.message || error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
