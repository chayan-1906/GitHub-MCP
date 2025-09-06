import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { PullRequest } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const updatePullRequestState = async (accessToken: string, owner: string, repository: string, prNumber: number, state: string) => {
    const {data} = await axios.patch<Partial<PullRequest>>(apis.updatePullRequestStateApi(owner, repository, prNumber), {state}, buildHeader(accessToken));

    return {
        repository: `${owner}/${repository}`,
        prNumber,
        status: data.state,
        title: data.title,
        url: data.html_url,
    };
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.updatePRState,
        'Updates the state of a GitHub pull request - can close or reopen PRs by PR number',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            prNumber: z.number().min(1).describe('Pull request number to update'),
            state: z.enum(['open', 'closed']).describe("Set to 'open' to reopen or 'closed' to close the pull request"),
        },
        async ({owner, repository, prNumber, state}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const updatedPR = await updatePullRequestState(accessToken, owner, repository, prNumber, state);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(updatedPR, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to update the pull request state: ${error}`), tools.updatePRState);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to update the pull request state ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
