import path from "path";
import axios from "axios";
import fs from "fs/promises";
import {v4 as uuidv4} from "uuid";
import {connect, decryptToken, encryptToken, getClaudeConfigDir, printInConsole} from "mcp-utils/utils";
import {transport} from "../server";
import {constants} from "../utils/constants";
import {DB_NAME, MONGODB_URI, PORT, TOKEN_SECRET} from "../config/config";

export async function saveGitHubToken(githubId: number, username: string, token: string) {
    const db = await connect(transport, MONGODB_URI, DB_NAME);
    const collection = db.collection('user_tokens');

    const encrypted = encryptToken(TOKEN_SECRET, token);

    await collection.updateOne(
        {githubId},
        {
            $set: {
                username,
                updatedAt: new Date(),
            },
            $push: {
                tokens: {
                    $each: [{value: encrypted, createdAt: new Date()}],
                    $slice: -4,
                },
            },
        },
        {upsert: true},
    );
}

export async function getDetailsFromSessionToken() {
    const {sessionToken} = (await getSessionTokenFromSessionFile()) || {};

    const db = await connect(transport, MONGODB_URI, DB_NAME);
    const sessions = db.collection('sessions');
    const session = await sessions.findOne(
        {'sessions.value': sessionToken},
        {projection: {username: 1}},
    );

    if (!session?.username) {
        return {
            response: {
                content: [{
                    type: 'text',
                    text: `Session not found or expired, please authenticate again at "http://localhost:${PORT}/auth". 🔑`,
                }],
            },
        };
    }

    try {
        const {data} = await axios.get(`https://api.github.com/users/${session.username}`);
        return {
            response: {
                content: [{
                    type: 'object',
                    data,
                }],
            },
        };
    } catch (error: any) {
        await printInConsole(transport, `Error fetching GitHub user: ${error.message}`);
        return {
            response: {
                content: [{
                    type: 'text',
                    text: 'Failed to fetch user details from GitHub ❌'
                }],
            },
        };
    }
}

export async function generateAndSaveSessionToken(githubId: string, username: string): Promise<string> {
    const sessionToken = uuidv4();
    const db = await connect(transport, MONGODB_URI, DB_NAME);
    const collection = db.collection('sessions');

    await collection.updateOne(
        {githubId},
        {
            $set: {username, updatedAt: new Date()},
            $push: {
                sessions: {
                    $each: [{value: sessionToken, createdAt: new Date()}],
                    $slice: -4,
                },
            },
        },
        {upsert: true},
    );

    return sessionToken;
}

export async function createClaudeFileAndStoreSession(sessionToken: string, githubId: string, username: string) {
    const claudeDir = getClaudeConfigDir();
    const tokenFilePath = path.join(claudeDir, constants.sessionTokenFile);
    await printInConsole(transport, `tokenFilePath: ${tokenFilePath}`);
    await fs.mkdir(path.dirname(tokenFilePath), {recursive: true});
    await printInConsole(transport, `${claudeDir} folder created`);
    await fs.writeFile(tokenFilePath, JSON.stringify({sessionToken, githubId, username}, null, 2), 'utf8');
    await printInConsole(transport, `session token has been added/updated in ${constants.sessionTokenFile}`);
}

export async function getSessionTokenFromSessionFile() {
    const filePath = path.join(getClaudeConfigDir(), constants.sessionTokenFile);

    try {
        const content = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(content);
        await printInConsole(transport, `data in OAuth.ts > getSessionTokenFromSessionFile: ${JSON.stringify(data, null, 2)}`);
        if (!content) {
            await printInConsole(transport, 'No content in OAuth.ts > getSessionTokenFromSessionFile');
            return {
                content: [
                    {
                        type: 'text',
                        text: `Please authenticate first in this link "http://localhost:${PORT}/auth". 🔑`,
                    },
                ],
            };
        }
        const {sessionToken, username} = data;
        await printInConsole(transport, `sessionToken, username in getUsernameFromSessionToken: ${sessionToken} ${username}`);
        return {sessionToken, username};
    } catch (error) {
        return null;
    }
}

export async function getGitHubAccessToken() {
    const db = await connect(transport, MONGODB_URI, DB_NAME);
    const {sessionToken} = await getSessionTokenFromSessionFile() || {};
    const sessions = db.collection('sessions');
    const session = await sessions.findOne(
        {'sessions.value': sessionToken},
        {projection: {username: 1, githubId: 1}},
    );
    await printInConsole(transport, `session in getGitHubAccessToken: ${JSON.stringify(session)}`);

    if (!session?.username) {
        return {
            accessToken: null,
            response: {
                content: [
                    {
                        type: 'text' as const,
                        text: `Session not found or expired, please authenticate again in this link "http://localhost:${PORT}/auth". 🔑`,
                    },
                ],
            },
        };
    }

    // const record = await db.collection('user_tokens').findOne({githubId: session.githubId});
    const record = await db.collection('user_tokens').findOne(
        {githubId: Number(session.githubId)},
        {projection: {tokens: {$slice: -1}}},   // -1 ⇒ latest only; drop if you want all
    );
    await printInConsole(transport, `record in getGitHubAccessToken: ${JSON.stringify(record)}`);
    if (!record || !record.tokens || record.tokens.length === 0) {
        return {
            accessToken: null,
            response: {
                content: [
                    {
                        type: 'text' as const,
                        text: `Please authenticate first in this link "http://localhost:${PORT}/auth". 🔑`,
                    },
                ],
            },
        };
    }

    const latestToken = record.tokens[0];
    return {
        accessToken: decryptToken(TOKEN_SECRET, latestToken.value),
        response: {
            content: [
                {
                    type: 'text' as const,
                    text: 'Authenticated ✅',
                },
            ],
        },
    };
}
