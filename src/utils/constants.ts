const tools = {
    /** profile */
    myGitHubAccount: 'my-github-account',

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
    createBranch: 'create-branch',
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
    issueDetails: 'issue-details',
    getIssueComments: 'get-issue-comments',
    createIssue: 'create-issue',
    updateIssue: 'update-issue',
    updateIssueState: 'update-issue-state',
    assignIssue: 'assign-issue',

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
