import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { PullRequest } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const listPrs = async (accessToken: string, owner: string, repository: string, state: string, perPage: number, currentPage: number, sort: string, direction: string) => {
    const response = await axios.get<Partial<PullRequest>[]>(apis.listPullRequestsApi(owner, repository, state, perPage, currentPage, sort, direction), buildHeader(accessToken));

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
                                  closed_at,
                                  merged_at,
                                  html_url,
                                  diff_url,
                                  patch_url,
                                  head,
                                  base,
                                  draft,
                                  merged,
                                  commits,
                                  additions,
                                  deletions,
                                  changed_files,
                              }: Partial<PullRequest>) => ({
        number,
        title,
        state,
        author: user?.login || '',
        assignees: assignees?.map(assignee => assignee.login) || [],
        labels: labels?.map(label => label.name) || [],
        created_at,
        updated_at,
        closed_at,
        merged_at,
        url: html_url,
        diffUrl: diff_url,
        patchUrl: patch_url,
        headBranch: head?.ref || '',
        baseBranch: base?.ref || '',
        headRepo: head?.repo?.full_name || '',
        baseRepo: base?.repo?.full_name || '',
        draft,
        merged,
        commits,
        additions,
        deletions,
        changed_files,
    }));
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.listAllPRs;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            state: z.enum(['open', 'closed', 'all']).default('open').describe(toolConfig.parameters.find(p => p.name === 'state')?.techDescription || ''),
            sort: z.enum(['created', 'updated', 'popularity', 'long-running']).default('created').describe(toolConfig.parameters.find(p => p.name === 'sort')?.techDescription || ''),
            direction: z.enum(['asc', 'desc']).default('desc').describe(toolConfig.parameters.find(p => p.name === 'direction')?.techDescription || ''),
            currentPage: z.number().min(1).default(1).describe(toolConfig.parameters.find(p => p.name === 'currentPage')?.techDescription || ''),
            perPage: z.number().min(1).max(100).default(30).describe(toolConfig.parameters.find(p => p.name === 'perPage')?.techDescription || ''),
        },
        async ({owner, repository, state, sort, direction, currentPage, perPage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const pullRequests = await listPrs(accessToken, owner, repository, state, perPage, currentPage, sort, direction);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(pullRequests, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to fetch pull requests: ${error}`), tools.listAllPRs.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to fetch pull requests ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
