import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { IssueDetails } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const updateIssueState = async (accessToken: string, owner: string, repository: string, issueNumber: number, state: string) => {
    const {data} = await axios.patch<Partial<IssueDetails>>(apis.closeIssueApi(owner, repository, issueNumber), {state}, buildHeader(accessToken));

    return {
        repository: `${owner}/${repository}`,
        issueNumber,
        status: data.state,
        title: data.title,
        url: data.html_url,
    };
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.updateIssueState;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            issueNumber: z.number().describe(toolConfig.parameters.find(p => p.name === 'issueNumber')?.techDescription || ''),
            state: z.enum(['open', 'closed']).describe(toolConfig.parameters.find(p => p.name === 'state')?.techDescription || ''),
        },
        async ({owner, repository, issueNumber, state}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const updatedIssue = await updateIssueState(accessToken, owner, repository, issueNumber, state);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(updatedIssue, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to update the issue state: ${error}`), tools.updateIssueState.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to update the issue state ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
