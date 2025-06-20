import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";
import {tools} from "../../utils/constants";
import {sendError} from "../../utils/sendError";
import {transport} from "../../server";
import axios from "axios";
import {apis, buildHeader} from "../../utils/apis";
import {getGitHubAccessToken} from "../../services/OAuth";

const addRemoveCollaborators = async (accessToken: string, owner: string, repository: string, targetUserName: string, action: 'add' | 'remove') => {
    if (action === 'add') {
        await axios.put(apis.addRemoveCollaborators(owner, repository, targetUserName), {}, buildHeader(accessToken));
        return {action: 'added', user: targetUserName};
    } else if (action === 'remove') {
        await axios.delete(apis.addRemoveCollaborators(owner, repository, targetUserName), buildHeader(accessToken));
        return {action: 'removed', user: targetUserName};
    }
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.addRemoveCollaborators,
        'Adds or removes a collaborator from a GitHub repository',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('Current name of the repository'),
            targetUserName: z.string().describe('GitHub username of the collaborator'),
            action: z.enum(['add', 'remove']).describe('Whether to add or remove the collaborator'),
        },
        async ({owner, repository, targetUserName, action}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const response = await addRemoveCollaborators(accessToken, owner, repository, targetUserName, action);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: action === 'add' ? `${response?.user} ${response?.action} to ${repository}` : `${response?.user} ${response?.action} from ${repository}`,
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to add or remove collaborators: ${error}`), tools.addRemoveCollaborators);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to add or remove collaborators ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}

// Remove pdas9647 from chayan-1906's MCP-test-repo