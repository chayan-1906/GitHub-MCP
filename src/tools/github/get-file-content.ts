import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";
import {tools} from "../../utils/constants";
import {sendError} from "../../utils/sendError";
import {transport} from "../../server";
import axios from "axios";
import {apis, buildHeader} from "../../utils/apis";
import {getGitHubAccessToken} from "../../services/OAuth";
import {GitHubContent} from "../../types";

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
    server.tool(
        tools.getFileContent,
        'Reads and returns the raw content of a specific file from a GitHub repository branch',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('GitHub repository name'),
            filePath: z.string().describe("Relative file path in the repository (e.g., 'src/index.js')"),
            branch: z.string().describe('Branch name'),
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
                sendError(transport, new Error(`Failed to get file content: ${error}`), tools.getFileContent);
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
