import { Tool } from "../types";

export const generateHomepageHTML = (toolsByCategory: Record<string, Tool[]>, port: number): string => {
    const categories = Object.keys(toolsByCategory);

    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>GitHub MCP Server - Tools Overview</title>
            <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐙</text></svg>">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
    
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif;
                    line-height: 1.6;
                    color: #24292e;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }
    
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                }
    
                .header {
                    text-align: center;
                    margin-bottom: 3rem;
                    background: rgba(255, 255, 255, 0.95);
                    /*backdrop-filter: blur(10px);*/
                    border-radius: 20px;
                    padding: 2.5rem;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }
    
                .header h1 {
                    font-size: 3rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 1rem;
            }

                .header-title {
                    font-size: 3rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    display: block;
                }
    
                .header p {
                    font-size: 1.2rem;
                    color: #586069;
                    margin-bottom: 2rem;
                }
    
                .auth-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #28a745, #20c997);
                    color: white;
                    padding: 1rem 2rem;
                    text-decoration: none;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
                }
    
                .auth-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
                }
    
                .category {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }
    
                .category-title {
                    font-size: 1.8rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    color: #24292e;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
    
                .category-icon {
                    width: 28px;
                    height: 28px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }
    
                .tools-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 1.5rem;
                }
    
                .tool-card {
                    background: #f8f9fa;
                    border: 1px solid #e1e4e8;
                    border-radius: 12px;
                    padding: 1.5rem;
                    transition: all 0.3s ease;
                }
    
                .tool-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    border-color: #0366d6;
                }
    
                .tool-name {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #0366d6;
                    margin-bottom: 0.5rem;
                }
    
                .tool-description {
                    color: #586069;
                    margin-bottom: 1rem;
                    line-height: 1.5;
                }
    
                .tool-parameters {
                    margin-top: 1rem;
                }
    
                .parameters-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #24292e;
                    margin-bottom: 0.5rem;
                }
    
                .parameter {
                    background: #fff;
                    border: 1px solid #e1e4e8;
                    border-radius: 6px;
                    padding: 0.5rem 0.75rem;
                    margin-bottom: 0.5rem;
                    font-size: 0.85rem;
                }
    
                .parameter-name {
                    font-weight: 600;
                    color: #0366d6;
                }
    
                .parameter-optional {
                    background: #fff3cd;
                    border-color: #ffeaa7;
                }
    
                .parameter-required {
                    background: #f8d7da;
                    border-color: #f5c6cb;
                }
    
                .stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-bottom: 3rem;
                }
    
                .stat-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    padding: 1.5rem;
                    text-align: center;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                }
    
                .stat-number {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #0366d6;
                }
    
                .stat-label {
                    color: #586069;
                    font-weight: 500;
                    margin-top: 0.5rem;
                }
    
                .footer {
                    text-align: center;
                    padding: 2rem;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.9rem;
                }
    
                @media (max-width: 768px) {
                .container {
                    padding: 1rem;
                }
                
                .header h1 {
                    font-size: 2rem;
                }
                
                .tools-grid {
                    grid-template-columns: 1fr;
                }
                
                .stats {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
         </style>
         </head>
        <body>
            <div class="container">
                <div class="header">
                    <span class="header-title"><span style="font-family: 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif;">🤖</span> GitHub MCP Server</span>
                    <p>Complete GitHub integration for Claude AI with ${Object.values(toolsByCategory).flat().length} powerful tools</p>
                    <a href="http://localhost:${port}/auth" class="auth-button">
                        <span style="font-family: 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif;">🔐</span> Authenticate with GitHub
                    </a>
                </div>
        
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-number">${Object.values(toolsByCategory).flat().length}</div>
                        <div class="stat-label">Total Tools</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${categories.length}</div>
                        <div class="stat-label">Categories</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Object.values(toolsByCategory).flat().filter(tool => tool.parameters.length === 0).length}</div>
                        <div class="stat-label">Parameter-free</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Object.values(toolsByCategory).flat().filter(tool => tool.parameters.some(p => p.optional)).length}</div>
                        <div class="stat-label">Flexible Tools</div>
                    </div>
                </div>
        
                ${categories.map(category => {
        const categoryIcons = {
            'Profile': {icon: '👤', color: '#6f42c1'},
            'Repositories': {icon: '📦', color: '#0366d6'},
            'Collaboration': {icon: '🤝', color: '#28a745'},
            'Branches': {icon: '🌿', color: '#28a745'},
            'Files': {icon: '📄', color: '#f66a0a'},
            'Commits': {icon: '💾', color: '#6f42c1'},
            'Issues': {icon: '🐛', color: '#d73a49'},
            'Pull Requests': {icon: '🔄', color: '#0366d6'},
            'Releases': {icon: '🏷️', color: '#28a745'}
        };
        const categoryInfo = categoryIcons[category as keyof typeof categoryIcons] || {icon: '⚡', color: '#586069'};

        return `
                <div class="category">
                    <h2 class="category-title">
                        <span class="category-icon" style="background-color: ${categoryInfo.color}20; color: ${categoryInfo.color}; font-family: 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif;">
                            ${categoryInfo.icon}
                        </span>
                        ${category}
                        <span style="font-size: 0.8rem; font-weight: normal; color: #586069; margin-left: auto;">
                            ${toolsByCategory[category].length} tools
                        </span>
                    </h2>
                    <div class="tools-grid">
                        ${toolsByCategory[category].map(tool => `
                        <div class="tool-card">
                            <div class="tool-name">${tool.name}</div>
                            <div class="tool-description">${tool.userFriendlyDescription}</div>
                            ${tool.parameters.length > 0 ? `
                            <div class="tool-parameters">
                                <div class="parameters-title">Parameters:</div>
                                ${tool.parameters.map(param => `
                                <div class="parameter ${param.optional ? 'parameter-optional' : 'parameter-required'}">
                                    <span class="parameter-name">${param.name}</span>
                                    ${param.optional ? ' (optional)' : ' (required)'}: ${param.userFriendlyDescription || param.techDescription}
                                </div>
                                `).join('')}
                            </div>
                            ` : ''}
                        </div>
                        `).join('')}
                    </div>
                </div>
                    `;
    }).join('')}
        
                <div class="footer">
                    <p>🔧 Built with Express.js & TypeScript | 🤖 Powered by Model Context Protocol</p>
                    <p>Visit <a href="/auth" style="color: #fff; text-decoration: underline;">localhost:${port}/auth</a> to authenticate and start using these tools with Claude AI</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
