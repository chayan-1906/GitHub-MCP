const tools = {
    myDetails: 'my-details',

    /** repositories */
    listRepositories: 'list-repositories',
    getRepositoryDetails: 'get-repository-details',
    createRepository: 'create-repository',
    updateRepository: 'update-repository',
    renameRepository: 'rename-repository',
    deleteRepository: 'delete-repository',
    modifyRepositoryVisibility: 'modify-repository-visibility',
    getAllCollaborators: 'get-all-collaborators',
    addRemoveCollaborators: 'add-remove-collaborators',
    listFilesInRepository: 'list-files-in-repository',

    /** branches */
    listBranches: 'list-branches',
    getBranchDetails: 'get-branch-details',
    createBranch: 'create-branch',
    setDefaultBranch: 'set-default-branch',
    deleteBranch: 'delete-branch',

    /** commits */
    listCommits: 'list-commits',
    getCommitModifications: 'get-commit-modifications',

    /** files */
    getFileContent: 'get-file-content',
    commitRemoteFile: 'commit-remote-file',

    /** issues */
    createIssue: 'create-issue',
    updateIssue: 'update-issue',
    updateIssueState: 'update-issue-state',
    assignIssue: 'assign-issue',

    /** local */
    runGitCommand: 'run-git-command',

    runShellCommand: 'run-shell-command',
}

const constants = {
    sessionTokenFile: 'github_session.json',
    fsConfigFile: 'file_system_config.json',
}

export { tools, constants };
