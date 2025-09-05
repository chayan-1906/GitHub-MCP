import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { PullRequest } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const updatePullRequest = async (accessToken: string, owner: string, repository: string, prNumber: number, title?: string, body?: string, state?: string, base?: string) => {
    const payload: {
        title?: string;
        body?: string;
        state?: string;
        base?: string;
        assignees?: string[];
        labels?: string[];
    } = {};

    if (title) payload.title = title;
    if (body !== undefined) payload.body = body;
    if (state) payload.state = state;
    if (base) payload.base = base;

    const {
        data: {
            id,
            number,
            title: prTitle,
            body: prBody,
            state: prState,
            draft,
            html_url,
            diff_url,
            patch_url,
            created_at,
            updated_at,
            closed_at,
            merged_at,
            user,
            head,
            base: prBase,
            merged,
            commits,
            additions,
            deletions,
            changed_files,
        }
    } = await axios.patch<Partial<PullRequest>>(apis.updatePullRequestApi(owner, repository, prNumber), payload, buildHeader(accessToken));

    return {
        id,
        number,
        title: prTitle,
        body: prBody,
        state: prState,
        draft,
        htmlUrl: html_url,
        diffUrl: diff_url,
        patchUrl: patch_url,
        createdAt: created_at,
        updatedAt: updated_at,
        closedAt: closed_at,
        mergedAt: merged_at,
        author: user ? user.login : null,
        headBranch: head ? head.ref : '',
        baseBranch: prBase ? prBase.ref : '',
        headRepo: head ? head.repo?.full_name : '',
        baseRepo: prBase ? prBase.repo.full_name : '',
        merged,
        commits,
        additions,
        deletions,
        changedFiles: changed_files,
    };
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.updatePR,
        'Updates an existing pull request. Can modify title, body, state, base branch, and labels',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            prNumber: z.number().min(1).describe('Pull request number to update'),
            title: z.string().optional().describe('New title for the pull request'),
            body: z.string().optional().describe('New body/description for the pull request. Can include markdown formatting'),
            state: z.enum(['open', 'closed']).optional().describe('Change the state of the pull request (open or closed)'),
            base: z.string().optional().describe('Change the base branch that the PR targets (use with caution)'),
        },
        async ({owner, repository, prNumber, title, body, state, base}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const pullRequest = await updatePullRequest(accessToken, owner, repository, prNumber, title, body, state, base);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(pullRequest, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to update pull request: ${error}`), tools.updatePR);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to update pull request ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
