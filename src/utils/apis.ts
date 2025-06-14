const gitHubBaseUrl = 'https://api.github.com/user';

const apis = {
    listRepositories: `${gitHubBaseUrl}/repos`,
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
