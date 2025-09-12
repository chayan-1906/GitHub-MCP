import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { MergeResponse, PullRequest } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const mergePullRequest = async (accessToken: string, owner: string, repository: string, prNumber: number, mergeMethod: string, commitTitle?: string, commitMessage?: string) => {
    const prDetails = await axios.get<PullRequest>(apis.getPullRequestDetailsApi(owner, repository, prNumber), buildHeader(accessToken));
    const {state, draft, mergeable} = prDetails.data;

    if (state !== 'open') {
        return {
            success: false,
            message: `Cannot merge: Pull request #${prNumber} is ${state}. Only open pull requests can be merged`,
            prNumber,
            status: state,
        };
    }

    if (draft) {
        return {
            success: false,
            message: `Cannot merge: Pull request #${prNumber} is still in draft mode. Convert to ready for review first`,
            prNumber,
            status: 'draft',
        };
    }

    if (mergeable === false) {
        return {
            success: false,
            message: `This pull request has merge conflicts that need to be resolved manually. Once conflicts are resolved, you can ask me to merge again`,
            prNumber,
            status: 'conflicts',
        };
    }

    if (mergeable === null || mergeable === undefined) {
        return {
            success: false,
            message: `GitHub is still computing the merge status for this pull request. Please try again in a few moments`,
            prNumber,
            status: 'computing',
        };
    }

    const payload: {
        merge_method: string;
        commit_title?: string;
        commit_message?: string;
    } = {merge_method: mergeMethod};

    if (commitTitle) payload.commit_title = commitTitle;
    if (commitMessage) payload.commit_message = commitMessage;

    const {data} = await axios.put<MergeResponse>(apis.mergePullRequestApi(owner, repository, prNumber), payload, buildHeader(accessToken));
    const {sha, merged} = data;

    return {
        success: true,
        message: `Pull request #${prNumber} merged successfully!`,
        prNumber,
        mergeSha: sha,
        merged: merged,
    };
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.mergePR;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            prNumber: z.number().min(1).describe(toolConfig.parameters.find(p => p.name === 'prNumber')?.techDescription || ''),
            mergeMethod: z.enum(['merge', 'squash', 'rebase']).default('merge').describe(toolConfig.parameters.find(p => p.name === 'mergeMethod')?.techDescription || ''),
            commitTitle: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'commitTitle')?.techDescription || ''),
            commitMessage: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'commitMessage')?.techDescription || ''),
        },
        async ({owner, repository, prNumber, mergeMethod, commitTitle, commitMessage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const result = await mergePullRequest(accessToken, owner, repository, prNumber, mergeMethod, commitTitle, commitMessage);

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
                const fullError = `Failed to merge pull request: ${error.message}\nAPI Response: ${errorDetails}\nEndpoint: ${apis.mergePullRequestApi(owner, repository, prNumber)}`;

                sendError(transport, new Error(fullError), tools.mergePR.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to merge pull request ❌: ${error.message}\n\nDetails: ${errorDetails}`,
                        },
                    ],
                };
            }
        },
    );
}
