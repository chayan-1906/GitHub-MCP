// repositoryDetailsApi:: https://api.github.com/repos/chayan-1906/Busgo-React-Native
interface Owner {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
}

export interface RepositoryDetails {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: Owner;
    html_url: string;
    description: string;
    fork: boolean;
    url: string;
    forks_url: string;
    keys_url: string;
    collaborators_url: string;
    teams_url: string;
    hooks_url: string;
    issue_events_url: string;
    events_url: string;
    assignees_url: string;
    branches_url: string;
    tags_url: string;
    blobs_url: string;
    git_tags_url: string;
    git_refs_url: string;
    trees_url: string;
    statuses_url: string;
    languages_url: string;
    stargazers_url: string;
    contributors_url: string;
    subscribers_url: string;
    subscription_url: string;
    commits_url: string;
    git_commits_url: string;
    comments_url: string;
    issue_comment_url: string;
    contents_url: string;
    compare_url: string;
    merges_url: string;
    archive_url: string;
    downloads_url: string;
    issues_url: string;
    pulls_url: string;
    milestones_url: string;
    notifications_url: string;
    labels_url: string;
    releases_url: string;
    deployments_url: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    git_url: string;
    ssh_url: string;
    clone_url: string;
    svn_url: string;
    homepage: string;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string;
    has_issues: boolean;
    has_projects: boolean;
    has_downloads: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_discussions: boolean;
    forks_count: number;
    mirror_url: string | null;
    archived: boolean;
    disabled: boolean;
    open_issues_count: number;
    license: any; // Adjust if you have license schema
    allow_forking: boolean;
    is_template: boolean;
    web_commit_signoff_required: boolean;
    topics: string[];
    visibility: string;
    forks: number;
    open_issues: number;
    watchers: number;
    default_branch: string;
    temp_clone_token: string | null;
    network_count: number;
    subscribers_count: number;
}

// createRepositoryApi:: https://api.github.com/user/repos
export interface CreateRepositoryParams {
    name: string;
    description?: string;
    isPrivate?: boolean;
    autoInit?: boolean;
}

// listCollaboratorsApi:: https://api.github.com/repos/${owner}/${repository}/collaborators
export interface Collaborator {
    login: string;
    html_url: string;
    permissions: {
        admin: boolean;
        push: boolean;
    };
}

// listInvitationsApi:: https://api.github.com/repos/${owner}/${repository}/invitations
export interface Invitation {
    id: string;
    invitee: {
        login: string;
        html_url: string;
    };
    permissions: string;
}

// listAllBranchesApi:: https://api.github.com/repos/chayan-1906/Busgo-React-Native/branches
interface CommitInfo {
    sha: string;
    url: string;
}

export interface BranchDetails {
    name: string;
    commit: CommitInfo;
    protected: boolean;
}

// listFilesApi:: https://api.github.com/repos/chayan-1906/Busgo-React-Native/git/trees/master?recursive=1
export interface FileItem {
    path: string;
    mode: string;
    type: "blob" | "tree" | "commit"; // file, directory, or submodule
    sha: string;
    size?: number;
    url: string;
}

export interface FilterOptions {
    pattern?: string;
    fileType?: 'files' | 'directories';
    limit?: number;
    offset?: number;
}

export interface TreeNode {
    name: string;
    path: string;
    type: 'blob' | 'tree';
    size?: number;
    children?: TreeNode[];
    sha: string;
    url: string;
}

export interface PaginationInfo {
    hasMore: boolean;
    currentOffset: number;
    suggestedNextOffset: number;
    totalResults: number;
}

export interface FileTree {
    sha: string;
    url: string;
    tree: FileItem[];
    truncated: boolean;
}

// getFileContentApi:: https://api.github.com/repos/chayan-1906/Busgo-React-Native/contents/src/index.dt.ts?ref=master
interface GitHubContentLink {
    self: string;
    git: string;
    html: string;
}

export interface GitHubContent {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string | null;
    type: 'file' | 'dir' | 'symlink' | 'submodule';
    content?: string; // only in single file response
    encoding?: 'base64'; // only in single file response
    _links: GitHubContentLink;
}

// createBlobApi:: https://api.github.com/repos/owner/repo/git/blobs
export interface GitBlob {
    sha: string;
    url: string;
}

// createTreeApi:: https://api.github.com/repos/owner/repo/git/trees
export interface GitTree {
    sha: string;
    url: string;
    tree: Array<{
        path: string;
        mode: string;
        type: string;
        sha: string;
        size?: number;
        url: string;
    }>;
}

