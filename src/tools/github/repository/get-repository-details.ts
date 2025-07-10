import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { RepositoryDetails } from "../../../types";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const getRepositoryDetails = async (accessToken: string, owner: string, repository: string) => {
    try {
        const repositoryDetailsResponse = await axios.get<RepositoryDetails>(
            apis.repositoryDetailsApi(owner, repository),
            buildHeader(accessToken)
        );
        return repositoryDetailsResponse.data || {};
    } catch (error: any) {
        // Enhanced error handling for 403 responses
        if (error.response?.status === 403) {
            const errorMessage = error.response.data?.message || 'Access denied';
            throw new Error(`403 Forbidden: ${errorMessage}. Check if:
1. Repository exists and is public
2. User has access to organization repository
3. Token has required scopes (repo, read:org for private repos)
4. Organization allows member access`);
        }
        throw error;
    }
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
