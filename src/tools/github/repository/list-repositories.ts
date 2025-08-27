import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { printInConsole, sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const listRepositories = async (accessToken: string, perPage: number, currentPage: number) => {
    const response = await axios.get(apis.listRepositoriesApi(perPage, currentPage), buildHeader(accessToken));

    await printInConsole(transport, `Response status: ${response.status}`);
    await printInConsole(transport, `Response data length: ${response.data.length}`);
    await printInConsole(transport, `Response headers Link: ${response.headers.link}`);

    return response.data.map((repository: any) => {
        const {name, full_name, description, private: isPrivate, html_url: url, visibility, owner} = repository;
        return ({name, full_name, description, isPrivate, url, visibility, owner: owner.login});
    });
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.listRepositories,
        'Fetches repositories user has access to. Calls repeatedly with increasing currentPage until result is empty',
        {
            perPage: z.number().min(1).max(60).default(30).describe('Repositories per page (max: 60)'),
            currentPage: z.number().min(1).default(1).describe('Page number'),
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
                sendError(transport, new Error(`Failed to list repositories: ${error}`), tools.listRepositories);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to list repositories ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
