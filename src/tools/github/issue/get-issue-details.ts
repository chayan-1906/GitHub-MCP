import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { IssueDetails } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const getIssueDetails = async (accessToken: string, owner: string, repository: string, issueNumber: number) => {
    const response = await axios.get<IssueDetails>(apis.getIssueDetailsApi(owner, repository, issueNumber), buildHeader(accessToken));
    const issue: IssueDetails = response.data;

    return {
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body || null,
        state: issue.state,
        locked: issue.locked,
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        closedAt: issue.closed_at || null,
        stateReason: issue.state_reason || null,
        author: {
            username: issue.user.login,
            id: issue.user.id,
            avatarUrl: issue.user.avatar_url,
            profileUrl: issue.user.html_url,
        },
        assignee: issue.assignee ? {
            username: issue.assignee.login,
            id: issue.assignee.id,
            avatarUrl: issue.assignee.avatar_url,
            profileUrl: issue.assignee.html_url,
        } : null,
        assignees: issue.assignees.map(assignee => ({
            username: assignee.login,
            id: assignee.id,
            avatarUrl: assignee.avatar_url,
            profileUrl: assignee.html_url,
        })),
        labels: issue.labels.map(label => ({
            id: label.id,
            name: label.name,
            color: label.color,
            description: label.description || null,
        })),
        milestone: issue.milestone ? {
            id: issue.milestone.id,
            number: issue.milestone.number,
            title: issue.milestone.title,
            description: issue.milestone.description || null,
            state: issue.milestone.state,
            dueOn: issue.milestone.due_on || null,
        } : null,
        commentsCount: issue.comments,
        htmlUrl: issue.html_url,
        repositoryUrl: issue.repository_url,
    };
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.getIssueDetails;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            issueNumber: z.number().min(1).describe(toolConfig.parameters.find(p => p.name === 'issueNumber')?.techDescription || ''),
        },
        async ({owner, repository, issueNumber}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const issueDetails = await getIssueDetails(accessToken, owner, repository, issueNumber);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(issueDetails, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to fetch issue details: ${error}`), tools.getIssueDetails.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to fetch issue details ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
