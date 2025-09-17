import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";
import { RepositoryRuleset, RulesetBypassActor, RulesetConditions, RulesetRule } from "../../../types";

const createRepositoryRuleset = async (accessToken: string, owner: string, repository: string, rulesetData: {
    name: string;
    target: 'branch' | 'tag' | 'push';
    enforcement: 'active' | 'disabled' | 'evaluate';
    conditions?: RulesetConditions;
    rules: RulesetRule[];
    bypass_actors?: RulesetBypassActor[];
}): Promise<RepositoryRuleset> => {
    const url = apis.createRepositoryRulesetApi(owner, repository);
    const response = await axios.post<RepositoryRuleset>(url, rulesetData, buildHeader(accessToken));
    return response.data;
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.createRepositoryRuleset;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            name: z.string().describe(toolConfig.parameters.find(p => p.name === 'name')?.techDescription || ''),
            target: z.enum(['branch', 'tag', 'push']).describe(toolConfig.parameters.find(p => p.name === 'target')?.techDescription || ''),
            enforcement: z.enum(['active', 'disabled', 'evaluate']).describe(toolConfig.parameters.find(p => p.name === 'enforcement')?.techDescription || ''),
            conditions: z.object({
                ref_name: z.object({
                    include: z.array(z.string()).optional().describe(toolConfig.parameters.find(p => p.name === 'conditions')?.parameters?.find(pp => pp.name === 'ref_name')?.parameters?.find(ppp => ppp.name === 'include')?.techDescription || ''),
                    exclude: z.array(z.string()).optional().describe(toolConfig.parameters.find(p => p.name === 'conditions')?.parameters?.find(pp => pp.name === 'ref_name')?.parameters?.find(ppp => ppp.name === 'exclude')?.techDescription || ''),
                }).optional().describe(toolConfig.parameters.find(p => p.name === 'conditions')?.parameters?.find(pp => pp.name === 'ref_name')?.techDescription || ''),
            }).optional().describe(toolConfig.parameters.find(p => p.name === 'conditions')?.techDescription || ''),
            rules: z.array(z.object({
                type: z.string().describe(toolConfig.parameters.find(p => p.name === 'rules')?.parameters?.find(pp => pp.name === 'type')?.techDescription || ''),
                parameters: z.record(z.any()).optional().describe(toolConfig.parameters.find(p => p.name === 'rules')?.parameters?.find(pp => pp.name === 'parameters')?.techDescription || ''),
            })).describe(toolConfig.parameters.find(p => p.name === 'rules')?.techDescription || ''),
            bypass_actors: z.array(z.object({
                actor_id: z.number().describe(toolConfig.parameters.find(p => p.name === 'bypass_actors')?.parameters?.find(pp => pp.name === 'actor_id')?.techDescription || ''),
                actor_type: z.enum(['OrganizationAdmin', 'RepositoryRole', 'Team', 'Integration']).describe(toolConfig.parameters.find(p => p.name === 'bypass_actors')?.parameters?.find(pp => pp.name === 'actor_type')?.techDescription || ''),
                bypass_mode: z.enum(['always', 'pull_request']).describe(toolConfig.parameters.find(p => p.name === 'bypass_actors')?.parameters?.find(pp => pp.name === 'bypass_mode')?.techDescription || ''),
            })).optional().describe(toolConfig.parameters.find(p => p.name === 'bypass_actors')?.techDescription || ''),
        },
        async ({owner, repository, name, target, enforcement, conditions, rules, bypass_actors}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const rulesetData = {
                    name,
                    target,
                    enforcement,
                    ...(conditions && {conditions}),
                    rules,
                    ...(bypass_actors && {bypass_actors}),
                };

                const ruleset = await createRepositoryRuleset(accessToken, owner, repository, rulesetData);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(ruleset, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to create repository ruleset: ${error}`), tools.createRepositoryRuleset.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to create repository ruleset ❌: ${error.response?.data?.message || error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
