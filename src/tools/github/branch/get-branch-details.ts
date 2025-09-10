import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { BranchDetails } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const getBranchDetails = async (accessToken: string, owner: string, repository: string, branch: string) => {
    const getBranchDetailsResponse = await axios.get<BranchDetails>(apis.getBranchDetailsApi(owner, repository, branch), buildHeader(accessToken));
    return getBranchDetailsResponse.data;
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.getBranchDetails;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            branch: z.string().describe(toolConfig.parameters.find(p => p.name === 'branch')?.techDescription || ''),
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
                sendError(transport, new Error(`Failed to get branch details: ${error}`), tools.getBranchDetails.name);
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
