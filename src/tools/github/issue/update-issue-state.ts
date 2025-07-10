import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const updateIssueState = async ( accessToken: string, owner: string, repository: string, issueNumber: number, state: string ) => {
    const { data } = await axios.patch( apis.closeIssueApi( owner, repository, issueNumber ), { state }, buildHeader( accessToken ) );

    return {
        repository: `${ owner }/${ repository }`,
        issueNumber,
        status: data.state,
        title: data.title,
        url: data.html_url,
    };
}

export const registerTool = ( server: McpServer ) => {
    server.tool(
        tools.updateIssueState,
        'Updates the state of a GitHub issue (open or closed) by issue number',
        {
            owner: z.string().describe( 'GitHub username or organization that owns the repository' ),
            repository: z.string().describe( 'The name of the GitHub Repository' ),
            issueNumber: z.number().describe( 'Issue number to close' ),
            state: z.enum( [ 'open', 'closed' ] ).describe( "Set to 'open' to reopen or 'closed' to close the issue" ),
        },
        async ( { owner, repository, issueNumber, state } ) => {
            const { accessToken, response: { content } } = await getGitHubAccessToken();
            if ( !accessToken ) return { content };

            try {
                const updatedIssue = await updateIssueState( accessToken, owner, repository, issueNumber, state );

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify( updatedIssue, null, 2 ),
                        },
                    ],
                };
            } catch ( error: any ) {
                sendError( transport, new Error( `Failed to update the issue state: ${ error }` ), tools.updateIssueState );
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to update the issue state ❌: ${ error.message }`,
                        },
                    ],
                };
            }
        },
    );
}
