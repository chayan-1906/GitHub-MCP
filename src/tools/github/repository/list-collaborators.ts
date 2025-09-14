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
    const toolConfig = tools.listCollaborators;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
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
                sendError(transport, new Error(`Failed to fetch collaborators: ${error}`), tools.listCollaborators.name);
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
