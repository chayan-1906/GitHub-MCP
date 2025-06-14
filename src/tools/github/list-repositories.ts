import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {tools} from "../../utils/constants";
import {sendError} from "../../utils/sendError";
import {transport} from "../../server";
import axios from "axios";
import {apis, buildHeader} from "../../utils/apis";
import {getGitHubAccessToken} from "../../services/OAuth";

const listRepositories = async (accessToken: string) => {
    const repositories = await axios.get(apis.listRepositories, buildHeader(accessToken));

    return repositories.data.map((repository: any) => {
        const {name, full_name, description, private: isPrivate, html_url: url, visibility} = repository;
        return ({name, full_name, description, isPrivate, url, visibility});
    });
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.listRepositories,
        'Fetches and displays all repositories (public & private) of the authenticated GitHub user, including name, visibility, and description',
        {},
        async ({}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const repositories = await listRepositories(accessToken);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(repositories, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to list out all repositories: ${error}`), 'list-repositories');
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
