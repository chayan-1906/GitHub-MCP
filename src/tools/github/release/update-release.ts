import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { Release } from "../../../types";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const updateRelease = async (accessToken: string, owner: string, repository: string, releaseId: number, tagName?: string, name?: string, body?: string, draft?: boolean, prerelease?: boolean, targetCommitish?: string) => {
    const payload: {
        tag_name?: string;
        name?: string;
        body?: string;
        draft?: boolean;
        prerelease?: boolean;
        target_commitish?: string;
    } = {};

    if (tagName) payload.tag_name = tagName;
    if (name) payload.name = name;
    if (body !== undefined) payload.body = body;
    if (draft !== undefined) payload.draft = draft;
    if (prerelease !== undefined) payload.prerelease = prerelease;
    if (targetCommitish) payload.target_commitish = targetCommitish;

    const {data} = await axios.patch<Partial<Release>>(apis.updateReleaseApi(owner, repository, releaseId), payload, buildHeader(accessToken));

    return {
        id: data.id,
        tagName: data.tag_name,
        name: data.name,
        body: data.body,
        draft: data.draft,
        prerelease: data.prerelease,
        htmlUrl: data.html_url,
        publishedAt: data.published_at,
        author: data.author?.login,
        tarballUrl: data.tarball_url,
        zipballUrl: data.zipball_url,
    };
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.updateRelease,
        'Updates an existing GitHub release by release ID with new information',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            releaseId: z.number().describe('The unique ID of the release to update'),
            tagName: z.string().optional().describe('The name of the tag (e.g., "v1.0.1")'),
            name: z.string().optional().describe('The name of the release'),
            body: z.string().optional().describe('Text describing the contents of the tag (release notes)'),
            draft: z.boolean().optional().describe('True to mark as draft (unpublished) release, false to publish'),
            prerelease: z.boolean().optional().describe('True to identify the release as a prerelease, false for full release'),
            targetCommitish: z.string().optional().describe('Specifies the commitish value that determines where the Git tag is created from'),
        },
        async ({owner, repository, releaseId, tagName, name, body, draft, prerelease, targetCommitish}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const release = await updateRelease(accessToken, owner, repository, releaseId, tagName, name, body, draft, prerelease, targetCommitish);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(release, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to update release: ${error}`), tools.updateRelease);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to update release ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
