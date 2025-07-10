import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const addRemoveCollaborators = async (accessToken: string, owner: string, repository: string, targetUserName: string, action: 'add' | 'remove', status?: 'accepted' | 'pending', invitationId?: string) => {
    if (action === 'add') {
        await axios.put(apis.addRemoveCollaboratorsApi(owner, repository, targetUserName), {}, buildHeader(accessToken));
        return {action: 'added', user: targetUserName};
    } else if (action === 'remove') {
        if (status === 'pending' && invitationId) {
            await axios.delete(apis.cancelInvitationsApi(owner, repository, invitationId), buildHeader(accessToken));
            return {action: 'canceled-invitation', user: targetUserName};
        }

        // Accepted → remove collaborator
        await axios.delete(apis.addRemoveCollaboratorsApi(owner, repository, targetUserName), buildHeader(accessToken));
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
            status: z.enum(['accepted', 'pending']).optional().describe('Required only to remove a user - "accepted" to remove an existing collaborator, "pending" to cancel an invitation'),
            invitationId: z.string().optional().describe('Required to cancel a pending invitation — the unique invitation ID'),
        },
        async ({owner, repository, targetUserName, invitationId, action, status}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const response = await addRemoveCollaborators(accessToken, owner, repository, targetUserName, action, status, invitationId);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: action === 'add' ? `${response?.user} ${response?.action} to ${repository} ✅` : `${response?.user} removed from ${repository} ✅`,
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
