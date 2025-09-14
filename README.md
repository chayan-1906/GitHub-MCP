# 🐙 GitHub MCP Server

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/chayan-1906/GitHub-MCP)
[![Node.js](https://img.shields.io/badge/node.js-16.x+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/express-5.1.0-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-6.18.0-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![MCP](https://img.shields.io/badge/model_context_protocol-compliant-purple.svg)](https://modelcontextprotocol.io/)
[![GitHub OAuth](https://img.shields.io/badge/github-oauth-black.svg)](https://docs.github.com/en/developers/apps/building-oauth-apps)

An MCP-compliant server built with TypeScript to extend Claude and other AI agents with superpowers for GitHub
Repositories, Branches, Commits, Issues, Pull Requests, Releases, and Actions. Pre-built executables available for
macOS, Windows, and
Linux for easy end-user installation without Node.js dependencies.

---

<img src="https://raw.githubusercontent.com/chayan-1906/GitHub-MCP/master/github.png" alt="logo" width="150"/>

## ⚙️ Quick Start

### Option 1: Use Pre-built Package

#### 1. Install Claude Desktop:

Download from [https://claude.ai/download](https://claude.ai/download)

#### 2. Download the Executable:

**macOS:**
📦 [Download macOS Executable](https://github.com/chayan-1906/GitHub-MCP/releases/download/v1.2.0/github)

**Windows:**
📦 [Download Windows Executable](https://github.com/chayan-1906/GitHub-MCP/releases/download/v1.2.0/github.exe)

#### 3. Run the Executable:

- **For macOS users**:
  ```bash
  chmod +x github
  ./github
  ```
- **For Windows users**:
  Double-click the file, or run via terminal: `.\github.exe`

**Note**:

1. No need to run the executable repeatedly
2. Do NOT delete the executable after running
3. If you rename, move, or modify the executable, you must run it again (Step 3) to restart it properly

#### 4. 🌐 Explore Available Tools (Optional)

Visit the homepage to browse all available tools:

- **Homepage**: **http://localhost:20253/**
- See all 44+ GitHub tools with user-friendly descriptions
- Great for understanding what the server can do

#### 5. (Optional) Stop the Server:

You can stop the server if needed (launching Claude will automatically stop the currently running instance/port)

#### 6. Launch Claude Desktop

Start Claude Desktop application

#### 7. Start Asking Tasks:

Claude will now recognize the available tools with descriptions

**Important**: When prompting Claude, include "use available GitHub tools" in your prompts to ensure the LLM utilizes
the GitHub MCP tools instead of defaulting to web search

### Option 2: Build from Source

#### 1. 📁 Clone the repo

```bash
git clone https://github.com/chayan-1906/GitHub-MCP.git
cd GitHub-MCP
```

#### 2. 📦 Install dependencies

```bash
npm install
```

#### 3. 🔧 Setup Configuration

Configure your credentials in `src/config/config.ts`:

```typescript
export const PORT = 20253
export const DB_NAME = "github";
export const CLIENT_ID = "your_github_client_id"
export const CLIENT_SECRET = "your_github_client_secret"
export const GITHUB_CALLBACK_URL = `http://localhost:${PORT}/github/oauth/callback`
export const MONGODB_URI = "your_mongodb_connection_string"
export const TOKEN_SECRET = "your_token_secret"
```

Replace placeholder values with your actual GitHub OAuth app credentials and MongoDB connection string.

**Generate a secure token secret:**

```bash
openssl rand -hex 32
```

#### 4. 🌐 Explore Available Tools

Visit the homepage to see all available tools with user-friendly descriptions:

- **Homepage**: **http://localhost:20253/**
- Browse all 44+ GitHub tools organized by category
- View user-friendly descriptions and use cases
- Perfect for understanding the server's capabilities

#### 5. 🔧 Switch GitHub Accounts

To authenticate with a different GitHub account or refresh your session:

- Visit: **http://localhost:20253/auth**
- Complete OAuth flow with desired GitHub account

#### 6. 🧪 Run the MCP Server

```bash
npm run dev
```

Or compile and run:

```bash
npm run build
npm run bundle
npm run package
```

## 📖 User Guide

Detailed
documentation: [GitHub MCP User Guide](https://versed-blinker-33e.notion.site/GitHub-MCP-User-Guide-2120c027172280fb81ccda9b88b8e265)

---

## 🧰 Available Tools

| Tool Name                      | Category      | Description                                                                                                                                                                                                                |
|--------------------------------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `my-github-account`            | Profile       | Retrieves details of the authenticated GitHub user, including username, display name, email (if available), avatar URL, and profile link                                                                                   |
|                                |               |                                                                                                                                                                                                                            |
| `list-repositories`            | Repositories  | Fetches repositories user has access to. Calls repeatedly with increasing currentPage until result is empty                                                                                                                |
| `get-repository-details`       | Repositories  | Fetches metadata of a GitHub repository (e.g., default branch, visibility, description, etc.). Useful before accessing files or commits from a repo                                                                        |
| `create-repository`            | Repositories  | Creates a new GitHub repository for the authenticated user with optional description, visibility, and initialization                                                                                                       |
| `update-repository`            | Repositories  | Updates repository description and/or tags (topics) of a GitHub repository                                                                                                                                                 |
| `rename-repository`            | Repositories  | Renames a GitHub repository owned by the authenticated user                                                                                                                                                                |
| `delete-repository`            | Repositories  | Deletes a GitHub repository owned by the authenticated user. This action is irreversible                                                                                                                                   |
| `modify-repository-visibility` | Repositories  | Modifies a GitHub repository visibility (private/public/internal)                                                                                                                                                          |
| `list-collaborators`           | Repositories  | Returns a combined list of accepted collaborators and pending invitations for a GitHub Repository, each marked with their status                                                                                           |
| `add-remove-collaborators`     | Repositories  | Adds or removes a collaborator from a GitHub repository                                                                                                                                                                    |
|                                |               |                                                                                                                                                                                                                            |
| `list-branches`                | Branches      | Fetches branches of the authenticated user's repository. Calls repeatedly with increasing currentPage until the result is empty                                                                                            |
| `get-branch-details`           | Branches      | Fetches details of a specific branch in a GitHub repository                                                                                                                                                                |
| `create-branch`                | Branches      | Creates a new branch from a given commit SHA (usually the latest commit of an existing branch)                                                                                                                             |
| `set-default-branch`           | Branches      | Sets the default branch in a GitHub repository                                                                                                                                                                             |
| `delete-branch`                | Branches      | Deletes a branch from a GitHub repository. Cannot delete the default branch                                                                                                                                                |
|                                |               |                                                                                                                                                                                                                            |
| `repository-tree`              | Files         | Displays the hierarchical tree structure of a GitHub repository branch with ASCII tree formatting. Shows files and directories in a visual tree layout with filtering and pagination support.                              |
| `get-file-content`             | Files         | Reads and returns the raw content of a specific file from a GitHub repository branch                                                                                                                                       |
| `commit-remote-file`           | Files         | Commits a file to a GitHub Repository using GitHub API. This does not use the local file system. • parentCommitSha & baseTreeSha: must be real SHAs. • If the repository is empty, omit these fields (don't pass 000…000). |
|                                |               |                                                                                                                                                                                                                            |
| `list-commits`                 | Commits       | Fetches commits in a branch of a GitHub repository, page by page                                                                                                                                                           |
| `get-commit-modifications`     | Commits       | Returns the list of files modified in a specific GitHub commit                                                                                                                                                             |
|                                |               |                                                                                                                                                                                                                            |
| `list-issues`                  | Issues        | Fetches issues from a GitHub repository, page by page. Calls repeatedly with increasing currentPage until result is empty                                                                                                  |
| `get-issue-details`            | Issues        | Fetches detailed information about a specific GitHub issue by issue number                                                                                                                                                 |
| `get-issue-comments`           | Issues        | Fetches all comments for a GitHub issue, including the original issue, all comments, and participant details. Automatically fetches all pages of comments                                                                  |
| `create-issue`                 | Issues        | Creates a new issue in a GitHub repository. Including body and labels is optional                                                                                                                                          |
| `update-issue`                 | Issues        | Updates the title, body, and/or labels of an existing GitHub issue. Also works for pull requests since PRs are treated as issues for label management.                                                                     |
| `update-issue-state`           | Issues        | Updates the state of a GitHub issue (open or closed) by issue number                                                                                                                                                       |
| `assign-issue`                 | Issues        | Assigns one or more GitHub users to a GitHub issue                                                                                                                                                                         |
|                                |               |                                                                                                                                                                                                                            |
| `list-pull-requests`           | Pull Requests | Fetches all pull requests from a GitHub repository, page by page. Filter by state and sort options available                                                                                                               |
| `get-pull-request-details`     | Pull Requests | Fetches detailed information about a specific GitHub pull request by PR number                                                                                                                                             |
| `create-pull-request`          | Pull Requests | Creates a new pull request in a GitHub repository. Compares changes between two branches and creates a PR for review                                                                                                       |
| `update-pull-request`          | Pull Requests | Updates title, body, state, and base branch of an existing pull request                                                                                                                                                    |
| `list-pull-request-commits`    | Pull Requests | Lists all commits in a specific pull request with pagination support                                                                                                                                                       |
| `list-pull-request-files`      | Pull Requests | Lists all files changed in a specific pull request with diff information                                                                                                                                                   |
| `update-pull-request-state`    | Pull Requests | Updates the state of a pull request (open or closed)                                                                                                                                                                       |
| `merge-pull-request`           | Pull Requests | Merges a GitHub pull request only if PR is open, not draft, and has no conflicts                                                                                                                                           |
| `get-pull-request-reviews`     | Pull Requests | Lists all reviews for a specific GitHub pull request, page by page                                                                                                                                                         |
| `create-pull-request-review`   | Pull Requests | Creates a review for a GitHub pull request. Can approve, request changes, or add comments                                                                                                                                  |
| `request-pull-request-review`  | Pull Requests | Requests reviews from users and/or teams for a GitHub pull request                                                                                                                                                         |
| `dismiss-pull-request-review`  | Pull Requests | Dismisses a pull request review with a message explaining why it was dismissed                                                                                                                                             |
| `mark-pull-request-review`     | Pull Requests | Submits a pending pull request review by marking it with APPROVE, REQUEST_CHANGES, or COMMENT                                                                                                                              |
|                                |               |                                                                                                                                                                                                                            |
| `list-releases`                | Releases      | Fetches all releases in a GitHub repository, page by page                                                                                                                                                                  |
| `create-release`               | Releases      | Creates a GitHub release from an existing tag or creates a new tag and release                                                                                                                                             |
| `update-release`               | Releases      | Updates an existing GitHub release by release ID with new information                                                                                                                                                      |
| `delete-release`               | Releases      | Deletes a GitHub release by release ID. This action is irreversible                                                                                                                                                        |

---

## 📋 Changelog

### v1.1.0 (2025-07-29)

#### ✨ New Features

- **Release Management Tools**: Added complete GitHub release lifecycle management
    - `list-releases` - Paginated release listing with full metadata
    - `create-release` - Create releases from existing tags or new tags
    - `update-release` - Modify existing release information
    - `delete-release` - Remove releases (irreversible action)

#### 🔄 Changes

- Renamed `my-details` → `my-github-account` for consistency

#### 📊 Statistics

- **Total Tools**: 29 (increased from 25 in v1.0.0)
- **New Category**: Release management operations
- **API Coverage**: Extended GitHub REST API v4 support

### v1.0.0 (2025-07-19)

#### 🚀 Initial Release

- **25 GitHub API Tools** for AI agents
- **OAuth 2.0 Authentication** with GitHub
- **Repository Management** - CRUD operations, visibility, collaboration
- **Branch Operations** - Create, delete, list, set default
- **Issue Management** - Create, update, assign, state changes
- **File Operations** - Read content, commit files, list repository tree
- **Commit History** - List commits, get modifications

---

## 🔧 Features

- **🔐 OAuth Authentication**: Secure GitHub OAuth integration
- **📊 Repository Management**: Complete CRUD operations for repositories
- **🌳 Branch Operations**: Create, list, and manage branches
- **📝 Issue Tracking**: Full issue lifecycle management
- **🔀 Pull Request Management**: Create, review, merge, and manage pull requests
- **👥 Collaboration**: Manage collaborators and permissions
- **📁 File Operations**: Read, write, and commit files
- **🔄 Commit History**: Access and analyze commit data
- **🚀 Release Management**: Create and update releases
- **⚡ Real-time Updates**: Live synchronization with GitHub API

## 🛠️ Architecture

The server is structured with:

- **Tools**: Individual GitHub operation handlers
- **Services**: OAuth and API management
- **Utils**: Helper functions and constants
- **Types**: TypeScript type definitions
- **Config**: Environment and configuration management

## 🔍 API Coverage

This MCP server provides comprehensive coverage of GitHub's REST API v4, including:

- Repository operations
- Branch management
- Issue tracking
- Pull request management
- File operations
- Collaboration features
- Commit history
- Release management
- User profile management

## 👨‍💻 Tech Stack

- 🟦 **TypeScript** – Type-safe application development
- 📄 **GitHub API** – GitHub integration and data access
- 🧠 **MCP SDK** – Model Context Protocol server framework
- ✅ **Zod** – Schema-based input validation
- 🔐 **OAuth 2.0** – Secure authentication
- 📊 **MongoDB** – Data persistence
- 🚀 **Express.js** – Web server framework

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/add-github-discussions` or
   `git checkout -b fix/oauth-callback-error`)
3. Commit your changes (`git commit -m 'Add GitHub Discussions API support'` or
   `git commit -m 'Fix OAuth callback redirect issue'`)
4. Push to the branch (`git push origin feature/add-github-discussions`)
5. Open a Pull Request

## 👨‍💻 Author

**Padmanabha Das**

- GitHub: [@chayan-1906](https://github.com/chayan-1906)
- LinkedIn: [Padmanabha Das](https://www.linkedin.com/in/padmanabha-das-59bb2019b/)
- Email: padmanabhadas9647@gmail.com

## 🌟 Show Your Support

If this project helped you, please give it a ⭐️!

## 📱 Connect With Me

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/chayan-ranjan-das/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black)](https://github.com/chayan-1906)

## 💡 Need More Tools?

If you need additional GitHub tools or features that aren't currently available, please let me know! I'm happy to extend
the functionality based on your requirements

## 🔗 License

ISC

---

<div align="center">
  <p>Made with ❤️ by Padmanabha Das</p>
  <p>⭐ Star this repo if you found it helpful!</p>
  <p><strong>Note:</strong> This server requires GitHub OAuth authentication. Please ensure you have proper credentials configured before running.</p>
</div>
