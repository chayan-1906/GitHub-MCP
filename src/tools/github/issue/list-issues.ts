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
    server.tool(
        tools.listIssues,
        'Fetches issues from a GitHub repository, page by page. Calls repeatedly with increasing currentPage until result is empty',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            state: z.enum(['open', 'closed', 'all']).default('open').describe('Issue state to filter by (open, closed, all). Default: open'),
            includePRs: z.boolean().default(false).describe('Include pull requests in results. Default: false (excludes PRs)'),
            sort: z.enum(['created', 'updated', 'comments']).default('created').describe('Sort issues by created, updated, or comments. Default: created'),
            direction: z.enum(['asc', 'desc']).default('desc').describe('Sort direction: asc (oldest first) or desc (newest first). Default: desc'),
            currentPage: z.number().min(1).default(1).describe('Page number of the results to fetch. Start with 1 and increment until the returned list is empty'),
            perPage: z.number().min(1).max(100).default(30).describe('Maximum number of issues to return per page (max: 100)'),
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
                sendError(transport, new Error(`Failed to fetch issues: ${error}`), tools.listIssues);
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
