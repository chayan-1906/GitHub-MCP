export const successHtml = `<!-- This will be auto-generated -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Authentication successful</title>
    <style>
		body {
			margin: 0;
			font-family: 'Inter', Tahoma, Geneva, Verdana, sans-serif;
			background: #f4f6f8;
			color: #333;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100vh;
		}

		.card {
			background: white;
			padding: 2rem 3rem;
			border-radius: 12px;
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
			text-align: center;
			max-width: 400px;
			width: 100%;
		}

		.card h1 {
			color: #28a745;
			margin-bottom: 1rem;
		}

		.card p {
			margin: 0.5rem 0;
			word-break: break-word;
		}

		.token {
			background-color: #f1f1f1;
			padding: 0.5rem;
			border-radius: 6px;
			font-family: monospace;
			font-size: 0.9rem;
			word-wrap: break-word;
		}
    </style>
</head>
<body>
<div class="card">
    <h1>✅ Authentication Successful</h1>
    <p><strong>Email:</strong> {{username}}</p>
    <p><strong>Session Token:</strong></p>
    <div class="token">{{token}}</div>
    <p style="margin-top: 1.5rem; color: #555;">
        You are now authenticated 🎉 You can now close this tab and launch Claude.
    </p>
</div>
</body>
</html>`;
