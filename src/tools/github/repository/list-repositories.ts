import {z} from "zod";
import axios from "axios";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {sendError} from "mcp-utils/utils";
import {transport} from "../../../server";
import {tools} from "../../../utils/constants";
import {apis, buildHeader} from "../../../utils/apis";
import {getGitHubAccessToken} from "../../../services/OAuth";

const listRepositories = async (accessToken: string, owner: string | undefined, perPage: number, currentPage: number) => {
    const url = (!owner || owner === 'self') ?
        apis.listAuthRepositoriesApi(perPage, currentPage) :
        apis.listOwnerReposApi(owner, perPage, currentPage);

    const repositories = await axios.get(url, buildHeader(accessToken));

    return repositories.data.map((repository: any) => {
        const {name, full_name, description, private: isPrivate, html_url: url, visibility} = repository;
        return ({name, full_name, description, isPrivate, url, visibility});
    });
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.listRepositories,
        'Fetches repositories of the authenticated GitHub user. Calls repeatedly with increasing currentPage until the result is empty',
        {
            owner: z.string().optional().describe('GitHub username or organization. Omit or set "self" for the authenticated user'),
            perPage: z.number().min(1).max(60).default(30).describe('Maximum number of repositories to return per page (max: 60)'),
            currentPage: z.number().min(1).default(1).describe('Page number of the results to fetch. Start with 1 and increment this value in each call until the returned list is empty')
        },
        async ({owner, perPage, currentPage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const repositories = await listRepositories(accessToken, owner, perPage, currentPage);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(repositories, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to list out all repositories: ${error}`), tools.listRepositories);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to list out all repositories ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
