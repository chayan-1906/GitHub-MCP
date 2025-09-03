import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { Release } from "../../../types";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const createRelease = async (accessToken: string, owner: string, repository: string, tagName: string, name?: string, body?: string, draft?: boolean, prerelease?: boolean, targetCommitish?: string) => {
    const payload: {
        tag_name: string;
        name: string;
        body: string;
        draft: boolean;
        prerelease: boolean;
        target_commitish?: string;
    } = {
        tag_name: tagName,
        name: name || tagName,
        body: body || "",
        draft: draft ?? false,
        prerelease: prerelease ?? false,
    };

    if (targetCommitish) {
        payload.target_commitish = targetCommitish;
    }

    const {data} = await axios.post<Partial<Release>>(apis.createReleaseApi(owner, repository), payload, buildHeader(accessToken));

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
        tools.createRelease,
        'Creates a GitHub release from an existing tag or creates a new tag and release',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            tagName: z.string().describe('The name of the tag (e.g., "v1.0.0")'),
            name: z.string().optional().describe('The name of the release (defaults to tag name)'),
            body: z.string().optional().describe('Text describing the contents of the tag (release notes)'),
            draft: z.boolean().optional().describe('True to create a draft (unpublished) release, false to create a published one (default: false)'),
            prerelease: z.boolean().optional().describe('True to identify the release as a prerelease, false to identify as full release (default: false)'),
            targetCommitish: z.string().optional().describe('Specifies the commitish value that determines where the Git tag is created from (default: repository default branch)'),
        },
        async ({owner, repository, tagName, name, body, draft, prerelease, targetCommitish}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const release = await createRelease(accessToken, owner, repository, tagName, name, body, draft, prerelease, targetCommitish);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(release, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to create release: ${error}`), tools.createRelease);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to create release ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
