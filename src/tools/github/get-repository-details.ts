import {z} from "zod";
import axios from "axios";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {sendError} from "mcp-utils/utils";
import {tools} from "../../utils/constants";
import {transport} from "../../server";
import {RepositoryDetails} from "../../types";
import {apis, buildHeader} from "../../utils/apis";
import {getGitHubAccessToken} from "../../services/OAuth";

const getRepositoryDetails = async (accessToken: string, owner: string, repository: string) => {
    const repositoryDetailsResponse = await axios.get<RepositoryDetails>(apis.repositoryDetailsApi(owner, repository), buildHeader(accessToken));
    const repositoryMetadata = repositoryDetailsResponse.data || {};
    return repositoryMetadata;
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.getRepositoryDetails,
        'Fetches metadata of a GitHub repository (e.g., default branch, visibility, description, etc.). Useful before accessing files or commits from a repo',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub repository'),
        },
        async ({owner, repository}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const repositoryMetadata = await getRepositoryDetails(accessToken, owner, repository);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(repositoryMetadata, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to get the repository details: ${error}`), tools.getRepositoryDetails);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to get the repository details ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
