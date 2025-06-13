import os from "os";
import path from "path";

export function getClaudeConfigDir(): string {
    const homeDir = os.homedir();
    const platform = os.platform();

    if (platform === 'darwin') {
        return path.join(homeDir, 'Library', 'Application Support', 'Claude');
    } else if (platform === 'win32') {
        return path.join(homeDir, 'AppData', 'Roaming', 'Claude');
    } else {
        const configHome = process.env.XDG_CONFIG_HOME || path.join(homeDir, '.config');
        return path.join(configHome, 'Claude');
    }
}
