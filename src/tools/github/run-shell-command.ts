import {exec} from "child_process";
import {promisify} from "util";
import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {sendError} from "mcp-utils/utils";
import {transport} from "../../server";
import {tools} from "../../utils/constants";
import {getGitHubAccessToken} from "../../services/OAuth";

const execAsync = promisify(exec);

// NOT YET TESTED
const runShellCommand = async (command: string, cwd?: string) => {
    const opts = cwd ? {cwd} : {};
    const {stdout, stderr} = await execAsync(command, opts);
    return {stdout, stderr};
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.runShellCommand,
        'Executes a shell command on the server. Use carefully—this does not touch the GitHub API, but runs commands in the local environment',
        {
            command: z.string().describe('The exact shell command to run'),
            cwd: z.string().optional().describe('Working directory path (optional)'),
        },
        async ({command, cwd}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const {stdout, stderr} = await runShellCommand(command, cwd);

                return {
                    content: [
                        {type: 'text' as const, text: stdout || '(no output)'},
                        ...(stderr ? [{type: 'text' as const, text: `(stderr) ${stderr}`}] : []),
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to run shell command: ${error}`), tools.runShellCommand);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to run shell command ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
