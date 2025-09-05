import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { PullRequest } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const createPullRequest = async (accessToken: string, owner: string, repository: string, title: string, head: string, base: string, body?: string, draft?: boolean) => {
    const payload: {
        title: string;
        head: string;
        base: string;
        body?: string;
        draft?: boolean;
    } = {title, head, base};

    if (body) payload.body = body;
    if (draft !== undefined) payload.draft = draft;

    const {
        data: {
            id,
            number,
            title: prTitle,
            body: prBody,
            state: prState,
            draft: prDraft,
            html_url,
            diff_url,
            patch_url,
            created_at,
            updated_at,
            closed_at,
            merged_at,
            user,
            assignees: prAssignees,
            labels: prLabels,
            head: prHead,
            base: prBase,
            merged,
            commits,
            additions,
            deletions,
            changed_files,
        }
    } = await axios.post<Partial<PullRequest>>(apis.createPullRequestApi(owner, repository), payload, buildHeader(accessToken));

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
        author: user ? user.login : null,
        headBranch: prHead ? prHead.ref : '',
        baseBranch: prBase ? prBase.ref : '',
        headRepo: prHead ? prHead.repo?.full_name : '',
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
        tools.createPR,
        'Creates a new pull request in a GitHub repository. Compares changes between two branches and creates a PR for review',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            title: z.string().describe('Title of the pull request'),
            head: z.string().describe('The name of the branch where your changes are implemented (source branch)'),
            base: z.string().describe('The name of the branch you want the changes pulled into (target branch)'),
            body: z.string().optional().describe('Body/description of the pull request. Can include markdown formatting'),
            draft: z.boolean().optional().describe('True to create a draft pull request (default: false). Draft PRs cannot be merged until marked as ready for review'),
        },
        async ({owner, repository, title, head, base, body, draft}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const pullRequest = await createPullRequest(accessToken, owner, repository, title, head, base, body, draft);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(pullRequest, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to create pull request: ${error}`), tools.createPR);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to create pull request ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
