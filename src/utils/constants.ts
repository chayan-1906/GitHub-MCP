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
    deleteRepository: 'delete-repository',
    modifyRepositoryVisibility: 'modify-repository-visibility',

    listCollaborators: 'list-collaborators',
    addRemoveCollaborators: 'add-remove-collaborators',

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
    repositoryTree: 'repository-tree',
    getFileContent: 'get-file-content',
    commitRemoteFile: 'commit-remote-file',

    /** commits */
    listCommits: 'list-commits',
    getCommitModifications: 'get-commit-modifications',

    /** issues */
    listIssues: 'list-issues',
    getIssueDetails: 'get-issue-details',
    getIssueComments: 'get-issue-comments',
    createIssue: 'create-issue',
    updateIssue: 'update-issue',
    updateIssueState: 'update-issue-state',
    assignIssue: 'assign-issue',

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
    listReleases: 'list-releases',
    createRelease: 'create-release',
    updateRelease: 'update-release',
    deleteRelease: 'delete-release',
};

const constants = {
    sessionTokenFile: 'github_session.json',
    fsConfigFile: 'file_system_config.json',
};

export { tools, constants };
