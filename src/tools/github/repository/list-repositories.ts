import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { printInConsole, sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { RepositoryDetails } from "../../../types";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const listRepositories = async (accessToken: string, perPage: number, currentPage: number) => {
    const response = await axios.get<Partial<RepositoryDetails>[]>(apis.listRepositoriesApi(perPage, currentPage), buildHeader(accessToken));

    await printInConsole(transport, `Response status: ${response.status}`);
    await printInConsole(transport, `Response data length: ${response.data.length}`);
    await printInConsole(transport, `Response headers Link: ${response.headers.link}`);

    return response.data.map((repository: Partial<RepositoryDetails>) => {
        const {name, full_name, description, private: isPrivate, html_url: url, visibility, owner} = repository;
        return ({name, full_name, description, isPrivate, url, visibility, owner: owner ? owner.login : ''});
    });
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.listRepositories;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            perPage: z.number().min(1).max(60).default(30).describe(toolConfig.parameters.find(p => p.name === 'perPage')?.techDescription || ''),
            currentPage: z.number().min(1).default(1).describe(toolConfig.parameters.find(p => p.name === 'currentPage')?.techDescription || ''),
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
                sendError(transport, new Error(`Failed to list repositories: ${error}`), tools.listRepositories.name);
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
