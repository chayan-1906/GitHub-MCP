import {z} from "zod";
import axios from "axios";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {sendError} from "mcp-utils/utils";
import {transport} from "../../../server";
import {tools} from "../../../utils/constants";
import {apis, buildHeader} from "../../../utils/apis";
import {getGitHubAccessToken} from "../../../services/OAuth";

const createBranch = async (accessToken: string, owner: string, repository: string, newBranch: string, sha: string, fromBranch?: string) => {
    await axios.post(`${apis.createBranchApi(owner, repository)}/git/refs`,
        {ref: `refs/heads/${newBranch}`, sha},
        buildHeader(accessToken),
    );

    return {
        repository: `${owner}/${repository}`,
        newBranch,
        fromBranch,
        url: `https://github.com/${owner}/${repository}/tree/${newBranch}`,
    };
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.createBranch,
        'Creates a new branch from a given commit SHA (usually the latest commit of an existing branch)',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            newBranch: z.string().describe('Name of the branch to create'),
            sha: z.string().describe('Commit SHA that the new branch should point to (base commit)'),
            fromBranch: z.string().optional().describe('Source branch name (optional, informational only)'),
        },
        async ({owner, repository, newBranch, sha, fromBranch}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const createdBranch = await createBranch(accessToken, owner, repository, newBranch, sha, fromBranch);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(createdBranch, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to create branch: ${error}`), tools.createBranch);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to create branch ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
