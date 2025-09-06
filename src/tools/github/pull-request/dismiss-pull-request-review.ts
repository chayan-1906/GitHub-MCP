import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { ReviewResponse } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const dismissPullRequestReview = async (accessToken: string, owner: string, repository: string, prNumber: number, reviewId: number, message: string) => {
    const payload = {message, event: "DISMISS"};

    const {data} = await axios.put<ReviewResponse>(apis.dismissPullRequestReviewApi(owner, repository, prNumber, reviewId), payload, buildHeader(accessToken));

    return {
        message: data.message,
        reviewId,
        dismissalMessage: message,
        success: true,
    };
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.dismissPRReview,
        'Dismisses a pull request review with a message explaining why it was dismissed',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            prNumber: z.number().min(1).describe('Pull request number containing the review to dismiss'),
            reviewId: z.number().min(1).describe('Review ID to dismiss (get this from get-pull-request-reviews)'),
            message: z.string().describe('Message explaining why the review is being dismissed'),
        },
        async ({owner, repository, prNumber, reviewId, message}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const result = await dismissPullRequestReview(accessToken, owner, repository, prNumber, reviewId, message);

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
                const fullError = `Failed to dismiss pull request review: ${error.message}\nAPI Response: ${errorDetails}`;

                sendError(transport, new Error(fullError), tools.dismissPRReview);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to dismiss pull request review ❌: ${error.message}\n\nDetails: ${errorDetails}`,
                        },
                    ],
                };
            }
        },
    );
}
