import axios from "axios";
import {Request, Response, Router} from 'express';
import {sendError} from "mcp-utils/utils";
import {transport} from "../server";
import {successHtml} from "../templates/successHTML";
import {CLIENT_ID, CLIENT_SECRET} from "../config/config";
import {createClaudeFileAndStoreSession, generateAndSaveSessionToken, saveGitHubToken} from "../services/OAuth";

const router = Router();

router.get('/auth', async (req: Request, res: Response) => {
    const redirectURL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,delete_repo,user`;
    res.redirect(redirectURL);
});

router.get('/github/oauth/callback', async (req: Request, res: Response) => {
    const code = req.query.code as string;
    if (!code) return res.status(400).send('No code provided');

    try {
        // Step 1: Exchange code for access token
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token',
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
            },
            {headers: {Accept: 'application/json'}},
        );

        const {access_token: accessToken} = tokenResponse.data;
        if (!accessToken) return res.status(500).send('Access token not received');

        // Step 2: Get user info from GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {Authorization: `Bearer ${accessToken}`},
        });

        const {id: githubId, login: username} = userResponse.data;
        if (!githubId || !username) return res.status(500).send('Failed to get user info ❌');

        // Step 3: Save tokens object in DB
        await saveGitHubToken(githubId, username, accessToken);

        // Step 4: Generate and save a session token
        const sessionToken = await generateAndSaveSessionToken(githubId, username);

        // Step 5: Save session token locally (Claude-compatible)
        await createClaudeFileAndStoreSession(sessionToken, githubId, username);

        const filledHtml = successHtml
            .replace('{{username}}', username)
            .replace('{{token}}', sessionToken);

        res.send(filledHtml);
    } catch (error: any) {
        sendError(transport, error instanceof Error ? error : new Error(`GitHub OAuth error: ${error.message}`), 'github-oauth');
        res.status(500).send(`GitHub authentication failed: ${JSON.stringify(error)}`);
    }
});

export default router;
