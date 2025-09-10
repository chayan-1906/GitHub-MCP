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
            await axios.delete(apis.cancelInvitationApi(owner, repository, invitationId), buildHeader(accessToken));
            return {action: 'canceled-invitation', user: targetUserName};
        }

        // Accepted → remove collaborator
        await axios.delete(apis.addRemoveCollaboratorsApi(owner, repository, targetUserName), buildHeader(accessToken));
        return {action: 'removed', user: targetUserName};
    }
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.addRemoveCollaborators;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            targetUserName: z.string().describe(toolConfig.parameters.find(p => p.name === 'targetUserName')?.techDescription || ''),
            action: z.enum(['add', 'remove']).describe(toolConfig.parameters.find(p => p.name === 'action')?.techDescription || ''),
            status: z.enum(['accepted', 'pending']).optional().describe(toolConfig.parameters.find(p => p.name === 'status')?.techDescription || ''),
            invitationId: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'invitationId')?.techDescription || ''),
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
                sendError(transport, new Error(`Failed to add or remove collaborators: ${error}`), tools.addRemoveCollaborators.name);
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
