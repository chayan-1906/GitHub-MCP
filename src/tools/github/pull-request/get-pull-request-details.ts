import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { PullRequest } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const getPullRequestDetails = async (accessToken: string, owner: string, repository: string, prNumber: number) => {
    const response = await axios.get<PullRequest>(apis.getPullRequestDetailsApi(owner, repository, prNumber), buildHeader(accessToken));
    const pr: PullRequest = response.data;

    return {
        id: pr.id,
        number: pr.number,
        title: pr.title,
        body: pr.body || null,
        state: pr.state,
        draft: pr.draft,
        createdAt: pr.created_at,
        updatedAt: pr.updated_at,
        closedAt: pr.closed_at || null,
        mergedAt: pr.merged_at || null,
        author: {
            username: pr.user.login,
            id: pr.user.id,
            avatarUrl: pr.user.avatar_url,
            profileUrl: pr.user.html_url,
        },
        assignee: pr.assignee ? {
            username: pr.assignee.login,
            id: pr.assignee.id,
            avatarUrl: pr.assignee.avatar_url,
            profileUrl: pr.assignee.html_url,
        } : null,
        assignees: pr.assignees.map(assignee => ({
            username: assignee.login,
            id: assignee.id,
            avatarUrl: assignee.avatar_url,
            profileUrl: assignee.html_url,
        })),
        labels: pr.labels.map(label => ({
            id: label.id,
            name: label.name,
            color: label.color,
            description: label.description || null,
        })),
        headBranch: pr.head.ref,
        headSha: pr.head.sha,
        headRepo: pr.head.repo?.full_name || null,
        baseBranch: pr.base.ref,
        baseSha: pr.base.sha,
        baseRepo: pr.base.repo.full_name,
        merged: pr.merged,
        mergeable: pr.mergeable || null,
        commits: pr.commits,
        additions: pr.additions,
        deletions: pr.deletions,
        changedFiles: pr.changed_files,
        htmlUrl: pr.html_url,
        diffUrl: pr.diff_url,
        patchUrl: pr.patch_url,
    };
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.getPRDetails;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            prNumber: z.number().min(1).describe(toolConfig.parameters.find(p => p.name === 'prNumber')?.techDescription || ''),
        },
        async ({owner, repository, prNumber}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const pullRequestDetails = await getPullRequestDetails(accessToken, owner, repository, prNumber);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(pullRequestDetails, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to fetch pull request details: ${error}`), tools.getPRDetails.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to fetch pull request details ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
