import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../server";
import { PORT } from "../../config/config";
import { tools } from "../../utils/constants";
import { getDetailsFromSessionToken, getSessionTokenFromSessionFile } from "../../services/OAuth";

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.myGitHubAccount,
        'Retrieves details of the authenticated GitHub user, including username, display name, email (if available), avatar URL, and profile link',
        {},
        async ({}) => {
            const {sessionToken} = await getSessionTokenFromSessionFile() || {};
            if (!sessionToken) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Please authenticate first in this link "http://localhost:${PORT}/auth". 🔑`,
                        },
                    ],
                };
            }

            const myGitHubDetails = await getDetailsFromSessionToken();

            try {
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(myGitHubDetails, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to fetch my github account details: ${error}`), tools.myGitHubAccount);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to fetch my details ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
