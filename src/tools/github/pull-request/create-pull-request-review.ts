import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { PullRequestReview } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const createPullRequestReview = async (accessToken: string, owner: string, repository: string, prNumber: number, event?: string, body?: string, commitId?: string) => {
    const payload: {
        event?: string;
        body?: string;
        commit_id?: string;
    } = {};

    if (event && event !== 'PENDING') payload.event = event;
    if (body) payload.body = body;
    if (commitId) payload.commit_id = commitId;

    const {data} = await axios.post<PullRequestReview>(apis.createPullRequestReviewApi(owner, repository, prNumber), payload, buildHeader(accessToken));

    return {
        id: data.id,
        reviewer: {
            username: data.user.login,
            id: data.user.id,
            avatarUrl: data.user.avatar_url,
            profileUrl: data.user.html_url,
        },
        body: data.body,
        state: data.state,
        submittedAt: data.submitted_at,
        commitId: data.commit_id,
        htmlUrl: data.html_url,
        authorAssociation: data.author_association,
    };
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.createPRReview;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            prNumber: z.number().min(1).describe(toolConfig.parameters.find(p => p.name === 'prNumber')?.techDescription || ''),
            event: z.enum(['APPROVE', 'REQUEST_CHANGES', 'COMMENT', 'PENDING']).optional().describe(toolConfig.parameters.find(p => p.name === 'event')?.techDescription || ''),
            body: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'body')?.techDescription || ''),
            commitId: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'commitId')?.techDescription || ''),
        },
        async ({owner, repository, prNumber, event, body, commitId}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            if (event && (event === 'REQUEST_CHANGES' || event === 'COMMENT') && !body) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: Review body is required when event is "${event}". Please provide a body parameter with your review comment`,
                        },
                    ],
                };
            }

            try {
                const review = await createPullRequestReview(accessToken, owner, repository, prNumber, event, body, commitId);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(review, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                const errorDetails = error.response?.data ? JSON.stringify(error.response.data, null, 2) : 'No additional error details';
                const fullError = `Failed to create pull request review: ${error.message}\nAPI Response: ${errorDetails}`;

                sendError(transport, new Error(fullError), tools.createPRReview.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to create pull request review ❌: ${error.message}\n\nDetails: ${errorDetails}`,
                        },
                    ],
                };
            }
        },
    );
}
