import {connect} from "../config/db";
import {transport} from "../server";
import {encryptToken} from "../utils/encryption";
import {v4 as uuidv4} from "uuid";
import path from "path";
import fs from "fs/promises";
import {printInConsole} from "../utils/printInConsole";
import {constants} from "../utils/constants";
import {getClaudeConfigDir} from "../utils/directory";

export async function saveGitHubToken(githubId: number, username: string, token: string) {
    const db = await connect(transport);
    const collection = db.collection('user_tokens');

    const encrypted = encryptToken(token);

    await collection.updateOne(
        {githubId},
        {
            $set: {
                githubId,
                username,
                token: encrypted,
                updatedAt: new Date(),
            },
        },
        {upsert: true}
    );
}

export async function generateAndSaveSessionToken(username: string): Promise<string> {
    const sessionToken = uuidv4();
    const db = await connect(transport);
    const collection = db.collection('sessions');
    await collection.updateOne(
        {username},
        {$set: {sessionToken, username}},
        {upsert: true},
    );

    return sessionToken;
}

export async function createClaudeFileAndStoreSession(sessionToken: string, username: string) {
    const claudeDir = getClaudeConfigDir();
    const tokenFilePath = path.join(claudeDir, constants.sessionTokenFile);
    await printInConsole(transport, `tokenFilePath: ${tokenFilePath}`);
    await fs.mkdir(path.dirname(tokenFilePath), {recursive: true});
    await printInConsole(transport, `${claudeDir} folder created`);
    await fs.writeFile(tokenFilePath, JSON.stringify({sessionToken, username}, null, 2), 'utf8');
    await printInConsole(transport, `session token has been added/updated in ${constants.sessionTokenFile}`);
}
