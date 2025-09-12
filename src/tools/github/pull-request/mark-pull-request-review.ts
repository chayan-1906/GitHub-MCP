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
    const toolConfig = tools.markPRForPRReview;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            prNumber: z.number().min(1).describe(toolConfig.parameters.find(p => p.name === 'prNumber')?.techDescription || ''),
            reviewId: z.number().min(1).describe(toolConfig.parameters.find(p => p.name === 'reviewId')?.techDescription || ''),
            event: z.enum(['APPROVE', 'REQUEST_CHANGES', 'COMMENT']).describe(toolConfig.parameters.find(p => p.name === 'event')?.techDescription || ''),
            body: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'body')?.techDescription || ''),
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

                sendError(transport, new Error(fullError), tools.markPRForPRReview.name);
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
