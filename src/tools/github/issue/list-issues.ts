import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";
import { IssueDetails } from "../../../types";

const listIssues = async (accessToken: string, owner: string, repository: string, state: string, includePRs: boolean, perPage: number, currentPage: number, sort: string, direction: string) => {
    const response = await axios.get<Partial<IssueDetails>[]>(apis.listIssuesApi(owner, repository, state, includePRs, perPage, currentPage, sort, direction), buildHeader(accessToken));

    return response.data.map(({
                                  number,
                                  title,
                                  state,
                                  body,
                                  user,
                                  assignees,
                                  labels,
                                  created_at,
                                  updated_at,
                                  html_url,
                                  pull_request,
                              }: Partial<IssueDetails>) => ({
        number,
        title,
        state,
        // body,
        author: user?.login || '',
        assignees: assignees?.map(assignee => assignee.login) || [],
        labels: labels?.map(label => label.name) || [],
        created_at,
        updated_at,
        url: html_url,
        isPR: !!pull_request,
    }));
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.listIssues;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            state: z.enum(['open', 'closed', 'all']).default('open').describe(toolConfig.parameters.find(p => p.name === 'state')?.techDescription || ''),
            includePRs: z.boolean().default(false).describe(toolConfig.parameters.find(p => p.name === 'includePRs')?.techDescription || ''),
            sort: z.enum(['created', 'updated', 'comments']).default('created').describe(toolConfig.parameters.find(p => p.name === 'sort')?.techDescription || ''),
            direction: z.enum(['asc', 'desc']).default('desc').describe(toolConfig.parameters.find(p => p.name === 'direction')?.techDescription || ''),
            currentPage: z.number().min(1).default(1).describe(toolConfig.parameters.find(p => p.name === 'currentPage')?.techDescription || ''),
            perPage: z.number().min(1).max(100).default(30).describe(toolConfig.parameters.find(p => p.name === 'perPage')?.techDescription || ''),
        },
        async ({owner, repository, state, includePRs, sort, direction, currentPage, perPage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const issues = await listIssues(accessToken, owner, repository, state, includePRs, perPage, currentPage, sort, direction);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(issues, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to fetch issues: ${error}`), tools.listIssues.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to fetch issues ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
