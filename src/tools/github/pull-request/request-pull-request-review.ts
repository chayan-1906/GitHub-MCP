import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { ReviewRequest } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const requestPullRequestReview = async (accessToken: string, owner: string, repository: string, prNumber: number, reviewers?: string[], teamReviewers?: string[]) => {
    const payload: {
        reviewers?: string[];
        team_reviewers?: string[];
    } = {};

    if (reviewers && reviewers.length > 0) payload.reviewers = reviewers;
    if (teamReviewers && teamReviewers.length > 0) payload.team_reviewers = teamReviewers;

    const {data} = await axios.post<ReviewRequest>(apis.requestPullRequestReviewApi(owner, repository, prNumber), payload, buildHeader(accessToken));

    return {
        requestedUsers: (data.users || []).map(({id, login, avatar_url, html_url}) => ({
            id,
            username: login,
            avatarUrl: avatar_url,
            profileUrl: html_url,
        })),
        requestedTeams: (data.teams || []).map(({id, name, slug}) => ({
            id, name, slug,
        })),
    };
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.requestPRReview;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            prNumber: z.number().min(1).describe(toolConfig.parameters.find(p => p.name === 'prNumber')?.techDescription || ''),
            reviewers: z.array(z.string()).optional().describe(toolConfig.parameters.find(p => p.name === 'reviewers')?.techDescription || ''),
            teamReviewers: z.array(z.string()).optional().describe(toolConfig.parameters.find(p => p.name === 'teamReviewers')?.techDescription || ''),
        },
        async ({owner, repository, prNumber, reviewers, teamReviewers}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            if ((!reviewers || reviewers.length === 0) && (!teamReviewers || teamReviewers.length === 0)) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Error: Must provide at least one reviewer or team reviewer. Please specify reviewers or teamReviewers parameter.',
                        },
                    ],
                };
            }

            try {
                const result = await requestPullRequestReview(accessToken, owner, repository, prNumber, reviewers, teamReviewers);

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
                const fullError = `Failed to request pull request review: ${error.message}\nAPI Response: ${errorDetails}`;

                sendError(transport, new Error(fullError), tools.requestPRReview.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to request pull request review ❌: ${error.message}\n\nDetails: ${errorDetails}`,
                        },
                    ],
                };
            }
        },
    );
}
