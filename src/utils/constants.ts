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

    /** branches */
    listBranches: 'list-branches',
    getBranchDetails: 'get-branch-details',
    createBranch: 'create-branch',
    setDefaultBranch: 'set-default-branch',

    /** files */
    listFilesInRepository: 'list-files-in-repository',
    getFileContent: 'get-file-content',

    /** commits */
    commitRemoteFile: 'commit-remote-file',
}

const constants = {
    sessionTokenFile: 'github_session.json',
}

export {tools, constants};
