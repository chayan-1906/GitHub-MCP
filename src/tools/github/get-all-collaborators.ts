import {z} from "zod";
import axios from "axios";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {transport} from "../../server";
import {tools} from "../../utils/constants";
import {apis, buildHeader} from "../../utils/apis";
import {sendError} from "mcp-utils/utils";
import {getGitHubAccessToken} from "../../services/OAuth";

const getAllCollaborators = async (accessToken: string, owner: string, repository: string) => {
    const [collaboratorsResponse, invitationsResponse] = await Promise.all([
        axios.get(apis.getAllCollaboratorsApi(owner, repository), buildHeader(accessToken)),
        axios.get(apis.getAllInvitationsApi(owner, repository), buildHeader(accessToken)),
    ]);

    const collaborators = (collaboratorsResponse.data || []).map((collaborator: any) => ({
        username: collaborator.login,
        htmlUrl: collaborator.html_url,
        role: collaborator.permissions?.admin ? 'admin' : collaborator.permissions?.push ? 'write' : 'read',
        status: 'accepted' as const,
    }));

    const invitations = (invitationsResponse.data || []).map((invitation: any) => ({
        username: invitation.invitee?.login,
        htmlUrl: invitation.invitee?.html_url,
        role: invitation.permissions || 'write',
        status: 'pending' as const,
        invitationId: invitation.id,
    }));

    return [...collaborators, ...invitations];
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.getAllCollaborators,
        'Returns a combined list of accepted collaborators and pending invitations for a GitHub Repository, each marked with their status',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
        },
        async ({owner, repository}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const collabsInvites = await getAllCollaborators(accessToken, owner, repository);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(collabsInvites, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to fetch collaborators: ${error}`), tools.getAllCollaborators);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to fetch collaborators ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
