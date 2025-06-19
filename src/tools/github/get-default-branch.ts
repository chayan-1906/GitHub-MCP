import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";
import {tools} from "../../utils/constants";
import {sendError} from "../../utils/sendError";
import {transport} from "../../server";
import axios from "axios";
import {apis, buildHeader} from "../../utils/apis";
import {getGitHubAccessToken} from "../../services/OAuth";
import {RepositoryDetails} from "../../types";

const getDefaultBranch = async (accessToken: string, username: string, repository: string) => {
    const repositoryDetailsResponse = await axios.get<RepositoryDetails>(apis.repositoryDetailsApi(username, repository), buildHeader(accessToken));
    const {default_branch} = repositoryDetailsResponse.data || {};
    return default_branch;
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.getDefaultBranch,
        'Retrieves the default branch name (e.g., main, master, dev) of a specified GitHub repository. Useful before accessing files or commits from a repo',
        {
            username: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub repository'),
        },
        async ({username, repository}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const defaultBranch = await getDefaultBranch(accessToken, username, repository);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: defaultBranch,
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to get the default branch: ${error}`), tools.getDefaultBranch);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to get the default branch ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
