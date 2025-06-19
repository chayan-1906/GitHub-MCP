import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";
import {tools} from "../../utils/constants";
import {sendError} from "../../utils/sendError";
import {transport} from "../../server";
import axios from "axios";
import {apis, buildHeader} from "../../utils/apis";
import {getGitHubAccessToken} from "../../services/OAuth";
import {RepositoryDetails} from "../../types";

interface CreateRepoOptions {
    name: string;
    description?: string;
    isPrivate?: boolean;
    autoInit?: boolean;
}

const createRepository = async (accessToken: string, options: CreateRepoOptions) => {
    const {name, description, isPrivate, autoInit} = options;
    const createRepositoryResponse = await axios.post<RepositoryDetails>(apis.listRepositoriesApi, {
        name,
        description,
        private: isPrivate ?? true,
        auto_init: autoInit ?? false,
    }, buildHeader(accessToken));
    const createRepositoryResponseData = createRepositoryResponse.data;
    return {
        name: createRepositoryResponseData.name,
        fullName: createRepositoryResponseData.full_name,
        isPrivate: createRepositoryResponseData.private,
        htmlUrl: createRepositoryResponseData.html_url,
    };
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.createRepository,
        'Creates a new GitHub repository for the authenticated user with optional description, visibility, and initialization',
        {
            name: z.string().describe('Name of the repository to create'),
            description: z.string().optional().describe('Optional description for the repository'),
            private: z.boolean().optional().describe('Whether the repository should be private (default: true)'),
            autoInit: z.boolean().optional().describe('Whether to initialize the repository with a README (default: false)'),
        },
        async ({name, description, private: isPrivate, autoInit}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const finalPrivate = isPrivate ?? true;
                const finalAutoInit = autoInit ?? false;
                const repository = await createRepository(accessToken, {name, description, isPrivate: finalPrivate, autoInit: finalAutoInit});

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(repository, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to create repository: ${error}`), tools.createRepository);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to create repository ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
