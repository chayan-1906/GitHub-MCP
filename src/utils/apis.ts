const gitHubBaseUrl = 'https://api.github.com';

const apis = {
    // list of all repositories in my github account
    listRepositoriesApi: (perPage: number, currentPage: number) => `${gitHubBaseUrl}/user/repos?per_page=${perPage}&page=${currentPage}`,

    // get repository metadata
    repositoryDetailsApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,

    // list of all branches in a repository
    listAllBranchesApi: (username: string, repository: string) => `${gitHubBaseUrl}/repos/${username}/${repository}/branches`,                                        // TODO: Create a new tool

    // get a specific branch details
    branchDetailsApi: (username: string, repository: string, branch: string) => `${gitHubBaseUrl}/repos/${username}/${repository}/branches/${branch}`,      // TODO: Create a new tool

    // list of files
    listFilesApi: (username: string, repository: string, branch: string) => `${gitHubBaseUrl}/repos/${username}/${repository}/git/trees/${branch}?recursive=1`,

    getFileContentApi: (owner: string, repository: string, path: string, branch: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/contents/${encodeURIComponent(path)}?ref=${branch}`,

    // create repository
    createRepositoryApi: () => `${gitHubBaseUrl}/user/repos`,

    // delete repository
    deleteRepositoryApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,

    // rename repository
    renameRepositoryApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,

    // modify-repository-visibility
    modifyRepositoryVisibilityApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,

    // get-all-collaborators
    getAllCollaboratorsApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/collaborators`,

    // get-all-invitations
    getAllInvitationsApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/invitations`,

    // add or remove collaborators
    addRemoveCollaboratorsApi: (owner: string, repository: string, username: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/collaborators/${username}`,

    // remove invitations
    cancelInvitationsApi: (owner: string, repository: string, invitationId: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/invitations/${invitationId}`,
};

const buildHeader = (accessToken: string) => {
    return {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github+json',
        },
    };
}

export {gitHubBaseUrl, apis, buildHeader};
