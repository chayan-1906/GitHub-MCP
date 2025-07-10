import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const assignIssue = async ( accessToken: string, owner: string, repository: string, issueNumber: number, assignees: string[] ) => {
    const { data } = await axios.post( apis.assignIssueApi( owner, repository, issueNumber ), { assignees }, buildHeader( accessToken ) );

    return {
        repository: `${ owner }/${ repository }`,
        issueNumber,
        title: data.title,
        issueUrl: data.html_url,
        assignees: data.assignees.map( ( user: any ) => user.login ),
    };
}

export const registerTool = ( server: McpServer ) => {
    server.tool(
        tools.assignIssue,
        'Assigns one or more GitHub users to a GitHub issue',
        {
            owner: z.string().describe( 'GitHub username or organization that owns the repository' ),
            repository: z.string().describe( 'The name of the GitHub Repository' ),
            issueNumber: z.number().describe( 'The issue number to assign users to' ),
            assignees: z.array( z.string() ).nonempty().describe( 'List of GitHub usernames to assign to the issue' ),
        },
        async ( { owner, repository, issueNumber, assignees } ) => {
            const { accessToken, response: { content } } = await getGitHubAccessToken();
            if ( !accessToken ) return { content };

            try {
                const assignedIssue = await assignIssue( accessToken, owner, repository, issueNumber, assignees );

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify( assignedIssue, null, 2 ),
                        },
                    ],
                };
            } catch ( error: any ) {
                sendError( transport, new Error( `Failed to assign issue: ${ error }` ), tools.assignIssue );
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to assign issue ❌: ${ error.message }`,
                        },
                    ],
                };
            }
        },
    );
}
