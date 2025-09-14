export const successHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>GitHub MCP - Authentication Successful</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐙</text></svg>">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: #333;
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 100vh;
			padding: 1rem;
		}

		.container {
			max-width: 500px;
			width: 100%;
		}

		.card {
			background: white;
			padding: 2.5rem;
			border-radius: 16px;
			box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1);
			text-align: center;
			border: 1px solid rgba(255, 255, 255, 0.2);
		}

		.success-icon {
			width: 80px;
			height: 80px;
			background: linear-gradient(135deg, #10B981, #059669);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 auto 1.5rem;
			font-size: 2.5rem;
			color: white;
			box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
		}

		.card h1 {
			color: #1a1a1a;
			margin: 0 0 0.5rem 0;
			font-size: 1.75rem;
			font-weight: 700;
			letter-spacing: -0.02em;
		}

		.card .subtitle {
			color: #6b7280;
			font-size: 1rem;
			margin-bottom: 2rem;
			font-weight: 500;
		}

		.info-section {
			background: #f8fafc;
			border-radius: 12px;
			padding: 1.5rem;
			margin: 1.5rem 0;
			border-left: 4px solid #10B981;
		}

		.info-row {
			display: flex;
			align-items: center;
			margin: 0.75rem 0;
			text-align: left;
		}

		.info-label {
			font-weight: 600;
			color: #374151;
			min-width: 120px;
			font-size: 0.9rem;
		}

		.info-value {
			color: #1f2937;
			font-weight: 500;
		}

		.token {
			background: #f1f5f9;
			border: 2px dashed #cbd5e1;
			padding: 1rem;
			border-radius: 8px;
			font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
			font-size: 0.85rem;
			word-wrap: break-word;
			color: #475569;
			margin-top: 0.5rem;
			position: relative;
			overflow: hidden;
		}

		.token::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 3px;
			background: linear-gradient(90deg, #10B981, #059669, #047857);
		}

		.instruction {
			background: #eff6ff;
			border: 1px solid #dbeafe;
			border-radius: 12px;
			padding: 1.25rem;
			margin-top: 2rem;
			display: flex;
			align-items: flex-start;
			text-align: left;
			gap: 0.75rem;
		}

		.instruction-icon {
			background: #3b82f6;
			color: white;
			width: 24px;
			height: 24px;
			border-radius: 6px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.875rem;
			flex-shrink: 0;
			margin-top: 2px;
		}

		.instruction-text {
			color: #1e40af;
			font-size: 0.95rem;
			line-height: 1.5;
			font-weight: 500;
		}

		.github-logo {
			display: inline-block;
			width: 20px;
			height: 20px;
			margin-right: 8px;
			vertical-align: middle;
		}

		@media (max-width: 480px) {
			.card {
				padding: 2rem 1.5rem;
			}

			.info-row {
				flex-direction: column;
				align-items: flex-start;
				gap: 0.25rem;
			}

			.info-label {
				min-width: unset;
			}
		}
    </style>
</head>
<body>
<div class="container">
	<div class="card">
		<div class="success-icon">✓</div>
		<h1>Authentication Successful</h1>
		<p class="subtitle">Connected to GitHub MCP Server</p>

		<div class="info-section">
			<div class="info-row">
				<span class="info-label">
					<svg class="github-logo" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
					</svg>
					Username:
				</span>
				<span class="info-value">{{username}}</span>
			</div>
			<div class="info-row">
				<span class="info-label">Session Token:</span>
			</div>
			<div class="token">{{token}}</div>
		</div>

		<div class="instruction">
			<div style="font-size: 1.5rem;">🎉</div>
			<div class="instruction-text">
				You are now authenticated and ready to use GitHub tools with Claude! You can close this tab and start using the GitHub MCP tools in Claude.
			</div>
		</div>
	</div>
</div>
</body>
</html>`;
