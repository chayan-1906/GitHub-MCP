import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { Release } from "../../../types";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const createRelease = async (accessToken: string, owner: string, repository: string, tagName: string, name?: string, body?: string, draft?: boolean, prerelease?: boolean, targetCommitish?: string) => {
    const payload: {
        tag_name: string;
        name: string;
        body: string;
        draft: boolean;
        prerelease: boolean;
        target_commitish?: string;
    } = {
        tag_name: tagName,
        name: name || tagName,
        body: body || "",
        draft: draft ?? false,
        prerelease: prerelease ?? false,
    };

    if (targetCommitish) {
        payload.target_commitish = targetCommitish;
    }

    const {data} = await axios.post<Partial<Release>>(apis.createReleaseApi(owner, repository), payload, buildHeader(accessToken));

    return {
        id: data.id,
        tagName: data.tag_name,
        name: data.name,
        body: data.body,
        draft: data.draft,
        prerelease: data.prerelease,
        htmlUrl: data.html_url,
        publishedAt: data.published_at,
        author: data.author?.login,
        tarballUrl: data.tarball_url,
        zipballUrl: data.zipball_url,
    };
}

export const registerTool = (server: McpServer) => {
    const toolConfig = tools.createRelease;
    server.tool(
        toolConfig.name,
        toolConfig.techDescription,
        {
            owner: z.string().describe(toolConfig.parameters.find(p => p.name === 'owner')?.techDescription || ''),
            repository: z.string().describe(toolConfig.parameters.find(p => p.name === 'repository')?.techDescription || ''),
            tagName: z.string().describe(toolConfig.parameters.find(p => p.name === 'tagName')?.techDescription || ''),
            name: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'name')?.techDescription || ''),
            body: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'body')?.techDescription || ''),
            draft: z.boolean().optional().describe(toolConfig.parameters.find(p => p.name === 'draft')?.techDescription || ''),
            prerelease: z.boolean().optional().describe(toolConfig.parameters.find(p => p.name === 'prerelease')?.techDescription || ''),
            targetCommitish: z.string().optional().describe(toolConfig.parameters.find(p => p.name === 'targetCommitish')?.techDescription || ''),
        },
        async ({owner, repository, tagName, name, body, draft, prerelease, targetCommitish}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const release = await createRelease(accessToken, owner, repository, tagName, name, body, draft, prerelease, targetCommitish);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(release, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to create release: ${error}`), tools.createRelease.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to create release ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
