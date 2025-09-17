import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { RepositoryRuleset } from "../../../types";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const getRepositoryRuleset = async (accessToken: string, owner: string, repository: string, rulesetId: number): Promise<RepositoryRuleset> => {
    const url = apis.getRepositoryRulesetApi(owner, repository, rulesetId);
    const response = await axios.get<RepositoryRuleset>(url, buildHeader(accessToken));
    return response.data;
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.getRepositoryRuleset;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            rulesetId: z.number().describe(toolConfig.parameters.find(p => p.name === 'rulesetId')?.techDescription || ''),
        },
        async ({owner, repository, rulesetId}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const ruleset = await getRepositoryRuleset(accessToken, owner, repository, rulesetId);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(ruleset, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to get repository ruleset: ${error}`), tools.getRepositoryRuleset.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to get repository ruleset ❌: ${error.response?.data?.message || error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
