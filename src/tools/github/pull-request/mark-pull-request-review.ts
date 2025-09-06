import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { PullRequestReview } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const markPullRequestReview = async (accessToken: string, owner: string, repository: string, prNumber: number, reviewId: number, event: string, body?: string) => {
    const payload: {
        event: string;
        body?: string;
    } = {event};

    if (body) payload.body = body;

    const {data} = await axios.post<PullRequestReview>(apis.markPullRequestReviewApi(owner, repository, prNumber, reviewId), payload, buildHeader(accessToken));
    const {id, user, body: reviewBody, state, submitted_at, commit_id, html_url, author_association} = data;

    return {
        id,
        reviewer: {
            username: user.login,
            id: user.id,
            avatarUrl: user.avatar_url,
            profileUrl: user.html_url,
        },
        body: reviewBody,
        state,
        submittedAt: submitted_at,
        commitId: commit_id,
        htmlUrl: html_url,
        authorAssociation: author_association,
        event: payload.event,
        success: true,
    };
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.markPRForPRReview,
        'Submits a pending pull request review by marking it with APPROVE, REQUEST_CHANGES, or COMMENT',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            prNumber: z.number().min(1).describe('Pull request number containing the pending review'),
            reviewId: z.number().min(1).describe('Pending review ID to submit (get this from get-pull-request-reviews)'),
            event: z.enum(['APPROVE', 'REQUEST_CHANGES', 'COMMENT']).describe('Review action to submit: APPROVE (approve PR), REQUEST_CHANGES (request changes), COMMENT (general comment)'),
            body: z.string().optional().describe('Additional review comment text (optional for APPROVE, recommended for REQUEST_CHANGES and COMMENT)'),
        },
        async ({owner, repository, prNumber, reviewId, event, body}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const result = await markPullRequestReview(accessToken, owner, repository, prNumber, reviewId, event, body);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                const errorDetails = error.response?.data ? JSON.stringify(error.response.data, null, 2) : 'No additional error details';
                const fullError = `Failed to mark pull request review: ${error.message}\nAPI Response: ${errorDetails}`;

                sendError(transport, new Error(fullError), tools.markPRForPRReview);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to mark pull request review ❌: ${error.message}\n\nDetails: ${errorDetails}`,
                        },
                    ],
                };
            }
        },
    );
}
