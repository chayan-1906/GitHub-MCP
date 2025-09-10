import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { tools } from "../../../utils/constants";
import { transport } from "../../../server";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const updateRepository = async (accessToken: string, owner: string, repository: string, description?: string, tags?: string[]) => {
    if (description) {
        await axios.patch(
            apis.updateRepositoryApi(owner, repository),
            {description},
            buildHeader(accessToken),
        );
    }

    if (tags && tags.length > 0) {
        await axios.put(
            `${apis.updateRepositoryApi(owner, repository)}/topics`,
            {names: tags},
            {
                ...buildHeader(accessToken),
                headers: {
                    ...buildHeader(accessToken).headers,
                    Accept: "application/vnd.github.mercy-preview+json",
                },
            },
        );
    }
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.updateRepository;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            description: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'description')?.techDescription || ''),
            tags: z.array(z.string()).optional().describe(toolConfig.parameters.find(p => p.name === 'tags')?.techDescription || ''),
        },
        async ({owner, repository, description, tags}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                await updateRepository(accessToken, owner, repository, description, tags);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: `Repository ${repository} updated ✅`,
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to update repository: ${error}`), tools.updateRepository.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to update repository ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
