import {z} from "zod";
import axios from "axios";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {sendError} from "mcp-utils/utils";
import {transport} from "../../../server";
import {tools} from "../../../utils/constants";
import {apis, buildHeader} from "../../../utils/apis";
import {getGitHubAccessToken} from "../../../services/OAuth";

const getBranchDetails = async (accessToken: string, owner: string, repository: string, branch: string) => {
    const getBranchDetailsResponse = await axios.get(apis.getBranchDetailsApi(owner, repository, branch), buildHeader(accessToken));
    return getBranchDetailsResponse.data;
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.getBranchDetails,
        'Fetches details of a specific branch in a GitHub repository',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            branch: z.string().describe('Branch name to get details for'),
        },
        async ({owner, repository, branch}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const branchDetails = await getBranchDetails(accessToken, owner, repository, branch);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(branchDetails, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to get branch details: ${error}`), tools.getBranchDetails);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to get branch details ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
