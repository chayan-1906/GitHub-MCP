import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { IssueDetails } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const listAllIssues = async (accessToken: string, owner: string, repository: string, state: string, perPage: number, page: number, sort: string, direction: string) => {
    const response = await axios.get<IssueDetails[]>(apis.listIssuesApi(owner, repository, state, perPage, page, sort, direction), buildHeader(accessToken));
    const issues = response.data;

    const actualIssues = issues.filter(issue => !issue.pull_request);

    return actualIssues.map(issue => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        state: issue.state,
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        closedAt: issue.closed_at,
        author: {
            username: issue.user.login,
            avatarUrl: issue.user.avatar_url,
        },
        assignee: issue.assignee ? {
            username: issue.assignee.login,
            avatarUrl: issue.assignee.avatar_url,
        } : null,
        assignees: issue.assignees.map(assignee => ({
            username: assignee.login,
            avatarUrl: assignee.avatar_url,
        })),
        labels: issue.labels.map(label => ({
            id: label.id,
            name: label.name,
            color: label.color,
        })),
        body: issue.body,
        htmlUrl: issue.html_url,
        commentsCount: issue.comments,
    }));
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.listAllIssues,
        'Fetches issues from a GitHub repository, page by page. Call repeatedly with increasing currentPage until result is empty.',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            state: z.enum(['open', 'closed', 'all']).default('open').describe('Issue state to filter by (open, closed, all). Default: open'),
            sort: z.enum(['created', 'updated', 'comments']).default('created').describe('Sort issues by created, updated, or comments. Default: created'),
            direction: z.enum(['asc', 'desc']).default('desc').describe('Sort direction: asc (oldest first) or desc (newest first). Default: desc'),
            currentPage: z.number().min(1).default(1).describe('Page number of the results to fetch. Start with 1 and increment until the returned list is empty'),
            perPage: z.number().min(1).max(100).default(30).describe('Maximum number of issues to return per page (max: 100)'),
        },
        async ({owner, repository, state, sort, direction, currentPage, perPage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const issues = await listAllIssues(accessToken, owner, repository, state, perPage, currentPage, sort, direction);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(issues, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to fetch issues: ${error}`), tools.listAllIssues);
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
