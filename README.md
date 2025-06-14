# 🚀 GitHub MCP Server

An MCP-compliant server built with TypeScript to extend Claude and other AI agents with superpowers for GitHub Repos, Issues, Pull Requests, and Actions.

---

## ⚙️ Quick Start

### 1. 📁 Clone the repo

```
git clone https://github.com/chayan-1906/GitHub-MCP.git
cd GitHub-MCP
```

### 2. 📦 Install dependencies

```
npm install
```

## User Guide -- https://versed-blinker-33e.notion.site/GitHub-MCP-User-Guide-2120c027172280fb81ccda9b88b8e265

## 🧰 Available Tools

| Tool Name                           | Description                                                                                                                              |
|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------| 
| `myDetails`                         | Retrieves details of the authenticated GitHub user, including username, display name, email (if available), avatar URL, and profile link |
|                                     |                                                                                                                                          |
| `listRepositories`                  | Fetches and displays all repositories (public & private) of the authenticated GitHub user, including name, visibility, and description   |

## 🧪 Run the MCP Server

```
npm run dev
```

Or compile and run:

```
npm run package
```

## 👨‍💻 Tech Stack

• 🟦 **TypeScript** – Type-safe application development

•📄 **GitHub API** – GitHub integration and data access

•🧠 **MCP SDK** – Model Context Protocol server framework

•✅ **Zod** – Schema-based input validation

•🌱 **dotenv** – Environment variable management
