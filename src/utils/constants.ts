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
        userFriendlyDescription: 'Permanently delete one of your repositories',
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
    listAllPRs: 'list-all-pull-requests',
    getPRDetails: 'get-pull-request-details',
    createPR: 'create-pull-request',
    updatePR: 'update-pull-request',
    listPRCommits: 'list-pull-request-commits',
    listPRFiles: 'list-pull-request-files',
    updatePRState: 'update-pull-request-state',
    mergePR: 'merge-pull-request',  // not yet working, 404
    getPRReviews: 'get-pull-request-reviews',
    createPRReview: 'create-pull-request-review',
    requestPRReview: 'request-pull-request-review', // need a third github account
    dismissPRReview: 'dismiss-pull-request-review',
    markPRForPRReview: 'mark-pull-request-review',

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
