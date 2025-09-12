import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { PullRequestReview } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const getPullRequestReviews = async (accessToken: string, owner: string, repository: string, prNumber: number, perPage: number, currentPage: number) => {
    const reviews = await axios.get<PullRequestReview[]>(apis.getPullRequestReviewsApi(owner, repository, prNumber, perPage, currentPage), buildHeader(accessToken));

    return reviews.data.map(({
                                 id,
                                 user,
                                 body,
                                 state,
                                 submitted_at,
                                 commit_id,
                                 html_url,
                                 author_association,
                                 pull_request_url,
                             }: PullRequestReview) => ({
        id,
        reviewer: {
            username: user.login,
            id: user.id,
            avatarUrl: user.avatar_url,
            profileUrl: user.html_url,
        },
        body,
        state,
        submittedAt: submitted_at,
        commitId: commit_id,
        htmlUrl: html_url,
        authorAssociation: author_association,
        url: pull_request_url,
    }));
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.getPRReviews;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            prNumber: z.number().min(1).describe(toolConfig.parameters.find(p => p.name === 'prNumber')?.techDescription || ''),
            perPage: z.number().min(1).max(100).default(30).describe(toolConfig.parameters.find(p => p.name === 'perPage')?.techDescription || ''),
            currentPage: z.number().min(1).default(1).describe(toolConfig.parameters.find(p => p.name === 'currentPage')?.techDescription || ''),
        },
        async ({owner, repository, prNumber, perPage, currentPage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const reviews = await getPullRequestReviews(accessToken, owner, repository, prNumber, perPage, currentPage);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(reviews, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                const errorDetails = error.response?.data ? JSON.stringify(error.response.data, null, 2) : 'No additional error details';
                const fullError = `Failed to get pull request reviews: ${error.message}\nAPI Response: ${errorDetails}`;

                sendError(transport, new Error(fullError), tools.getPRReviews.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to get pull request reviews ❌: ${error.message}\n\nDetails: ${errorDetails}`,
                        },
                    ],
                };
            }
        },
    );
}
