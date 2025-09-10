import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";
import { CreateRepositoryParams, RepositoryDetails } from "../../../types";

const createRepository = async (accessToken: string, options: CreateRepositoryParams) => {
    const {name, description, isPrivate, autoInit} = options;
    const createRepositoryResponse = await axios.post<Partial<RepositoryDetails>>(apis.createRepositoryApi(), {
        name,
        description,
        private: isPrivate ?? true,
        auto_init: autoInit ?? true,
    }, buildHeader(accessToken));
    const {
        name: repositoryName,
        full_name,
        private: isPrivateRepository,
        html_url
    }: Partial<RepositoryDetails> = createRepositoryResponse.data;

    return {
        name: repositoryName,
        fullName: full_name,
        isPrivate: isPrivateRepository,
        htmlUrl: html_url,
    };
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.createRepository;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            name: z.string().describe(toolConfig.parameters.find(p => p.name === 'name')?.techDescription || ''),
            description: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'description')?.techDescription || ''),
            private: z.boolean().optional().describe(toolConfig.parameters.find(p => p.name === 'private')?.techDescription || ''),
            autoInit: z.boolean().optional().describe(toolConfig.parameters.find(p => p.name === 'autoInit')?.techDescription || ''),
        },
        async ({name, description, private: isPrivate, autoInit}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const finalPrivate = isPrivate ?? true;
                const finalAutoInit = autoInit ?? false;
                const repository = await createRepository(accessToken, {
                    name,
                    description,
                    isPrivate: finalPrivate,
                    autoInit: finalAutoInit
                });

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(repository, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to create repository: ${error}`), tools.createRepository.name);
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
