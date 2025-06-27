const gitHubBaseUrl = 'https://api.github.com';

const apis = {
    // list of all repositories in my github account
    listAuthRepositoriesApi: (perPage: number, currentPage: number) => `${gitHubBaseUrl}/user/repos?per_page=${perPage}&page=${currentPage}`,

    // list of all repositories in other's github account
    listOwnerReposApi: (owner: string, perPage: number, page: number) => `${gitHubBaseUrl}/users/${owner}/repos?per_page=${perPage}&page=${page}`,

    // get repository metadata
    repositoryDetailsApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,

    // update repository metadata
    updateRepositoryApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,

    // list of all branches in a repository
    listAllBranchesApi: (owner: string, repository: string, perPage: number, currentPage: number) => `${gitHubBaseUrl}/repos/${owner}/${repository}/branches??per_page=${perPage}&page=${currentPage}`,

    // get a specific branch details
    getBranchDetailsApi: (owner: string, repository: string, branch: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/branches/${branch}`,

    // create a new branch
    createBranchApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,

    // set default branch
    setDefaultBranchApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,

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
