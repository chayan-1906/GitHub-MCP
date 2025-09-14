import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { RepositoryDetails } from "../../../types";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const renameRepository = async (accessToken: string, owner: string, oldName: string, newName: string) => {
    const renameRepositoryResponse = await axios.patch<Partial<RepositoryDetails>>(apis.renameRepositoryApi(owner, oldName), {name: newName}, buildHeader(accessToken));
    const {name, html_url}: Partial<RepositoryDetails> = renameRepositoryResponse.data;

    return {oldName, newName: name, htmlUrl: html_url};
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.renameRepository;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            oldName: z.string().describe(toolConfig.parameters.find(p => p.name === 'oldName')?.techDescription || ''),
            newName: z.string().describe(toolConfig.parameters.find(p => p.name === 'newName')?.techDescription || ''),
        },
        async ({owner, oldName, newName}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const response = await renameRepository(accessToken, owner, oldName, newName);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: `Repository ${response} renamed from ${response.oldName} to ${response.newName} ✅\n🔗 ${response.htmlUrl}`,
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to rename repository: ${error}`), tools.renameRepository.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to rename repository ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
