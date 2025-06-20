import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {tools} from "../../utils/constants";
import {sendError} from "../../utils/sendError";
import {transport} from "../../server";
import axios from "axios";
import {apis, buildHeader} from "../../utils/apis";
import {getGitHubAccessToken} from "../../services/OAuth";
import {z} from "zod";

const listRepositories = async (accessToken: string, perPage: number, currentPage: number) => {
    const repositories = await axios.get(apis.listRepositoriesApi(perPage, currentPage), buildHeader(accessToken));

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
            perPage: z.number().min(1).max(60).default(30).describe('Maximum number of repositories to return per page (max: 60)'),
            currentPage: z.number().min(1).default(1).describe('Page number of the results to fetch. Start with 1 and increment this value in each call until the returned list is empty')
        },
        async ({perPage, currentPage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const repositories = await listRepositories(accessToken, perPage, currentPage);

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
