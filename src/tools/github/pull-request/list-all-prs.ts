import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { PullRequest } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const listAllPRs = async (accessToken: string, owner: string, repository: string, state: string, perPage: number, currentPage: number, sort: string, direction: string) => {
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
    server.tool(
        tools.listAllPRs,
        'Fetches all pull requests from a GitHub repository, page by page. Filter by state and sort options available',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            state: z.enum(['open', 'closed', 'all']).default('open').describe('PR state to filter by (open, closed, all). Default: open'),
            sort: z.enum(['created', 'updated', 'popularity', 'long-running']).default('created').describe('Sort PRs by created, updated, popularity, or long-running. Default: created'),
            direction: z.enum(['asc', 'desc']).default('desc').describe('Sort direction: asc (oldest first) or desc (newest first). Default: desc'),
            currentPage: z.number().min(1).default(1).describe('Page number of the results to fetch. Start with 1 and increment until the returned list is empty'),
            perPage: z.number().min(1).max(100).default(30).describe('Maximum number of PRs to return per page (max: 100)'),
        },
        async ({owner, repository, state, sort, direction, currentPage, perPage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const pullRequests = await listAllPRs(accessToken, owner, repository, state, perPage, currentPage, sort, direction);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(pullRequests, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to fetch pull requests: ${error}`), tools.listAllPRs);
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
