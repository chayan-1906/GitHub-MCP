const gitHubBaseUrl = 'https://api.github.com';

const apis = {
    /** repositories */
    // list repositories in my github account
    listRepositoriesApi: (perPage: number, currentPage: number) => `${gitHubBaseUrl}/user/repos?affiliation=owner,collaborator,organization_member&per_page=${perPage}&page=${currentPage}`,

    // list repositories in other's github account
    listOwnerReposApi: (owner: string, perPage: number, page: number) => `${gitHubBaseUrl}/users/${owner}/repos?per_page=${perPage}&page=${page}`,

    // get repository metadata
    repositoryDetailsApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,

    // create repository
    createRepositoryApi: () => `${gitHubBaseUrl}/user/repos`,

    // update repository metadata
    updateRepositoryApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,

    // rename repository
    renameRepositoryApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,

    // delete repository
    deleteRepositoryApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,

    // modify-repository-visibility
    modifyRepositoryVisibilityApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,


    // list-collaborators
    listCollaboratorsApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/collaborators`,

    // list invitations
    listInvitationsApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/invitations`,

    // add or remove collaborators
    addRemoveCollaboratorsApi: (owner: string, repository: string, username: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/collaborators/${username}`,

    // remove invitation
    cancelInvitationApi: (owner: string, repository: string, invitationId: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/invitations/${invitationId}`,

    /** branches */
    // list branches in a repository
    listAllBranchesApi: (owner: string, repository: string, perPage: number, currentPage: number) => `${gitHubBaseUrl}/repos/${owner}/${repository}/branches?per_page=${perPage}&page=${currentPage}`,

    // get a specific branch details
    getBranchDetailsApi: (owner: string, repository: string, branch: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/branches/${branch}`,

    // create a new branch
    createBranchApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,

    // set default branch
    setDefaultBranchApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}`,

    // delete branch
    deleteBranchApi: (owner: string, repository: string, branch: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/git/refs/heads/${branch}`,

    /** files */
    // list files
    listFilesApi: (username: string, repository: string, branch: string) => `${gitHubBaseUrl}/repos/${username}/${repository}/git/trees/${branch}?recursive=1`,

    // get file content
    getFileContentApi: (owner: string, repository: string, path: string, branch: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/contents/${encodeURIComponent(path)}?ref=${branch}`,

    // commit remote file
    createBlobApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/git/blobs`,

    // commit tree
    createTreeApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/git/trees`,

    // create commit
    createCommitApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/git/commits`,

    // update branch ref
    updateBranchRefApi: (owner: string, repository: string, branch: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/git/refs/heads/${branch}`,


    /** commits */
    // list commits
    listCommitsApi: (owner: string, repository: string, branch: string, perPage: number, page: number) => `${gitHubBaseUrl}/repos/${owner}/${repository}/commits?sha=${branch}&per_page=${perPage}&page=${page}`,

    // get commit details
    commitDetailsApi: (owner: string, repository: string, commitSha: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/commits/${commitSha}`,

    /** issues */
    // list issues
    listIssuesApi: (owner: string, repository: string, state: string, includePRs: boolean, perPage: number, page: number, sort: string, direction: string) => {
        const baseUrl = `${gitHubBaseUrl}/repos/${owner}/${repository}/issues?state=${state}&sort=${sort}&direction=${direction}&per_page=${perPage}&page=${page}`;
        return includePRs ? baseUrl : `${baseUrl}&filter=issues`;
    },

    // get issue details
    issueDetailsApi: (owner: string, repository: string, issueNumber: number) => `${gitHubBaseUrl}/repos/${owner}/${repository}/issues/${issueNumber}`,

    // get issue comments
    issueCommentsApi: (owner: string, repository: string, issueNumber: number, perPage: number, page: number) => `${gitHubBaseUrl}/repos/${owner}/${repository}/issues/${issueNumber}/comments?per_page=${perPage}&page=${page}`,

    // create issue
    createIssueApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/issues`,

    // update issue
    updateIssueApi: (owner: string, repository: string, issueNumber: number) => `${gitHubBaseUrl}/repos/${owner}/${repository}/issues/${issueNumber}`,

    // close issue
    closeIssueApi: (owner: string, repository: string, issueNumber: number) => `${gitHubBaseUrl}/repos/${owner}/${repository}/issues/${issueNumber}`,

    // assign issue
    assignIssueApi: (owner: string, repository: string, issueNumber: number) => `${gitHubBaseUrl}/repos/${owner}/${repository}/issues/${issueNumber}/assignees`,

    /** releases */
    // get releases
    listReleasesApi: (owner: string, repository: string, perPage: number, currentPage: number) => `${gitHubBaseUrl}/repos/${owner}/${repository}/releases?per_page=${perPage}&page=${currentPage}`,

    // create release
    createReleaseApi: (owner: string, repository: string) => `${gitHubBaseUrl}/repos/${owner}/${repository}/releases`,

    // update release
    updateReleaseApi: (owner: string, repository: string, releaseId: number) => `${gitHubBaseUrl}/repos/${owner}/${repository}/releases/${releaseId}`,

    // delete release
    deleteReleaseApi: (owner: string, repository: string, releaseId: number) => `${gitHubBaseUrl}/repos/${owner}/${repository}/releases/${releaseId}`,
};

const buildHeader = (accessToken: string) => {
    return {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github+json',
        },
    };
}

export { gitHubBaseUrl, apis, buildHeader };
