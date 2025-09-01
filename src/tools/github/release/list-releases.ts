import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const listReleases = async (accessToken: string, owner: string, repository: string, perPage: number, currentPage: number) => {
    const {data} = await axios.get(apis.listReleasesApi(owner, repository, perPage, currentPage), buildHeader(accessToken));

    return data.map((release: any) => ({
        id: release.id,
        tagName: release.tag_name,
        name: release.name,
        body: release.body,
        draft: release.draft,
        prerelease: release.prerelease,
        htmlUrl: release.html_url,
        publishedAt: release.published_at,
        createdAt: release.created_at,
        author: release.author?.login,
        tarballUrl: release.tarball_url,
        zipballUrl: release.zipball_url,
    }));
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.listReleases,
        'Fetches all releases in a GitHub repository, page by page',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            perPage: z.number().min(1).max(100).default(30).describe('Maximum number of releases to return per page (max: 100)'),
            currentPage: z.number().min(1).default(1).describe('Page number of the results to fetch. Start with 1 and increment until the returned list is empty'),
        },
        async ({owner, repository, perPage, currentPage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const releases = await listReleases(accessToken, owner, repository, perPage, currentPage);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(releases, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to get all releases: ${error}`), tools.listReleases);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to get all releases ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
