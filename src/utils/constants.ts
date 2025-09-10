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
    listRepositories: 'list-repositories',
    getRepositoryDetails: 'get-repository-details',
    createRepository: 'create-repository',
    updateRepository: 'update-repository',
    renameRepository: 'rename-repository',
    deleteRepository: 'delete-repository',
    modifyRepositoryVisibility: 'modify-repository-visibility',

    listCollaborators: 'list-collaborators',
    addRemoveCollaborators: 'add-remove-collaborators',

    /** branches */
    listBranches: 'list-branches',
    getBranchDetails: 'get-branch-details',
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
    setDefaultBranch: 'set-default-branch',
    deleteBranch: 'delete-branch',

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
