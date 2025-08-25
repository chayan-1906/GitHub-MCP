import { z } from "zod";
import axios from "axios";
import { minimatch } from "minimatch";
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
    fileType?: 'files' | 'directories';
    limit?: number;
    offset?: number;
}

interface TreeNode {
    name: string;
    path: string;
    type: 'blob' | 'tree';
    size?: number;
    children?: TreeNode[];
    sha: string;
    url: string;
}

interface PaginationInfo {
    hasMore: boolean;
    currentOffset: number;
    suggestedNextOffset: number;
    totalResults: number;
}

const getRepositoryTree = async (accessToken: string, owner: string, repository: string, branch: string, options: FilterOptions = {}) => {
    const listFilesResponse = await axios.get<FileTree>(apis.listFilesApi(owner, repository, branch), buildHeader(accessToken));
    const {tree, truncated} = listFilesResponse.data || {};

    if (!tree) {
        return {files: [], truncated: false, total: 0, showing: 0, offset: 0};
    }

    let filteredFiles = tree;

    if (options.fileType === 'files') {
        filteredFiles = tree.filter(file => file.type === 'blob');
    } else if (options.fileType === 'directories') {
        filteredFiles = tree.filter(file => file.type === 'tree');
    }

    if (options.pattern) {
        filteredFiles = filteredFiles.filter(file => minimatch(file.path, options.pattern!, {matchBase: true}));
    }

    const total = filteredFiles.length;

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
        offset: options.offset || 0,
    };
}

const buildTree = (files: FileItem[]): TreeNode[] => {
    const root: TreeNode[] = [];
    const pathMap = new Map<string, TreeNode>();

    const sortedFiles = files.sort((a, b) => a.path.localeCompare(b.path));

    for (const file of sortedFiles) {
        const pathParts = file.path.split('/');
        const fileName = pathParts[pathParts.length - 1];

        const node: TreeNode = {
            name: fileName,
            path: file.path,
            type: file.type as 'blob' | 'tree',
            size: file.size,
            sha: file.sha,
            url: file.url,
            children: file.type === 'tree' ? [] : undefined,
        };

        pathMap.set(file.path, node);

        if (pathParts.length === 1) {
            root.push(node);
        } else {
            const parentPath = pathParts.slice(0, -1).join('/');
            const parent = pathMap.get(parentPath);
            if (parent && parent.children) {
                parent.children.push(node);
            } else {
                root.push(node);
            }
        }
    }

    return root;
}

const formatTreeOutput = (result: Awaited<ReturnType<typeof getRepositoryTree>>, format: 'tree' | 'simple-tree' | 'detailed' = 'tree', paginationInfo?: PaginationInfo): string => {
    const {files, truncated, total, showing, offset} = result;

    let output = '';

    output += `🌳 Repository Tree Summary:\n`;
    output += `• Total items found: ${total}\n`;
    output += `• Showing: ${showing} items`;
    if (offset && offset > 0) {
        output += ` (starting from ${offset})`;
    }
    output += '\n';

    if (truncated) {
        output += `⚠️  Note: GitHub API response was truncated - some items may be missing\n`;
    }

    if (paginationInfo && paginationInfo.hasMore) {
        output += `📄 Results are paginated to prevent truncation.\n`;
        output += `💡 To see more items, use: offset=${paginationInfo.suggestedNextOffset}, limit=50\n`;
        output += `📊 Progress: ${paginationInfo.currentOffset + showing}/${paginationInfo.totalResults} items shown\n`;
    }

    output += '\n';

    if (files.length === 0) {
        output += 'No items found matching the criteria.\n';
        return output;
    }

    const tree = buildTree(files);

    const renderTree = (nodes: TreeNode[], prefix: string = '', isLast: boolean = true): string => {
        let result = '';

        nodes.forEach((node, index) => {
            const isLastNode = index === nodes.length - 1;
            const connector = format === 'tree'
                ? (isLastNode ? '└── ' : '├── ')
                : (format === 'simple-tree' ? '  ' : '');
            const icon = node.type === 'tree' ? '📁' : '📄';
            const size = node.size && format === 'detailed' ? ` (${formatBytes(node.size)})` : '';

            if (format === 'detailed') {
                result += `${prefix}${connector}${icon} ${node.name}${size}\n`;
                if (node.type === 'blob') {
                    result += `${prefix}${isLastNode ? '    ' : '│   '}  SHA: ${node.sha}\n`;
                    result += `${prefix}${isLastNode ? '    ' : '│   '}  URL: ${node.url}\n`;
                }
            } else {
                result += `${prefix}${connector}${icon} ${node.name}${size}\n`;
            }

            if (node.children && node.children.length > 0) {
                const childPrefix = format === 'tree'
                    ? prefix + (isLastNode ? '    ' : '│   ')
                    : prefix + '  ';
                result += renderTree(node.children, childPrefix, isLastNode);
            }
        });

        return result;
    };

    output += renderTree(tree);

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
        tools.repositoryTree,
        'Displays the hierarchical tree structure of a GitHub repository branch with ASCII tree formatting. Shows files and directories in a visual tree layout with filtering and pagination support.',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub repository to display as a tree'),
            branch: z.string().describe('Branch name to display tree structure from'),
            pattern: z.string().optional().describe('Glob pattern to filter items (e.g., "*.js", "src/**/*.ts", "**/*.md")'),
            fileType: z.enum(['files', 'directories']).optional().describe('Filter by type: "files" for files only, "directories" for folders only. If not specified, shows both files and directories'),
            format: z.enum(['tree', 'simple-tree', 'detailed']).optional().default('tree').describe('Tree format: "tree" for ASCII tree with lines, "simple-tree" for indented tree, "detailed" for tree with metadata'),
            limit: z.number().optional().describe('Maximum number of items to return (for pagination)'),
            offset: z.number().optional().describe('Number of items to skip (for pagination)'),
        },
        async ({owner, repository, branch, pattern, fileType, format = 'tree', limit, offset}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                let effectiveLimit = limit;
                let effectiveOffset = offset || 0;

                if (!limit) {
                    switch (format) {
                        case 'detailed':
                            effectiveLimit = 30;
                            break;
                        case 'tree':
                            effectiveLimit = 100
                            break;
                        case 'simple-tree':
                            effectiveLimit = 150;
                            break;
                    }
                }

                const result = await getRepositoryTree(accessToken, owner, repository, branch,
                    {pattern, fileType, limit: effectiveLimit, offset: effectiveOffset},
                );

                const formattedOutput = formatTreeOutput(result, format, {
                    hasMore: result.total > (effectiveOffset + result.showing),
                    currentOffset: effectiveOffset,
                    suggestedNextOffset: effectiveOffset + result.showing,
                    totalResults: result.total,
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
                sendError(transport, new Error(`Failed to get repository tree: ${error}`), tools.repositoryTree);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to get repository tree ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
