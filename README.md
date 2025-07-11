# 🚀 GitHub MCP Server

An MCP-compliant server built with TypeScript to extend Claude and other AI agents with superpowers for GitHub Repos,
Issues, Pull Requests, and Actions.

---

## ⚙️ Quick Start

### Option 1: Download Pre-built Package

Download the ready-to-use package file:

📦 **[Download PKG](https://github.com/chayan-1906/GitHub-MCP/releases/latest/download/github-mcp.pkg)**

Extract and run directly without compilation.

### Option 2: Build from Source

#### 1. 📁 Clone the repo

```bash
git clone https://github.com/chayan-1906/GitHub-MCP.git
cd GitHub-MCP
```

### 2. 📦 Install dependencies

```bash
npm install
```

### 3. 🔧 Setup Configuration

Configure your credentials in `src/config/config.ts`:

```typescript
export const PORT = 20253
export const DB_NAME = 'github';
export const CLIENT_ID = "your_github_client_id"
export const CLIENT_SECRET = "your_github_client_secret"
export const GITHUB_CALLBACK_URL = `http://localhost:${PORT}/github/oauth/callback`
export const MONGODB_URI = "your_mongodb_connection_string"
export const TOKEN_SECRET = "your_token_secret"
```

Replace placeholder values with your actual GitHub OAuth app credentials and MongoDB connection string.

### 4. 🧪 Run the MCP Server

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

| Tool Name                    | Category      | Description                                                                                                                                         |
|------------------------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| ---------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `myDetails`                  | Profile       | Retrieves details of the authenticated GitHub user, including username, display name, email (if available), avatar URL, and profile link            |
| ---------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `listRepositories`           | Repository    | Fetches repositories user has access to. Calls repeatedly with increasing currentPage until result is empty                                         |
| `getRepositoryDetails`       | Repository    | Fetches metadata of a GitHub repository (e.g., default branch, visibility, description, etc.). Useful before accessing files or commits from a repo |
| `createRepository`           | Repository    | Creates a new GitHub repository for the authenticated user with optional description, visibility, and initialization                                |
| `updateRepository`           | Repository    | Updates repository description and/or tags (topics) of a GitHub repository                                                                          |
| `renameRepository`           | Repository    | Renames a GitHub repository owned by the authenticated user                                                                                         |
| `deleteRepository`           | Repository    | Deletes a GitHub repository owned by the authenticated user. This action is irreversible                                                            |
| `modifyRepositoryVisibility` | Repository    | Modifies the visibility of a GitHub repository (public/private/internal)                                                                            |
| ---------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getAllCollaborators`        | Collaboration | Returns a combined list of accepted collaborators and pending invitations for a GitHub Repository, each marked with their status                    |
| `addRemoveCollaborators`     | Collaboration | Adds or removes a collaborator from a GitHub repository                                                                                             |
| ---------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `listFilesInRepository`      | File          | Fetches the recursive file structure (tree) of a specified GitHub repository branch. Requires repository and branch name                            |
| `getFileContent`             | File          | Reads and returns the raw content of a specific file from a GitHub repository branch                                                                |
| `commitRemoteFile`           | File          | Commits a file to a GitHub Repository using GitHub API. This does not use the local file system                                                     |
| ---------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `listBranches`               | Branch        | Fetches branches of the authenticated user's repository. Calls repeatedly with increasing currentPage until the result is empty                     |
| `getBranchDetails`           | Branch        | Fetches details of a specific branch in a GitHub repository                                                                                         |
| `createBranch`               | Branch        | Creates a new branch from a given commit SHA (usually the latest commit of an existing branch)                                                      |
| `setDefaultBranch`           | Branch        | Sets the default branch in a GitHub repository                                                                                                      |
| `deleteBranch`               | Branch        | Deletes a branch from a GitHub repository. Cannot delete the default branch                                                                         |
| ---------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `listCommits`                | Commit        | Fetches commits in a branch of a GitHub repository, page by page                                                                                    |
| `getCommitModifications`     | Commit        | Returns the list of files modified in a specific GitHub commit                                                                                      |
| ---------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createIssue`                | Issue         | Creates a new issue in a GitHub repository. Including body and labels is optional                                                                   |
| `updateIssue`                | Issue         | Updates the title and/or body of an existing GitHub issue                                                                                           |
| `updateIssueState`           | Issue         | Updates the state of a GitHub issue (open or closed) by issue number                                                                                |
| `assignIssue`                | Issue         | Assigns one or more GitHub users to a GitHub issue                                                                                                  |

---

## 🔧 Features

- **🔐 OAuth Authentication**: Secure GitHub OAuth integration
- **📊 Repository Management**: Complete CRUD operations for repositories
- **🌳 Branch Operations**: Create, list, and manage branches
- **📝 Issue Tracking**: Full issue lifecycle management
- **👥 Collaboration**: Manage collaborators and permissions
- **📁 File Operations**: Read, write, and commit files
- **🔄 Commit History**: Access and analyze commit data
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
- File operations
- Collaboration features
- Commit history
- User profile management

## 👨‍💻 Tech Stack

- 🟦 **TypeScript** – Type-safe application development
- 📄 **GitHub API** – GitHub integration and data access
- 🧠 **MCP SDK** – Model Context Protocol server framework
- ✅ **Zod** – Schema-based input validation
- 🌱 **dotenv** – Environment variable management
- 🔐 **OAuth 2.0** – Secure authentication
- 📊 **MongoDB** – Data persistence
- 🚀 **Express.js** – Web server framework

## 🔗 License

ISC

---

**Note**: This server requires GitHub OAuth authentication. Please ensure you have proper credentials configured before
running.