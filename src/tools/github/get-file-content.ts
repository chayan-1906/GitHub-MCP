import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../server";
import { GitHubContent } from "../../types";
import { tools } from "../../utils/constants";
import { apis, buildHeader } from "../../utils/apis";
import { getGitHubAccessToken } from "../../services/OAuth";

const getFileContent = async (accessToken: string, owner: string, repository: string, filePath: string, branch: string) => {
    const getFileContentResponse = await axios.get<GitHubContent>(apis.getFileContentApi(owner, repository, filePath, branch), buildHeader(accessToken));
    const {content, encoding} = getFileContentResponse.data || {};
    if (encoding === 'base64' && content) {
        return Buffer.from(content, 'base64').toString('utf8');
    } else {
        throw new Error(`Unsupported encoding: ${encoding}`);
    }
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.getFileContent;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            filePath: z.string().describe(toolConfig.parameters.find(p => p.name === 'filePath')?.techDescription || ''),
            branch: z.string().describe(toolConfig.parameters.find(p => p.name === 'branch')?.techDescription || ''),
        },
        async ({owner, repository, filePath, branch}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const fileContent = await getFileContent(accessToken, owner, repository, filePath, branch);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: fileContent,
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to get file content: ${error}`), tools.getFileContent.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to get file content ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