// createCommitApi:: https://api.github.com/repos/owner/repo/git/commits
export interface GitCommit {
    sha: string;
    url: string;
    html_url: string;
    author: {
        name: string;
        email: string;
        date: string;
    };
    committer: {
        name: string;
        email: string;
        date: string;
    };
    tree: {
        sha: string;
        url: string;
    };
    message: string;
    parents: Array<{
        sha: string;
        url: string;
        html_url: string;
    }>;
    files: CommitFile[];
}

// commitDetailsApi:: https://api.github.com/repos/owner/repo/commits/sha
export interface CommitFile {
    filename: string;
    status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    sha?: string;
    previous_filename?: string;
}

// listIssuesApi:: https://api.github.com/repos/repos/chayan-1906/School-Management-Next.js/issues
// issueDetailsApi:: https://api.github.com/repos/repos/chayan-1906/School-Management-Next.js/issues/1
export interface IssueDetails {
    id: number;
    number: number;
    title: string;
    body?: string;
    state: string;
    locked: boolean;
    created_at: string;
    updated_at: string;
    closed_at?: string;
    user: {
        login: string;
        id: number;
        avatar_url: string;
        html_url: string;
        type: string;
    };
    assignee?: {
        login: string;
        id: number;
        avatar_url: string;
        html_url: string;
    };
    assignees: Array<{
        login: string;
        id: number;
        avatar_url: string;
        html_url: string;
    }>;
    labels: Array<{
        id: number;
        name: string;
        color: string;
        description?: string;
    }>;
    milestone?: {
        id: number;
        number: number;
        title: string;
        description?: string;
        state: string;
        due_on?: string;
    };
    comments: number;
    html_url: string;
    repository_url: string;
    state_reason?: string;
    pull_request?: {
        url: string;
        html_url: string;
        diff_url: string;
        patch_url: string;
    };
}

// issueCommentsApis:: https://api.github.com/repos/repos/chayan-1906/School-Management-Next.js/issues/1/comments
interface IssueUser {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    type: string;
}

export interface IssueAssignee {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
}

interface CommentReactions {
    total_count: number;
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
}

export interface IssueComment {
    id: number;
    body: string;
    created_at: string;
    updated_at: string;
    user: IssueUser;
    html_url: string;
    issue_url: string;
    reactions: CommentReactions;
    author_association: string;
}

// listReleasesApi:: https://api.github.com/repos/owner/repo/releases
// createReleaseApi:: https://api.github.com/repos/owner/repo/releases
export interface Release {
    id: number;
    tag_name: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    published_at: string;
    html_url: string;
    tarball_url: string;
    zipball_url: string;
    author?: {
        login: string;
        id: number;
        avatar_url: string;
        html_url: string;
    };
}

// listPullRequestsApi:: https://api.github.com/repos/owner/repo/pulls
export interface PullRequest {
    id: number;
    number: number;
    title: string;
    body?: string;
    state: 'open' | 'closed' | 'draft';
    created_at: string;
    updated_at: string;
    closed_at?: string;
    merged_at?: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    user: {
        login: string;
        id: number;
        avatar_url: string;
        html_url: string;
    };
    assignee?: {
        login: string;
        id: number;
        avatar_url: string;
        html_url: string;
    };
    assignees: Array<{
        login: string;
        id: number;
        avatar_url: string;
        html_url: string;
    }>;
    labels: Array<{
        id: number;
        name: string;
        color: string;
        description?: string;
    }>;
    head: {
        ref: string;
        sha: string;
        repo?: {
            name: string;
            full_name: string;
            html_url: string;
        };
    };
    base: {
        ref: string;
        sha: string;
        repo: {
            name: string;
            full_name: string;
            html_url: string;
        };
    };
    draft: boolean;
    merged: boolean;
    mergeable?: boolean;
    commits: number;
    additions: number;
    deletions: number;
    changed_files: number;
}

// mergePullRequestApi:: https://api.github.com/repos/owner/repo/pulls/{number}/merge
export interface MergeResponse {
    sha: string;
    merged: boolean;
    message: string;
}

// getPullRequestReviewsApi:: https://api.github.com/repos/owner/repo/pulls/{number}/reviews
// createPullRequestReviewApi:: https://api.github.com/repos/owner/repo/pulls/{number}/reviews
export interface PullRequestReview {
    id: number;
    user: {
        login: string;
        id: number;
        avatar_url: string;
        html_url: string;
    };
    body: string;
    state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED' | 'PENDING';
    html_url: string;
    pull_request_url: string;
    submitted_at: string;
    commit_id: string;
    author_association: string;
}
