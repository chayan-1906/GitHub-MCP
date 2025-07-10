import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const updateIssue = async (accessToken: string, owner: string, repository: string, issueNumber: number, title: string, body?: string, labels?: string[]) => {
    const payload: any = {};
    if (title) payload.title = title;
    if (body) payload.body = body;
    if (labels?.length) payload.labels = labels;

    const {data} = await axios.patch(apis.updateIssueApi(owner, repository, issueNumber), payload, buildHeader(accessToken));

    return {
        issueNumber: data.number,
        title: data.title,
        body: data.body,
        url: data.html_url,
        state: data.state,
    };
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.updateIssue,
        'Updates the title and/or body of an existing GitHub issue',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            issueNumber: z.number().describe('Issue number to update'),
            title: z.string().describe('Title of the issue'),
            body: z.string().optional().describe('Body/description of the issue'),
            labels: z.array(z.string()).optional().describe('Labels to associate with the issue'),
        },
        async ({owner, repository, issueNumber, title, body, labels}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const updatedIssue = await updateIssue(accessToken, owner, repository, issueNumber, title, body, labels);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(updatedIssue, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to update issue: ${error}`), tools.updateIssue);
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
