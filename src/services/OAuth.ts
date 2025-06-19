import {connect} from "../config/db";
import {transport} from "../server";
import {decryptToken, encryptToken} from "../utils/encryption";
import {v4 as uuidv4} from "uuid";
import path from "path";
import fs from "fs/promises";
import {printInConsole} from "../utils/printInConsole";
import {constants} from "../utils/constants";
import {getClaudeConfigDir} from "../utils/directory";
import {PORT} from "../config/config";
import axios from "axios";

export async function saveGitHubToken(githubId: number, username: string, token: string) {
    const db = await connect(transport);
    const collection = db.collection('user_tokens');

    const encrypted = encryptToken(token);

    // TODO Arka: Allow 4 sessions per user
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
        {upsert: true},
    );
}

export async function getDetailsFromSessionToken() {
    const {sessionToken} = await getSessionTokenFromSessionFile() || {};

    const db = await connect(transport);
    const sessions = db.collection('sessions');
    const session = await sessions.findOne({sessionToken});

    if (!session?.username) {
        return {
            response: {
                content: [{
                    type: 'text',
                    text: `Session not found or expired, please authenticate again in this link "http://localhost:${PORT}/auth". 🔑`,
                }],
            },
        };
    }

    try {
        const {data} = await axios.get(`https://api.github.com/users/${session.username}`)
        return {
            response: {
                content: [{
                    type: 'object',
                    data,
                }],
            },
        };
    } catch (error: any) {
        await printInConsole(transport, `Error fetching GitHub user: ${error.message}`)
        return {
            response: {
                content: [{
                    type: 'text',
                    text: 'Failed to fetch user details from GitHub.'
                }],
            },
        };
    }
}

export async function generateAndSaveSessionToken(githubId: string, username: string): Promise<string> {
    const sessionToken = uuidv4();
    const db = await connect(transport);
    const collection = db.collection('sessions');
    await collection.updateOne(
        {username},
        {$set: {sessionToken, githubId, username}},
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
        if (!content) {
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
    const db = await connect(transport);
    const {sessionToken} = await getSessionTokenFromSessionFile() || {};
    const sessions = db.collection('sessions');
    const session = await sessions.findOne({sessionToken});

    if (!session || !session?.username) {
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

    const record = await db.collection('user_tokens').findOne({githubId: session.githubId});
    if (!record || !record.token) {
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

    return {
        accessToken: decryptToken(record.token),
        response: {
            content: [
                {
                    type: 'text' as const,
                    text: 'Authenticated',
                },
            ],
        },
    };
}
