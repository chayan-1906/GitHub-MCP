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
    server.tool(
        tools.createIssue,
        'Creates a new issue in a GitHub repository. Including body and labels is optional',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            issueTitle: z.string().describe('Title of the issue'),
            body: z.string().optional().describe('Body/description of the issue'),
            labels: z.array(z.string()).optional().describe('Labels to associate with the issue'),
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
                sendError(transport, new Error(`Failed to create issue: ${error}`), tools.createIssue);
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
