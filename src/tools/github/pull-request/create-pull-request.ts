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
    const toolConfig = tools.createPR;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            title: z.string().describe(toolConfig.parameters.find(p => p.name === 'title')?.techDescription || ''),
            head: z.string().describe(toolConfig.parameters.find(p => p.name === 'head')?.techDescription || ''),
            base: z.string().describe(toolConfig.parameters.find(p => p.name === 'base')?.techDescription || ''),
            body: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'body')?.techDescription || ''),
            draft: z.boolean().optional().describe(toolConfig.parameters.find(p => p.name === 'draft')?.techDescription || ''),
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
                sendError(transport, new Error(`Failed to create pull request: ${error}`), tools.createPR.name);
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
