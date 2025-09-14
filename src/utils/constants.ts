const tools = {
    /** profile */
    myGitHubAccount: {
        name: 'my-github-account',
        category: 'Profile',
        techDescription: 'Retrieves details of the authenticated GitHub user, including username, display name, email (if available), avatar URL, and profile link',
        userFriendlyDescription: 'Get your GitHub account information and profile details',
        parameters: [],
    },

    /** repositories */
    listRepositories: {
        name: 'list-repositories',
        category: 'Repositories',
        techDescription: 'Fetches repositories user has access to. Calls repeatedly with increasing currentPage until result is empty',
        userFriendlyDescription: 'List all repositories you have access to with pagination',
        parameters: [
            {
                name: 'perPage',
                techDescription: 'Repositories per page (max: 60)',
                userFriendlyDescription: 'Number of repositories per page (max: 60)',
                optional: true,
            },
            {
                name: 'currentPage',
                techDescription: 'Page number',
                userFriendlyDescription: 'Page number for pagination',
                optional: true,
            },
        ],
    },
    getRepositoryDetails: {
        name: 'get-repository-details',
        category: 'Repositories',
        techDescription: 'Fetches metadata of a GitHub repository (e.g., default branch, visibility, description, etc.). Useful before accessing files or commits from a repo',
        userFriendlyDescription: 'Get detailed information about a specific repository',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
        ],
    },
    createRepository: {
        name: 'create-repository',
        category: 'Repositories',
        techDescription: 'Creates a new GitHub repository for the authenticated user with optional description, visibility, and initialization',
        userFriendlyDescription: 'Create a new repository in your GitHub account',
        parameters: [
            {
                name: 'name',
                techDescription: 'Name of the repository to create',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'description',
                techDescription: 'Optional description for the repository',
                userFriendlyDescription: 'Repository description',
                optional: true,
            },
            {
                name: 'private',
                techDescription: 'Whether the repository should be private (default: true)',
                userFriendlyDescription: 'Make repository private',
                optional: true,
            },
            {
                name: 'autoInit',
                techDescription: 'Whether to initialize the repository with a README (default: true)',
                userFriendlyDescription: 'Initialize with README file',
                optional: true,
            },
        ],
    },
    updateRepository: {
        name: 'update-repository',
        category: 'Repositories',
        techDescription: 'Updates repository description and/or tags (topics) of a GitHub repository',
        userFriendlyDescription: 'Update repository settings like description and topics',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'description',
                techDescription: 'The description to be added to the repository',
                userFriendlyDescription: 'New repository description',
                optional: true,
            },
            {
                name: 'tags',
                techDescription: 'Topics to set or replace in the repository',
                userFriendlyDescription: 'Repository topics/tags',
                optional: true,
            },
        ],
    },
    renameRepository: {
        name: 'rename-repository',
        category: 'Repositories',
        techDescription: 'Renames a GitHub repository owned by the authenticated user',
        userFriendlyDescription: 'Rename one of your repositories',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'oldName',
                techDescription: 'Current name of the repository',
                userFriendlyDescription: 'Current repository name',
            },
            {
                name: 'newName',
                techDescription: 'New name to give to the repository',
                userFriendlyDescription: 'New repository name',
            },
        ],
    },
    deleteRepository: {
        name: 'delete-repository',
        category: 'Repositories',
        techDescription: 'Deletes a GitHub repository owned by the authenticated user. This action is irreversible',
        userFriendlyDescription: 'Permanently deletes repository',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
        ],
    },
    modifyRepositoryVisibility: {
        name: 'modify-repository-visibility',
        category: 'Repositories',
        techDescription: 'Modifies a GitHub repository visibility (private/public/internal)',
        userFriendlyDescription: 'Change repository visibility settings',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'Name of the repository to update',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'visibility',
                techDescription: 'New visibility setting for the repository',
                userFriendlyDescription: 'New visibility (public/private/internal)',
            },
        ],
    },

    listCollaborators: {
        name: 'list-collaborators',
        category: 'Repositories',
        techDescription: 'Returns a combined list of accepted collaborators and pending invitations for a GitHub Repository, each marked with their status',
        userFriendlyDescription: 'View all collaborators and pending invitations for a repository',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
        ],
    },
    addRemoveCollaborators: {
        name: 'add-remove-collaborators',
        category: 'Repositories',
        techDescription: 'Adds or removes a collaborator from a GitHub repository',
        userFriendlyDescription: 'Invite or remove collaborators from your repository',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'Current name of the repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'targetUserName',
                techDescription: 'GitHub username of the collaborator',
                userFriendlyDescription: 'Username to add/remove',
            },
            {
                name: 'action',
                techDescription: 'Whether to add or remove the collaborator',
                userFriendlyDescription: 'Action to perform (add/remove)',
            },
            {
                name: 'status',
                techDescription: 'Required only to remove a user - "accepted" to remove an existing collaborator, "pending" to cancel an invitation',
                userFriendlyDescription: 'Status of user to remove (accepted/pending)',
                optional: true,
            },
            {
                name: 'invitationId',
                techDescription: 'Required to cancel a pending invitation — the unique invitation ID',
                userFriendlyDescription: 'Invitation ID for pending invites',
                optional: true,
            },
        ],
    },

    /** branches */
    listBranches: {
        name: 'list-branches',
        category: 'Branches',
        techDescription: 'Fetches branches of the authenticated user\'s repository. Calls repeatedly with increasing currentPage until the result is empty',
        userFriendlyDescription: 'List all branches in a repository with pagination support',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'perPage',
                techDescription: 'Maximum number of repositories to return per page (max: 60)',
                userFriendlyDescription: 'Number of branches per page (max: 60)',
                optional: true,
            },
            {
                name: 'currentPage',
                techDescription: 'Page number of the results to fetch. Start with 1 and increment this value in each call until the returned list is empty',
                userFriendlyDescription: 'Page number for pagination',
                optional: true,
            },
        ],
    },
    getBranchDetails: {
        name: 'get-branch-details',
        category: 'Branches',
        techDescription: 'Fetches details of a specific branch in a GitHub repository',
        userFriendlyDescription: 'Get detailed information about a specific branch',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'branch',
                techDescription: 'Branch name to get details for',
                userFriendlyDescription: 'Branch name',
            },
        ],
    },
    createBranch: {
        name: 'create-branch',
        category: 'Branches',
        techDescription: 'Creates a new branch from a given commit SHA (usually the latest commit of an existing branch)',
        userFriendlyDescription: 'Create a new branch from an existing commit',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'newBranch',
                techDescription: 'Name of the branch to create',
                userFriendlyDescription: 'New branch name',
            },
            {
                name: 'sha',
                techDescription: 'Commit SHA that the new branch should point to (base commit)',
                userFriendlyDescription: 'Source commit SHA',
            },
            {
                name: 'fromBranch',
                techDescription: 'Source branch name (optional, informational only)',
                userFriendlyDescription: 'Source branch name',
                optional: true,
            },
        ],
    },
    setDefaultBranch: {
        name: 'set-default-branch',
        category: 'Branches',
        techDescription: 'Sets the default branch in a GitHub repository',
        userFriendlyDescription: 'Set the default branch for a repository',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'branch',
                techDescription: 'The branch name to set as default for the repository',
                userFriendlyDescription: 'Branch name to set as default',
            },
        ],
    },
    deleteBranch: {
        name: 'delete-branch',
        category: 'Branches',
        techDescription: 'Deletes a branch from a GitHub repository. Cannot delete the default branch',
        userFriendlyDescription: 'Delete a branch from the repository',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'branch',
                techDescription: 'The name of the branch to delete',
                userFriendlyDescription: 'Branch name to delete',
            },
        ],
    },

    /** files */
    repositoryTree: {
        name: 'repository-tree',
        category: 'Files',
        techDescription: 'Displays the hierarchical tree structure of a GitHub repository branch with ASCII tree formatting. Shows files and directories in a visual tree layout with filtering and pagination support.',
        userFriendlyDescription: 'Browse repository files and folders in a visual tree structure',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub repository to display as a tree',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'branch',
                techDescription: 'Branch name to display tree structure from',
                userFriendlyDescription: 'Branch name',
            },
            {
                name: 'pattern',
                techDescription: 'Glob pattern to filter items (e.g., "*.js", "src/**/*.ts", "**/*.md")',
                userFriendlyDescription: 'Pattern to filter files (optional)',
                optional: true,
            },
            {
                name: 'fileType',
                techDescription: 'Filter by type: "files" for files only, "directories" for folders only. If not specified, shows both files and directories',
                userFriendlyDescription: 'Filter by type (files/directories)',
                optional: true,
            },
            {
                name: 'format',
                techDescription: 'Tree format: "tree" for ASCII tree with lines, "simple-tree" for indented tree, "detailed" for tree with metadata',
                userFriendlyDescription: 'Display format (tree/simple-tree/detailed)',
                optional: true,
            },
            {
                name: 'limit',
                techDescription: 'Maximum number of items to return (for pagination)',
                userFriendlyDescription: 'Maximum items to show',
                optional: true,
            },
            {
                name: 'offset',
                techDescription: 'Number of items to skip (for pagination)',
                userFriendlyDescription: 'Number of items to skip',
                optional: true,
            },
        ],
    },
    getFileContent: {
        name: 'get-file-content',
        category: 'Files',
        techDescription: 'Reads and returns the raw content of a specific file from a GitHub repository branch',
        userFriendlyDescription: 'Read the contents of a specific file from a repository',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'filePath',
                techDescription: 'Relative file path in the repository (e.g., \'src/index.js\')',
                userFriendlyDescription: 'Path to the file in the repository',
            },
            {
                name: 'branch',
                techDescription: 'Branch name',
                userFriendlyDescription: 'Branch name',
            },
        ],
    },
    commitRemoteFile: {
        name: 'commit-remote-file',
        category: 'Files',
        techDescription: 'Commits a file to a GitHub Repository using GitHub API. This does not use the local file system. • parentCommitSha & baseTreeSha: must be real SHAs. • If the repository is empty, omit these fields (don\'t pass 000…000).',
        userFriendlyDescription: 'Create or update a file in a repository with a commit',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'branch',
                techDescription: 'Name of the branch where the file should be committed',
                userFriendlyDescription: 'Target branch name',
            },
            {
                name: 'filePath',
                techDescription: 'Path of the file (e.g., README.md or docs/info.txt)',
                userFriendlyDescription: 'File path in repository',
            },
            {
                name: 'fileContent',
                techDescription: 'Content of the file',
                userFriendlyDescription: 'File content',
            },
            {
                name: 'commitMessage',
                techDescription: 'Commit message to include',
                userFriendlyDescription: 'Commit message',
            },
            {
                name: 'parentCommitSha',
                techDescription: 'Latest commit SHA in branch (omit if repo empty)',
                userFriendlyDescription: 'Parent commit SHA (optional)',
                optional: true,
            },
            {
                name: 'baseTreeSha',
                techDescription: 'Tree SHA of that commit (omit if repo empty)',
                userFriendlyDescription: 'Base tree SHA (optional)',
                optional: true,
            },
        ],
    },

    /** commits */
    listCommits: {
        name: 'list-commits',
        category: 'Commits',
        techDescription: 'Fetches commits in a branch of a GitHub repository, page by page',
        userFriendlyDescription: 'List commits from a repository branch with pagination',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'branch',
                techDescription: 'The name of the branch to list commits from',
                userFriendlyDescription: 'Branch name',
            },
            {
                name: 'perPage',
                techDescription: 'Maximum number of repositories to return per page (max: 100)',
                userFriendlyDescription: 'Number of commits per page (max: 100)',
                optional: true,
            },
            {
                name: 'currentPage',
                techDescription: 'Page number of the results to fetch. Start with 1 and increment until the returned list is empty',
                userFriendlyDescription: 'Page number for pagination',
                optional: true,
            },
        ],
    },
    getCommitModifications: {
        name: 'get-commit-modifications',
        category: 'Commits',
        techDescription: 'Returns the list of files modified in a specific GitHub commit',
        userFriendlyDescription: 'View files modified in a specific commit',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'commitSha',
                techDescription: 'Commit SHA to inspect',
                userFriendlyDescription: 'Commit SHA',
            },
        ],
    },

    /** issues */
    listIssues: {
        name: 'list-issues',
        category: 'Issues',
        techDescription: 'Fetches issues from a GitHub repository, page by page. Calls repeatedly with increasing currentPage until result is empty',
        userFriendlyDescription: 'List repository issues with filtering and pagination',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'state',
                techDescription: 'Issue state to filter by (open, closed, all). Default: open',
                userFriendlyDescription: 'Issue state filter (open/closed/all)',
                optional: true,
            },
            {
                name: 'includePRs',
                techDescription: 'Include pull requests in results. Default: false (excludes PRs)',
                userFriendlyDescription: 'Include pull requests in results',
                optional: true,
            },
            {
                name: 'sort',
                techDescription: 'Sort issues by created, updated, or comments. Default: created',
                userFriendlyDescription: 'Sort by (created/updated/comments)',
                optional: true,
            },
            {
                name: 'direction',
                techDescription: 'Sort direction: asc (oldest first) or desc (newest first). Default: desc',
                userFriendlyDescription: 'Sort direction (asc/desc)',
                optional: true,
            },
            {
                name: 'currentPage',
                techDescription: 'Page number of the results to fetch. Start with 1 and increment until the returned list is empty',
                userFriendlyDescription: 'Page number for pagination',
                optional: true,
            },
            {
                name: 'perPage',
                techDescription: 'Maximum number of issues to return per page (max: 100)',
                userFriendlyDescription: 'Issues per page (max: 100)',
                optional: true,
            },
        ],
    },
    getIssueDetails: {
        name: 'get-issue-details',
        category: 'Issues',
        techDescription: 'Fetches detailed information about a specific GitHub issue by issue number',
        userFriendlyDescription: 'Get detailed information about a specific issue',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'issueNumber',
                techDescription: 'The issue number to get details for',
                userFriendlyDescription: 'Issue number',
            },
        ],
    },
    getIssueComments: {
        name: 'get-issue-comments',
        category: 'Issues',
        techDescription: 'Fetches all comments for a GitHub issue, including the original issue, all comments, and participant details. Automatically fetches all pages of comments',
        userFriendlyDescription: 'Get all comments and participant details for an issue',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'issueNumber',
                techDescription: 'The issue number to get the comments for',
                userFriendlyDescription: 'Issue number',
            },
        ],
    },
    createIssue: {
        name: 'create-issue',
        category: 'Issues',
        techDescription: 'Creates a new issue in a GitHub repository. Including body and labels is optional',
        userFriendlyDescription: 'Create a new issue with optional description and labels',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'issueTitle',
                techDescription: 'Title of the issue',
                userFriendlyDescription: 'Issue title',
            },
            {
                name: 'body',
                techDescription: 'Body/description of the issue',
                userFriendlyDescription: 'Issue description (optional)',
                optional: true,
            },
            {
                name: 'labels',
                techDescription: 'Labels to associate with the issue',
                userFriendlyDescription: 'Issue labels (optional)',
                optional: true,
            },
        ],
    },
    updateIssue: {
        name: 'update-issue',
        category: 'Issues',
        techDescription: 'Updates the title, body, and/or labels of an existing GitHub issue. Also works for pull requests since PRs are treated as issues for label management.',
        userFriendlyDescription: 'Update an existing issue\'s title, description, or labels',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'issueNumber',
                techDescription: 'Issue number or pull request number to update',
                userFriendlyDescription: 'Issue number',
            },
            {
                name: 'issueTitle',
                techDescription: 'Title of the issue',
                userFriendlyDescription: 'New issue title',
            },
            {
                name: 'body',
                techDescription: 'Body/description of the issue',
                userFriendlyDescription: 'New issue description (optional)',
                optional: true,
            },
            {
                name: 'labels',
                techDescription: 'Labels to associate with the issue or pull request. This replaces all existing labels',
                userFriendlyDescription: 'Issue labels (replaces existing)',
                optional: true,
            },
        ],
    },
    updateIssueState: {
        name: 'update-issue-state',
        category: 'Issues',
        techDescription: 'Updates the state of a GitHub issue (open or closed) by issue number',
        userFriendlyDescription: 'Open or close an issue',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'issueNumber',
                techDescription: 'Issue number to close',
                userFriendlyDescription: 'Issue number',
            },
            {
                name: 'state',
                techDescription: 'Set to \'open\' to reopen or \'closed\' to close the issue',
                userFriendlyDescription: 'New state (open/closed)',
            },
        ],
    },
    assignIssue: {
        name: 'assign-issue',
        category: 'Issues',
        techDescription: 'Assigns one or more GitHub users to a GitHub issue',
        userFriendlyDescription: 'Assign users to an issue',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'issueNumber',
                techDescription: 'The issue number to assign users to',
                userFriendlyDescription: 'Issue number',
            },
            {
                name: 'assignees',
                techDescription: 'List of GitHub usernames to assign to the issue',
                userFriendlyDescription: 'Usernames to assign',
            },
        ],
    },

    /** pull requests */
    listAllPRs: {
        name: 'list-pull-requests',
        category: 'Pull Requests',
        techDescription: 'Fetches all pull requests from a GitHub repository, page by page. Filter by state and sort options available',
        userFriendlyDescription: 'List all pull requests with filtering and pagination',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'state',
                techDescription: 'PR state to filter by (open, closed, all). Default: open',
                userFriendlyDescription: 'PR state filter (open/closed/all)',
                optional: true,
            },
            {
                name: 'sort',
                techDescription: 'Sort PRs by created, updated, popularity, or long-running. Default: created',
                userFriendlyDescription: 'Sort by (created/updated/popularity/long-running)',
                optional: true,
            },
            {
                name: 'direction',
                techDescription: 'Sort direction: asc (oldest first) or desc (newest first). Default: desc',
                userFriendlyDescription: 'Sort direction (asc/desc)',
                optional: true,
            },
            {
                name: 'currentPage',
                techDescription: 'Page number of the results to fetch. Start with 1 and increment until the returned list is empty',
                userFriendlyDescription: 'Page number for pagination',
                optional: true,
            },
            {
                name: 'perPage',
                techDescription: 'Maximum number of PRs to return per page (max: 100)',
                userFriendlyDescription: 'PRs per page (max: 100)',
                optional: true,
            },
        ],
    },
    getPRDetails: {
        name: 'get-pull-request-details',
        category: 'Pull Requests',
        techDescription: 'Fetches detailed information about a specific GitHub pull request by PR number',
        userFriendlyDescription: 'Get detailed information about a specific pull request',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'prNumber',
                techDescription: 'The pull request number to get details for',
                userFriendlyDescription: 'Pull request number',
            },
        ],
    },
    createPR: {
        name: 'create-pull-request',
        category: 'Pull Requests',
        techDescription: 'Creates a new pull request in a GitHub repository. Compares changes between two branches and creates a PR for review',
        userFriendlyDescription: 'Create a new pull request between branches',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'title',
                techDescription: 'Title of the pull request',
                userFriendlyDescription: 'Pull request title',
            },
            {
                name: 'head',
                techDescription: 'The name of the branch where your changes are implemented (source branch)',
                userFriendlyDescription: 'Source branch (with changes)',
            },
            {
                name: 'base',
                techDescription: 'The name of the branch you want the changes pulled into (target branch)',
                userFriendlyDescription: 'Target branch (destination)',
            },
            {
                name: 'body',
                techDescription: 'Body/description of the pull request. Can include markdown formatting',
                userFriendlyDescription: 'Pull request description (optional)',
                optional: true,
            },
            {
                name: 'draft',
                techDescription: 'True to create a draft pull request (default: false). Draft PRs cannot be merged until marked as ready for review',
                userFriendlyDescription: 'Create as draft PR',
                optional: true,
            },
        ],
    },
    updatePR: {
        name: 'update-pull-request',
        category: 'Pull Requests',
        techDescription: 'Updates title, body, state, and base branch of an existing pull request',
        userFriendlyDescription: 'Update an existing pull request\'s details',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'prNumber',
                techDescription: 'Pull request number to update',
                userFriendlyDescription: 'Pull request number',
            },
            {
                name: 'title',
                techDescription: 'New title for the pull request',
                userFriendlyDescription: 'New pull request title',
                optional: true,
            },
            {
                name: 'body',
                techDescription: 'New body/description for the pull request',
                userFriendlyDescription: 'New pull request description',
                optional: true,
            },
            {
                name: 'state',
                techDescription: 'New state for the pull request (open or closed)',
                userFriendlyDescription: 'New state (open/closed)',
                optional: true,
            },
            {
                name: 'base',
                techDescription: 'New base branch for the pull request',
                userFriendlyDescription: 'New base branch',
                optional: true,
            },
        ],
    },
    listPRCommits: {
        name: 'list-pull-request-commits',
        category: 'Pull Requests',
        techDescription: 'Lists all commits in a specific pull request with pagination support',
        userFriendlyDescription: 'List all commits in a pull request',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'prNumber',
                techDescription: 'Pull request number to get commits for',
                userFriendlyDescription: 'Pull request number',
            },
            {
                name: 'perPage',
                techDescription: 'Number of commits per page (max: 100)',
                userFriendlyDescription: 'Commits per page (max: 100)',
                optional: true,
            },
            {
                name: 'currentPage',
                techDescription: 'Page number to fetch',
                userFriendlyDescription: 'Page number for pagination',
                optional: true,
            },
        ],
    },
    listPRFiles: {
        name: 'list-pull-request-files',
        category: 'Pull Requests',
        techDescription: 'Lists all files changed in a specific pull request with diff information',
        userFriendlyDescription: 'List all changed files in a pull request with diff details',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'prNumber',
                techDescription: 'Pull request number to get files for',
                userFriendlyDescription: 'Pull request number',
            },
            {
                name: 'perPage',
                techDescription: 'Maximum number of files to return per page (max: 100)',
                userFriendlyDescription: 'Results per page (max 100)',
                optional: true,
            },
            {
                name: 'currentPage',
                techDescription: 'Page number of the results to fetch. Start with 1 and increment until the returned list is empty',
                userFriendlyDescription: 'Page number',
                optional: true,
            },
        ],
    },
    updatePRState: {
        name: 'update-pull-request-state',
        category: 'Pull Requests',
        techDescription: 'Updates the state of a pull request (open or closed)',
        userFriendlyDescription: 'Open or close a pull request',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'prNumber',
                techDescription: 'Pull request number to update',
                userFriendlyDescription: 'Pull request number',
            },
            {
                name: 'state',
                techDescription: 'New state for the pull request (open or closed)',
                userFriendlyDescription: 'New state (open/closed)',
            },
        ],
    },
    mergePR: {
        name: 'merge-pull-request',
        category: 'Pull Requests',
        techDescription: 'Merges a GitHub pull request only if PR is open, not draft, and has no conflicts',
        userFriendlyDescription: 'Merge a pull request (checks for conflicts)',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'prNumber',
                techDescription: 'Pull request number to merge',
                userFriendlyDescription: 'Pull request number',
            },
            {
                name: 'mergeMethod',
                techDescription: 'How to merge: "merge" (merge commit), "squash" (squash and merge), "rebase" (rebase and merge)',
                userFriendlyDescription: 'Merge method (merge/squash/rebase)',
                optional: true,
            },
            {
                name: 'commitTitle',
                techDescription: 'Custom title for the merge commit (optional)',
                userFriendlyDescription: 'Custom merge commit title (optional)',
                optional: true,
            },
            {
                name: 'commitMessage',
                techDescription: 'Custom message for the merge commit (optional)',
                userFriendlyDescription: 'Custom merge commit message (optional)',
                optional: true,
            },
        ],
    },
    getPRReviews: {
        name: 'get-pull-request-reviews',
        category: 'Pull Requests',
        techDescription: 'Lists all reviews for a specific GitHub pull request, page by page',
        userFriendlyDescription: 'Get all reviews for a pull request',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'prNumber',
                techDescription: 'Pull request number to get reviews for',
                userFriendlyDescription: 'Pull request number',
            },
            {
                name: 'perPage',
                techDescription: 'Maximum number of reviews to return per page (max: 100)',
                userFriendlyDescription: 'Results per page (max 100)',
                optional: true,
            },
            {
                name: 'currentPage',
                techDescription: 'Page number of the results to fetch. Start with 1 and increment until the returned list is empty',
                userFriendlyDescription: 'Page number',
                optional: true,
            },
        ],
    },
    createPRReview: {
        name: 'create-pull-request-review',
        category: 'Pull Requests',
        techDescription: 'Creates a review for a GitHub pull request. Can approve, request changes, or add comments',
        userFriendlyDescription: 'Create a pull request review (approve/request changes/comment)',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'prNumber',
                techDescription: 'Pull request number to review',
                userFriendlyDescription: 'Pull request number',
            },
            {
                name: 'event',
                techDescription: 'Review action: APPROVE (approve PR), REQUEST_CHANGES (request changes), COMMENT (general comment), PENDING (create pending review) or omit for pending',
                userFriendlyDescription: 'Review action (APPROVE/REQUEST_CHANGES/COMMENT/PENDING)',
                optional: true,
            },
            {
                name: 'body',
                techDescription: 'Review comment text. Required for REQUEST_CHANGES and COMMENT events',
                userFriendlyDescription: 'Review comment text',
                optional: true,
            },
            {
                name: 'commitId',
                techDescription: 'Specific commit SHA to review (optional, defaults to latest commit)',
                userFriendlyDescription: 'Specific commit to review (optional)',
                optional: true,
            },
        ],
    },
    requestPRReview: {
        name: 'request-pull-request-review',
        category: 'Pull Requests',
        techDescription: 'Requests reviews from users and/or teams for a GitHub pull request',
        userFriendlyDescription: 'Request reviews from users or teams',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'prNumber',
                techDescription: 'Pull request number to request reviews for',
                userFriendlyDescription: 'Pull request number',
            },
            {
                name: 'reviewers',
                techDescription: 'Array of GitHub usernames to request reviews from',
                userFriendlyDescription: 'Usernames to request reviews from',
                optional: true,
            },
            {
                name: 'teamReviewers',
                techDescription: 'Array of team slugs to request reviews from (for organization repos)',
                userFriendlyDescription: 'Team slugs to request reviews from',
                optional: true,
            },
        ],
    }, // need a third github account
    dismissPRReview: {
        name: 'dismiss-pull-request-review',
        category: 'Pull Requests',
        techDescription: 'Dismisses a pull request review with a message explaining why it was dismissed',
        userFriendlyDescription: 'Dismiss a pull request review',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'prNumber',
                techDescription: 'Pull request number containing the review to dismiss',
                userFriendlyDescription: 'Pull request number',
            },
            {
                name: 'reviewId',
                techDescription: 'Review ID to dismiss (get this from get-pull-request-reviews)',
                userFriendlyDescription: 'Review ID to dismiss',
            },
            {
                name: 'message',
                techDescription: 'Message explaining why the review is being dismissed',
                userFriendlyDescription: 'Dismissal reason message',
            },
        ],
    },
    markPRForPRReview: {
        name: 'mark-pull-request-review',
        category: 'Pull Requests',
        techDescription: 'Submits a pending pull request review by marking it with APPROVE, REQUEST_CHANGES, or COMMENT',
        userFriendlyDescription: 'Submit a pending pull request review',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'prNumber',
                techDescription: 'Pull request number containing the pending review',
                userFriendlyDescription: 'Pull request number',
            },
            {
                name: 'reviewId',
                techDescription: 'Pending review ID to submit (get this from get-pull-request-reviews)',
                userFriendlyDescription: 'Pending review ID',
            },
            {
                name: 'event',
                techDescription: 'Review action to submit: APPROVE (approve PR), REQUEST_CHANGES (request changes), COMMENT (general comment)',
                userFriendlyDescription: 'Review action (APPROVE/REQUEST_CHANGES/COMMENT)',
            },
            {
                name: 'body',
                techDescription: 'Additional review comment text (optional for APPROVE, recommended for REQUEST_CHANGES and COMMENT)',
                userFriendlyDescription: 'Additional review comment (optional)',
                optional: true,
            },
        ],
    },

    /** releases */
    listReleases: {
        name: 'list-releases',
        category: 'Releases',
        techDescription: 'Fetches all releases in a GitHub repository, page by page',
        userFriendlyDescription: 'List all releases in a repository with pagination',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'perPage',
                techDescription: 'Maximum number of releases to return per page (max: 100)',
                userFriendlyDescription: 'Number of releases per page (max: 100)',
                optional: true,
            },
            {
                name: 'currentPage',
                techDescription: 'Page number of the results to fetch. Start with 1 and increment until the returned list is empty',
                userFriendlyDescription: 'Page number for pagination',
                optional: true,
            },
        ],
    },
    createRelease: {
        name: 'create-release',
        category: 'Releases',
        techDescription: 'Creates a GitHub release from an existing tag or creates a new tag and release',
        userFriendlyDescription: 'Create a new release with optional tag creation',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'tagName',
                techDescription: 'The name of the tag (e.g., "v1.0.0")',
                userFriendlyDescription: 'Tag name (e.g., "v1.0.0")',
            },
            {
                name: 'name',
                techDescription: 'The name of the release (defaults to tag name)',
                userFriendlyDescription: 'Release name (optional)',
                optional: true,
            },
            {
                name: 'body',
                techDescription: 'Text describing the contents of the tag (release notes)',
                userFriendlyDescription: 'Release notes/description',
                optional: true,
            },
            {
                name: 'draft',
                techDescription: 'True to create a draft (unpublished) release, false to create a published one (default: false)',
                userFriendlyDescription: 'Create as draft release',
                optional: true,
            },
            {
                name: 'prerelease',
                techDescription: 'True to identify the release as a prerelease, false to identify as full release (default: false)',
                userFriendlyDescription: 'Mark as prerelease',
                optional: true,
            },
            {
                name: 'targetCommitish',
                techDescription: 'Specifies the commitish value that determines where the Git tag is created from (default: repository default branch)',
                userFriendlyDescription: 'Target commit/branch (optional)',
                optional: true,
            },
        ],
    },
    updateRelease: {
        name: 'update-release',
        category: 'Releases',
        techDescription: 'Updates an existing GitHub release by release ID with new information',
        userFriendlyDescription: 'Update an existing release with new information',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'releaseId',
                techDescription: 'The unique ID of the release to update',
                userFriendlyDescription: 'Release ID',
            },
            {
                name: 'tagName',
                techDescription: 'The name of the tag (e.g., "v1.0.1")',
                userFriendlyDescription: 'New tag name (optional)',
                optional: true,
            },
            {
                name: 'name',
                techDescription: 'The name of the release',
                userFriendlyDescription: 'New release name (optional)',
                optional: true,
            },
            {
                name: 'body',
                techDescription: 'Text describing the contents of the tag (release notes)',
                userFriendlyDescription: 'Updated release notes (optional)',
                optional: true,
            },
            {
                name: 'draft',
                techDescription: 'True to mark as draft (unpublished) release, false to publish',
                userFriendlyDescription: 'Set as draft release',
                optional: true,
            },
            {
                name: 'prerelease',
                techDescription: 'True to identify the release as a prerelease, false for full release',
                userFriendlyDescription: 'Mark as prerelease',
                optional: true,
            },
            {
                name: 'targetCommitish',
                techDescription: 'Specifies the commitish value that determines where the Git tag is created from',
                userFriendlyDescription: 'Target commit/branch (optional)',
                optional: true,
            },
        ],
    },
    deleteRelease: {
        name: 'delete-release',
        category: 'Releases',
        techDescription: 'Deletes a GitHub release by release ID. This action is irreversible',
        userFriendlyDescription: 'Permanently delete a release',
        parameters: [
            {
                name: 'owner',
                techDescription: 'GitHub username or organization that owns the repository',
                userFriendlyDescription: 'Repository owner (username or organization)',
            },
            {
                name: 'repository',
                techDescription: 'The name of the GitHub Repository',
                userFriendlyDescription: 'Repository name',
            },
            {
                name: 'releaseId',
                techDescription: 'The unique ID of the release to delete',
                userFriendlyDescription: 'Release ID',
            },
        ],
    },
};

const constants = {
    sessionTokenFile: 'github_session.json',
    fsConfigFile: 'file_system_config.json',
};

export { tools, constants };
