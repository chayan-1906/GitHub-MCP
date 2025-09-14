import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { CommitFile, GitCommit } from "../../../types";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const getCommitModifications = async (accessToken: string, owner: string, repository: string, commitSha: string) => {
    const commit = await axios.get<GitCommit>(apis.commitDetailsApi(owner, repository, commitSha), buildHeader(accessToken));

    return commit.data.files.map(({filename, status, additions, deletions, changes, patch}: CommitFile) => ({
        filename, status, additions, deletions, changes, patch
    }));
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.getCommitModifications;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            commitSha: z.string().describe(toolConfig.parameters.find(p => p.name === 'commitSha')?.techDescription || ''),
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
                sendError(transport, new Error(`Failed to get commit modifications: ${error}`), tools.getCommitModifications.name);
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
