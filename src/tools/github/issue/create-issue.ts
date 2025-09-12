import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { IssueDetails } from "../../../types";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const createIssue = async (accessToken: string, owner: string, repository: string, issueTitle: string, body?: string, labels?: string[]) => {
    const payload: {
        title: string;
        body?: string;
        labels?: string[];
    } = {title: issueTitle};
    if (body) payload.body = body;
    if (labels?.length) payload.labels = labels;

    const {data} = await axios.post<IssueDetails>(apis.createIssueApi(owner, repository), payload, buildHeader(accessToken));

    return {
        issueNumber: data.number,
        title: data.title,
        url: data.html_url,
        state: data.state,
        labels: data.labels.map(label => label.name),
    };
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.createIssue;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            issueTitle: z.string().describe(toolConfig.parameters.find(p => p.name === 'issueTitle')?.techDescription || ''),
            body: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'body')?.techDescription || ''),
            labels: z.array(z.string()).optional().describe(toolConfig.parameters.find(p => p.name === 'labels')?.techDescription || ''),
        },
        async ({owner, repository, issueTitle, body, labels}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const createdIssue = await createIssue(accessToken, owner, repository, issueTitle, body, labels);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(createdIssue, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to create issue: ${error}`), tools.createIssue.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to create issue ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
