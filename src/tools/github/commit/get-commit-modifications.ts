import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const getCommitModifications = async (accessToken: string, owner: string, repository: string, commitSha: string) => {
    const commit = await axios.get(apis.commitDetailsApi(owner, repository, commitSha), buildHeader(accessToken));

    return commit.data.files.map((file: any) => file.filename);
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.getCommitModifications,
        'Returns the list of files modified in a specific GitHub commit',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            commitSha: z.string().describe('Commit SHA to inspect'),
        },
        async ({owner, repository, commitSha}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const commitDetails = await getCommitModifications(accessToken, owner, repository, commitSha);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(commitDetails, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to get commit modifications: ${error}`), tools.getCommitModifications);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to get commit modifications ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
