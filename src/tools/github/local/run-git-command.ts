import {exec} from "child_process";
import {promisify} from "util";
import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {sendError} from "mcp-utils/utils";
import {transport} from "../../../server";
import {tools} from "../../../utils/constants";

const execAsync = promisify(exec);

const runGitCommand = async (command: string, repoPath: string) => {
    // Validate git command
    if (!command.trim().startsWith('git')) {
        throw new Error('Only git commands allowed');
    }

    const {stdout, stderr} = await execAsync(command, {cwd: repoPath});
    return {stdout, stderr};
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.runGitCommand,
        'Runs a Git command in local machine',
        {
            command: z.string().describe('Git command to execute (must start with "git")'),
            repoPath: z.string().describe('Local repository path (working directory). MUST be in fs-mcp allowed directories. Call get-allowed-directories first to verify access'),
        },
        async ({command, repoPath}) => {
            try {
                const {stdout, stderr} = await runGitCommand(command, repoPath);

                return {
                    content: [
                        {type: 'text' as const, text: stdout || '(no output)'},
                        ...(stderr ? [{type: 'text' as const, text: `(stderr) ${stderr}`}] : []),
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to run git command: ${error}`), tools.runGitCommand);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to run git command ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
