// listRepositoriesApi:: https://api.github.com/repos/chayan-1906/Busgo-React-Native
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


// branchDetailsApi:: https://api.github.com/repos/chayan-1906/Busgo-React-Native/branches/master
interface GitUser {
    name: string;
    email: string;
    date: string;
}

interface CommitVerification {
    verified: boolean;
    reason: string;
    signature: string | null;
    payload: string | null;
    verified_at: string | null;
}

interface CommitTree {
    sha: string;
    url: string;
}

interface CommitDetail {
    author: GitUser;
    committer: GitUser;
    message: string;
    tree: CommitTree;
    url: string;
    comment_count: number;
    verification: CommitVerification;
}

interface GitHubUser {
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

interface ParentCommit {
    sha: string;
    url: string;
    html_url: string;
}

interface Commit {
    sha: string;
    node_id: string;
    commit: CommitDetail;
    url: string;
    html_url: string;
    comments_url: string;
    author: GitHubUser;
    committer: GitHubUser;
    parents: ParentCommit[];
}

interface BranchLinks {
    self: string;
    html: string;
}

interface RequiredStatusChecks {
    enforcement_level: string;
    contexts: string[];
    checks: any[]; // You can define this if needed
}

interface BranchProtection {
    enabled: boolean;
    required_status_checks: RequiredStatusChecks;
}

export interface BranchInfo {
    name: string;
    commit: Commit;
    _links: BranchLinks;
    protected: boolean;
    protection: BranchProtection;
    protection_url: string;
}

// listFilesApi:: https://api.github.com/repos/chayan-1906/Busgo-React-Native/git/trees/master?recursive=1
interface FileItem {
    path: string;
    mode: string;
    type: "blob" | "tree" | "commit"; // file, directory, or submodule
    sha: string;
    size?: number;
    url: string;
}

export interface FileTree {
    sha: string;
    url: string;
    tree: FileItem[];
    truncated: boolean;
}

// getFileContentApi:: https://api.github.com/repos/chayan-1906/Busgo-React-Native/contents/src/index.dt.ts?ref=master
export interface GitHubContentLink {
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

// createRepository:: https://api.github.com/user/repos
