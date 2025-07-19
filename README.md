# 🚀 GitHub MCP Server

An MCP-compliant server built with TypeScript to extend Claude and other AI agents with superpowers for GitHub Repositories, Branches, Commits, Issues, and Actions.

---

## ⚙️ Quick Start

### Option 1: Use Pre-built Package

#### 1. Install Claude Desktop:

Download from [https://claude.ai/download](https://claude.ai/download)

#### 2. Download the Executable:

**macOS:**
📦 [Download macOS Executable]()

**Windows:**
📦 [Download Windows Executable](https://github.com/chayan-1906/GitHub-MCP/releases/latest/download/github-mcp-windows.pkg)

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

#### 4. (Optional) Stop the Server:

You can stop the server if needed (launching Claude will automatically stop the currently running instance/port)

#### 5. Launch Claude Desktop

Start Claude Desktop application

#### 6. Start Asking Tasks:

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

#### 4. 🧪 Run the MCP Server

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
| `myDetails`                  | Profile       | Retrieves details of the authenticated GitHub user, including username, display name, email (if available), avatar URL, and profile link            |
|                              |               |                                                                                                                                                     |
| `listRepositories`           | Repository    | Fetches repositories user has access to. Calls repeatedly with increasing currentPage until result is empty                                         |
| `getRepositoryDetails`       | Repository    | Fetches metadata of a GitHub repository (e.g., default branch, visibility, description, etc.). Useful before accessing files or commits from a repo |
| `createRepository`           | Repository    | Creates a new GitHub repository for the authenticated user with optional description, visibility, and initialization                                |
| `updateRepository`           | Repository    | Updates repository description and/or tags (topics) of a GitHub repository                                                                          |
| `renameRepository`           | Repository    | Renames a GitHub repository owned by the authenticated user                                                                                         |
| `deleteRepository`           | Repository    | Deletes a GitHub repository owned by the authenticated user. This action is irreversible                                                            |
| `modifyRepositoryVisibility` | Repository    | Modifies a GitHub repository visibility (private/public/internal)                                                                                   |
|                              |               |                                                                                                                                                     |
| `getAllCollaborators`        | Collaboration | Returns a combined list of accepted collaborators and pending invitations for a GitHub Repository, each marked with their status                    |
| `addRemoveCollaborators`     | Collaboration | Adds or removes a collaborator from a GitHub repository                                                                                             |
|                              |               |                                                                                                                                                     |
| `listFilesInRepository`      | File          | Fetches the recursive file structure (tree) of a specified GitHub repository branch. Requires repository and branch name                            |
| `getFileContent`             | File          | Reads and returns the raw content of a specific file from a GitHub repository branch                                                                |
| `commitRemoteFile`           | File          | Commits a file to a GitHub Repository using GitHub API. This does not use the local file system                                                     |
|                              |               |                                                                                                                                                     |
| `listBranches`               | Branch        | Fetches branches of the authenticated user's repository. Calls repeatedly with increasing currentPage until the result is empty                     |
| `getBranchDetails`           | Branch        | Fetches details of a specific branch in a GitHub repository                                                                                         |
| `createBranch`               | Branch        | Creates a new branch from a given commit SHA (usually the latest commit of an existing branch)                                                      |
| `setDefaultBranch`           | Branch        | Sets the default branch in a GitHub repository                                                                                                      |
| `deleteBranch`               | Branch        | Deletes a branch from a GitHub repository. Cannot delete the default branch                                                                         |
|                              |               |                                                                                                                                                     |
| `listCommits`                | Commit        | Fetches commits in a branch of a GitHub repository, page by page                                                                                    |
| `getCommitModifications`     | Commit        | Returns the list of files modified in a specific GitHub commit                                                                                      |
|                              |               |                                                                                                                                                     |
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

If you need additional GitHub tools or features that aren't currently available, please let me know! I'm happy to extend the functionality based on your requirements

## 🔗 License

ISC

---

<div align="center">
  <p>Made with ❤️ by Padmanabha Das</p>
  <p>⭐ Star this repo if you found it helpful!</p>
  <p><strong>Note:</strong> This server requires GitHub OAuth authentication. Please ensure you have proper credentials configured before running.</p>
</div>
