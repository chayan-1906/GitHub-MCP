import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";
import { IssueAssignee, IssueComment, IssueResponse } from "../../../types";

const getAllComments = async (accessToken: string, owner: string, repository: string, issueNumber: number) => {
    const allComments: IssueComment[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
        const response = await axios.get<IssueComment[]>(
            apis.issueCommentsApi(owner, repository, issueNumber, perPage, page),
            buildHeader(accessToken),
        );

        const comments: IssueComment[] = response.data;
        if (comments.length === 0) break;

        allComments.push(...comments);
        if (comments.length < perPage) break;

        page++;
    }

    return allComments;
}

const getIssueComments = async (accessToken: string, owner: string, repository: string, issueNumber: number) => {
    const [issueResponse, comments] = await Promise.all([
        axios.get<IssueResponse>(apis.issueDetailsApi(owner, repository, issueNumber), buildHeader(accessToken)),
        getAllComments(accessToken, owner, repository, issueNumber)
    ]);

    const issue: IssueResponse = issueResponse.data;

    const participantsMap = new Map();

    participantsMap.set(issue.user.login, {
        username: issue.user.login,
        id: issue.user.id,
        avatarUrl: issue.user.avatar_url,
        profileUrl: issue.user.html_url,
        type: issue.user.type,
        roles: ['author'],
    });

    issue.assignees.forEach((assignee: IssueAssignee) => {
        const existing = participantsMap.get(assignee.login);
        participantsMap.set(assignee.login, {
            username: assignee.login,
            id: assignee.id,
            avatarUrl: assignee.avatar_url,
            profileUrl: assignee.html_url,
            type: 'User',
            roles: existing ? [...existing.roles, 'assignee'] : ['assignee'],
        });
    });

    comments.forEach((comment: IssueComment) => {
        const existing = participantsMap.get(comment.user.login);
        participantsMap.set(comment.user.login, {
            username: comment.user.login,
            id: comment.user.id,
            avatarUrl: comment.user.avatar_url,
            profileUrl: comment.user.html_url,
            type: comment.user.type,
            roles: existing ? [...existing.roles, 'commenter'] : ['commenter'],
        });
    });

    return {
        originalIssue: {
            id: issue.id,
            number: issue.number,
            title: issue.title,
            body: issue.body || null,
            state: issue.state,
            createdAt: issue.created_at,
            updatedAt: issue.updated_at,
            closedAt: issue.closed_at || null,
            htmlUrl: issue.html_url,
            author: {
                username: issue.user.login,
                id: issue.user.id,
                avatarUrl: issue.user.avatar_url,
                profileUrl: issue.user.html_url,
                type: issue.user.type,
            },
            labels: issue.labels.map(label => ({
                id: label.id,
                name: label.name,
                color: label.color,
                description: label.description || null,
            })),
            assignees: issue.assignees.map(assignee => ({
                username: assignee.login,
                id: assignee.id,
                avatarUrl: assignee.avatar_url,
                profileUrl: assignee.html_url,
            })),
            commentsCount: issue.comments,
        },

        participants: Array.from(participantsMap.values()),

        comments: comments.map(comment => ({
            id: comment.id,
            body: comment.body,
            createdAt: comment.created_at,
            updatedAt: comment.updated_at,
            htmlUrl: comment.html_url,
            issueUrl: comment.issue_url,
            author: {
                username: comment.user.login,
                id: comment.user.id,
                avatarUrl: comment.user.avatar_url,
                profileUrl: comment.user.html_url,
                type: comment.user.type,
                authorAssociation: comment.author_association,
            },
            reactions: {
                totalCount: comment.reactions.total_count,
                thumbsUp: comment.reactions["+1"],
                thumbsDown: comment.reactions["-1"],
                laugh: comment.reactions.laugh,
                hooray: comment.reactions.hooray,
                confused: comment.reactions.confused,
                heart: comment.reactions.heart,
                rocket: comment.reactions.rocket,
                eyes: comment.reactions.eyes,
            },
        })),

        summary: {
            totalComments: comments.length,
            uniqueParticipants: participantsMap.size,
            conversationSpan: {
                firstActivity: issue.created_at,
                lastActivity: comments.length > 0 ?
                    comments[comments.length - 1].updated_at :
                    issue.updated_at,
            },
            participantBreakdown: {
                authors: Array.from(participantsMap.values()).filter(p => p.roles.includes('author')).length,
                assignees: Array.from(participantsMap.values()).filter(p => p.roles.includes('assignee')).length,
                commenters: Array.from(participantsMap.values()).filter(p => p.roles.includes('commenter')).length,
            },
        },
    };
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.getIssueComments,
        'Fetches all comments for a GitHub issue, including the original issue, all comments, and participant details. Automatically fetches all pages of comments',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            issueNumber: z.number().min(1).describe('The issue number to get the comments for'),
        },
        async ({owner, repository, issueNumber}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const comments = await getIssueComments(accessToken, owner, repository, issueNumber);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(comments, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to fetch issue comments: ${error}`), tools.getIssueComments);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to fetch issue comments ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
