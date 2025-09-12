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
    const toolConfig = tools.updatePR;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            prNumber: z.number().min(1).describe(toolConfig.parameters.find(p => p.name === 'prNumber')?.techDescription || ''),
            title: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'title')?.techDescription || ''),
            body: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'body')?.techDescription || ''),
            state: z.enum(['open', 'closed']).optional().describe(toolConfig.parameters.find(p => p.name === 'state')?.techDescription || ''),
            base: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'base')?.techDescription || ''),
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
                sendError(transport, new Error(`Failed to update pull request: ${error}`), tools.updatePR.name);
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
