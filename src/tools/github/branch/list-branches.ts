import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const listBranches = async ( accessToken: string, owner: string, repository: string, perPage: number, currentPage: number ) => {
    const branches = await axios.get( apis.listAllBranchesApi( owner, repository, perPage, currentPage ), buildHeader( accessToken ) );

    return branches.data.map( ( branch: any ) => {
        const { name, commit, protected: isProtected } = branch;  // Note: commit.sha is the latest commit hash of the branch
        return ( { name, sha: commit.sha, isProtected } );
    } );
}

export const registerTool = ( server: McpServer ) => {
    server.tool(
        tools.listBranches,
        'Fetches branches of the authenticated user\'s repository. Calls repeatedly with increasing currentPage until the result is empty',
        {
            owner: z.string().describe( 'GitHub username or organization that owns the repository' ),
            repository: z.string().describe( 'The name of the GitHub Repository' ),
            perPage: z.number().min( 1 ).max( 60 ).default( 30 ).describe( 'Maximum number of repositories to return per page (max: 60)' ),
            currentPage: z.number().min( 1 ).default( 1 ).describe( 'Page number of the results to fetch. Start with 1 and increment this value in each call until the returned list is empty' )
        },
        async ( { owner, repository, perPage, currentPage } ) => {
            const { accessToken, response: { content } } = await getGitHubAccessToken();
            if ( !accessToken ) return { content };

            try {
                const branches = await listBranches( accessToken, owner, repository, perPage, currentPage );

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify( branches, null, 2 ),
                        },
                    ],
                };
            } catch ( error: any ) {
                sendError( transport, new Error( `Failed to list out all branches: ${ error }` ), tools.listBranches );
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to list out all branches ❌: ${ error.message }`,
                        },
                    ],
                };
            }
        },
    );
}
