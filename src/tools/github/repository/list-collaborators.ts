import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { Collaborator, Invitation } from "../../../types";
import { getGitHubAccessToken } from "../../../services/OAuth";

const listCollaborators = async (accessToken: string, owner: string, repository: string) => {
    const [collaboratorsResponse, invitationsResponse] = await Promise.all([
        axios.get<Collaborator[]>(apis.listCollaboratorsApi(owner, repository), buildHeader(accessToken)),
        axios.get<Invitation[]>(apis.listInvitationsApi(owner, repository), buildHeader(accessToken)),
    ]);

    const collaborators = (collaboratorsResponse.data || []).map(({login, html_url, permissions}: Collaborator) => ({
        username: login,
        htmlUrl: html_url,
        role: permissions?.admin ? 'admin' : permissions?.push ? 'write' : 'read',
        status: 'accepted' as const,
    }));

    const invitations = (invitationsResponse.data || []).map(({id, invitee, permissions}: Invitation) => ({
        invitationId: id,
        username: invitee?.login,
        htmlUrl: invitee?.html_url,
        role: permissions || 'write',
        status: 'pending' as const,
    }));

    return [...collaborators, ...invitations];
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.listCollaborators,
        'Returns a combined list of accepted collaborators and pending invitations for a GitHub Repository, each marked with their status',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
        },
        async ({owner, repository}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const collabsInvites = await listCollaborators(accessToken, owner, repository);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(collabsInvites, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to fetch collaborators: ${error}`), tools.listCollaborators);
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
