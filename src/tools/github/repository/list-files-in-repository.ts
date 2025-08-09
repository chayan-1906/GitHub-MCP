import { z } from "zod";
import axios from "axios";
import {minimatch} from "minimatch";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { FileTree } from "../../../types";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

interface FileItem {
    path: string;
    mode: string;
    type: 'blob' | 'tree' | 'commit';
    sha: string;
    size?: number;
    url: string;
}

interface FilterOptions {
    pattern?: string;
    fileType?: 'files' | 'directories' | 'all';
    limit?: number;
    offset?: number;
}

const listFilesInRepository = async (accessToken: string, owner: string, repository: string, branch: string, options: FilterOptions = {}) => {
    const listFilesResponse = await axios.get<FileTree>(apis.listFilesApi(owner, repository, branch), buildHeader(accessToken));
    const { tree, truncated } = listFilesResponse.data || {};

    if (!tree) {
        return { files: [], truncated: false, total: 0, showing: 0, offset: 0 };
    }

    let filteredFiles = tree;

    // Filter by file type
    if (options.fileType === 'files') {
        filteredFiles = tree.filter(file => file.type === 'blob');
    } else if (options.fileType === 'directories') {
        filteredFiles = tree.filter(file => file.type === 'tree');
    }

    // Filter by glob pattern
    if (options.pattern) {
        filteredFiles = filteredFiles.filter(file =>
            minimatch(file.path, options.pattern!, { matchBase: true })
        );
    }

    const total = filteredFiles.length;

    // Apply pagination
    if (options.limit || options.offset) {
        const start = options.offset || 0;
        const end = options.limit ? start + options.limit : filteredFiles.length;
        filteredFiles = filteredFiles.slice(start, end);
    }

    return {
        files: filteredFiles,
        truncated: truncated || false,
        total,
        showing: filteredFiles.length,
        offset: options.offset || 0
    };
}

interface PaginationInfo {
    hasMore: boolean;
    currentOffset: number;
    suggestedNextOffset: number;
    totalResults: number;
}

const formatFilesOutput = (
    result: Awaited<ReturnType<typeof listFilesInRepository>>, 
    format: 'compact' | 'detailed' | 'paths-only' = 'compact',
    paginationInfo?: PaginationInfo
): string => {
    const { files, truncated, total, showing, offset } = result;

    let output = '';

    // Add summary
    output += `📁 Repository Files Summary:\n`;
    output += `• Total files found: ${total}\n`;
    output += `• Showing: ${showing} files`;
    if (offset && offset > 0) {
        output += ` (starting from ${offset})`;
    }
    output += '\n';

    if (truncated) {
        output += `⚠️  Note: GitHub API response was truncated - some files may be missing\n`;
    }

    // Add pagination info if results are limited
    if (paginationInfo && paginationInfo.hasMore) {
        output += `📄 Results are paginated to prevent truncation.\n`;
        output += `💡 To see more files, use: offset=${paginationInfo.suggestedNextOffset}, limit=50\n`;
        output += `📊 Progress: ${paginationInfo.currentOffset + showing}/${paginationInfo.totalResults} files shown\n`;
    }
    
    output += '\n';

    if (files.length === 0) {
        output += 'No files found matching the criteria.\n';
        return output;
    }

    // Format files based on output format
    if (format === 'paths-only') {
        output += files.map(file => file.path).join('\n');
    } else if (format === 'compact') {
        // Group by directories for better readability
        const grouped = new Map<string, FileItem[]>();

        files.forEach(file => {
            const dir = file.path.includes('/') ? file.path.split('/').slice(0, -1).join('/') : '.';
            if (!grouped.has(dir)) {
                grouped.set(dir, []);
            }
            grouped.get(dir)!.push(file);
        });

        Array.from(grouped.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([dir, dirFiles]) => {
                if (dir !== '.') {
                    output += `\n📂 ${dir}/\n`;
                }

                dirFiles.forEach(file => {
                    const fileName = file.path.includes('/') ? file.path.split('/').pop() : file.path;
                    const icon = file.type === 'tree' ? '📁' : '📄';
                    const size = file.size ? ` (${formatBytes(file.size)})` : '';
                    output += `  ${icon} ${fileName}${size}\n`;
                });
            });
    } else if (format === 'detailed') {
        files.forEach(file => {
            output += `\n📄 ${file.path}\n`;
            output += `   Type: ${file.type}\n`;
            output += `   SHA: ${file.sha}\n`;
            if (file.size) {
                output += `   Size: ${formatBytes(file.size)}\n`;
            }
            output += `   URL: ${file.url}\n`;
        });
    }

    return output;
}

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.listFilesInRepository,
        'Fetches the recursive file structure (tree) of a specified GitHub repository branch with advanced filtering and pagination support. Handles large repositories efficiently without truncation.',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub repository to list files from'),
            branch: z.string().describe('Branch name to list files from'),
            pattern: z.string().optional().describe('Glob pattern to filter files (e.g., "*.js", "src/**/*.ts", "**/*.md")'),
            fileType: z.enum(['files', 'directories', 'all']).optional().default('all').describe('Filter by type: "files" for files only, "directories" for folders only, "all" for both'),
            format: z.enum(['compact', 'detailed', 'paths-only']).optional().default('compact').describe('Output format: "compact" for organized view, "detailed" for full metadata, "paths-only" for file paths list'),
            limit: z.number().optional().describe('Maximum number of files to return (for pagination)'),
            offset: z.number().optional().describe('Number of files to skip (for pagination)'),
        },
        async ({owner, repository, branch, pattern, fileType = 'all', format = 'compact', limit, offset}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                // Set smart defaults based on format to prevent truncation
                let effectiveLimit = limit;
                let effectiveOffset = offset || 0;
                
                if (!limit) {
                    // Auto-limit based on format to prevent truncation
                    switch (format) {
                        case 'detailed':
                            effectiveLimit = 50; // Each detailed entry is ~150 chars, 50*150 = ~7500 chars
                            break;
                        case 'compact':
                            effectiveLimit = 200; // Each compact entry is ~50 chars, 200*50 = ~10000 chars
                            break;
                        case 'paths-only':
                            effectiveLimit = 500; // Each path is ~30 chars, 500*30 = ~15000 chars
                            break;
                    }
                }

                const result = await listFilesInRepository(accessToken, owner, repository, branch,
                    {pattern, fileType, limit: effectiveLimit, offset: effectiveOffset},
                );

                const formattedOutput = formatFilesOutput(result, format, {
                    hasMore: result.total > (effectiveOffset + result.showing),
                    currentOffset: effectiveOffset,
                    suggestedNextOffset: effectiveOffset + result.showing,
                    totalResults: result.total
                });

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: formattedOutput,
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to list repository files: ${error}`), tools.listFilesInRepository);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to list repository files ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
