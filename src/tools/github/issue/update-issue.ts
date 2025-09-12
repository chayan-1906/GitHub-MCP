import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { IssueDetails } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const updateIssue = async (accessToken: string, owner: string, repository: string, issueNumber: number, issueTitle: string, body?: string, labels?: string[]) => {
    const payload: {
        title?: string;
        body?: string;
        labels?: string[];
    } = {};
    if (issueTitle) payload.title = issueTitle;
    if (body) payload.body = body;
    if (labels?.length) payload.labels = labels;

    const {data} = await axios.patch<Partial<IssueDetails>>(apis.updateIssueApi(owner, repository, issueNumber), payload, buildHeader(accessToken));

    return {
        issueNumber: data.number,
        title: data.title,
        body: data.body,
        url: data.html_url,
        state: data.state,
    };
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.updateIssue;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            issueNumber: z.number().describe(toolConfig.parameters.find(p => p.name === 'issueNumber')?.techDescription || ''),
            issueTitle: z.string().describe(toolConfig.parameters.find(p => p.name === 'issueTitle')?.techDescription || ''),
            body: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'body')?.techDescription || ''),
            labels: z.array(z.string()).optional().describe(toolConfig.parameters.find(p => p.name === 'labels')?.techDescription || ''),
        },
        async ({owner, repository, issueNumber, issueTitle, body, labels}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const updatedIssue = await updateIssue(accessToken, owner, repository, issueNumber, issueTitle, body, labels);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(updatedIssue, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to update issue: ${error}`), tools.updateIssue.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to update issue ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
