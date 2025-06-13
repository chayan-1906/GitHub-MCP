import {printInConsole} from "./printInConsole";
import {PORT} from "../config/config";
import {promisify} from "util";
import {exec} from "child_process";
import {sendError} from "./sendError";
import {transport} from "../server";

const sleep = async (ms: number) => {
    await printInConsole(transport, 'Sleep start');
    await new Promise(resolve => setTimeout(resolve, ms));
    await printInConsole(transport, 'Sleep end');
}

async function killPortOnLaunch() {
    await printInConsole(transport, `Attempting to kill port ${PORT}`);
    const execAsync = promisify(exec);
    const platform = process.platform;

    try {
        let pids: string[] = [];
        if (platform === 'win32') {
            try {
                const {stdout} = await execAsync(`netstat -ano | findstr :${PORT}`);
                const lines = stdout.trim().split('\n');
                const pidSet = new Set<string>();
                for (const line of lines) {
                    const parts = line.trim().split(/\s+/);
                    const pid = parts[parts.length - 1];
                    if (pid && pid !== '0' && !isNaN(parseInt(pid))) {
                        pidSet.add(pid);
                    }
                }
                pids = [...pidSet];
            } catch (findError) {
                // No processes found using the port
                pids = [];
            }
        } else {
            const {stdout} = await execAsync(`lsof -ti:${PORT} || true`);
            pids = stdout.trim().split('\n').filter(Boolean);
        }
        await printInConsole(transport, `Found PIDs: ${pids.join(', ')}, #of pids: ${pids.length}`);

        if (!pids.length || pids.length === 0) {
            await printInConsole(transport, `No process using port ${PORT}`);
        } else {
            for (const pid of pids) {
                if (pid === '0') continue; // Skip system process
                const killCmd = platform === 'win32' ? `taskkill /F /PID ${pid}` : `kill -9 ${pid}`;
                await execAsync(killCmd);
                await printInConsole(transport, `Killed PID ${pid}`);
            }

            await sleep(1000);
            await printInConsole(transport, `Port ${PORT} is now freed`);
        }
    } catch (error: any) {
        if (error.code === 123) {
            await printInConsole(transport, `Port ${PORT} is not in use`);
        } else {
            sendError(transport, error instanceof Error ? error : new Error(`Error killing port ${PORT}: ${error.message}`), 'port-killing');
        }
    }
}

async function freezePortOnQuit() {
    const claudePpid = process.ppid;
    setInterval(() => {
        try {
            // “signal 0” just tests existence
            process.kill(claudePpid, 0);
        } catch {
            sendError(transport, Error('Parent (Claude) no longer exists → exiting'), 'transport-close');
            process.exit(0);
        }
    }, 2000);
}

export {killPortOnLaunch, freezePortOnQuit}
