const gitHubBaseUrl = 'https://api.github.com';

const apis = {
    // list of all repositories in a github account
    listRepositoriesApi: `${gitHubBaseUrl}/user/repos`,

    // get repository metadata
    repositoryDetailsApi: (username: string, repository: string) => `${gitHubBaseUrl}/repos/${username}/${repository}`,

    // list of all branches in a repository
    listAllBranchesApi: (username: string, repository: string) => `${gitHubBaseUrl}/repos/${username}/${repository}/branches`,                                        // TODO: Create a new tool

    // get a specific branch details
    branchDetailsApi: (username: string, repository: string, branch: string) => `${gitHubBaseUrl}/repos/${username}/${repository}/branches/${branch}`,      // TODO: Create a new tool

    // list of files
    listFilesApi: (username: string, repository: string, branch: string) => `${gitHubBaseUrl}/repos/${username}/${repository}/git/trees/${branch}?recursive=1`,

    getFileContentApi: (username: string, repository: string, path: string, branch: string) => `${gitHubBaseUrl}/repos/${username}/${repository}/contents/${encodeURIComponent(path)}?ref=${branch}`,
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
