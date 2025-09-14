import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { IssueDetails } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const assignIssue = async (accessToken: string, owner: string, repository: string, issueNumber: number, assignees: string[]) => {
    const {data} = await axios.post<Partial<IssueDetails>>(apis.assignIssueApi(owner, repository, issueNumber), {assignees}, buildHeader(accessToken));

    return {
        repository: `${owner}/${repository}`,
        issueNumber,
        title: data.title,
        issueUrl: data.html_url,
        assignees: (data?.assignees && data.assignees.length) ? data.assignees.map(user => user.login) : [],
    };
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.assignIssue;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            issueNumber: z.number().describe(toolConfig.parameters.find(p => p.name === 'issueNumber')?.techDescription || ''),
            assignees: z.array(z.string()).nonempty().describe(toolConfig.parameters.find(p => p.name === 'assignees')?.techDescription || ''),
        },
        async ({owner, repository, issueNumber, assignees}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const assignedIssue = await assignIssue(accessToken, owner, repository, issueNumber, assignees);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(assignedIssue, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to assign issue: ${error}`), tools.assignIssue.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to assign issue ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
