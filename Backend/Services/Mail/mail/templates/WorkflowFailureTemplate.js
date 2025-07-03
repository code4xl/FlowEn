const workflowFailureTemplate = (userName, workflowName, executionTime, errorMessage) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Workflow Execution Failed</title>
        <style>
            body {
                background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #ffffff;
                margin: 0;
                padding: 20px;
                min-height: 100vh;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(145deg, #121212, #1a1a1a);
                border-radius: 20px;
                border: 1px solid #2a2a2a;
                box-shadow: 0 20px 40px rgba(255, 255, 255, 0.05);
                overflow: hidden;
            }

            .header {
                background: linear-gradient(135deg, #ef4444 0%, #1e2a78 100%);
                padding: 30px 20px;
                text-align: center;
                position: relative;
            }

            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
            }

            .logo {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                border: 3px solid rgba(255, 255, 255, 0.2);
                background: rgba(255, 255, 255, 0.1);
                margin: 0 auto 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
                position: relative;
                z-index: 1;
            }

            .logo-icon {
                font-size: 36px;
                color: #ffffff;
            }

            .brand-name {
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                margin: 0;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                position: relative;
                z-index: 1;
            }

            .content {
                padding: 40px 30px;
                text-align: center;
            }

            .message {
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 20px;
                color: #ffffff;
                background: linear-gradient(135deg, #ef4444, #ffffff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .body {
                font-size: 16px;
                margin-bottom: 30px;
                color: #cfcfcf;
                line-height: 1.7;
            }

            .workflow-container {
                background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
                border: 2px solid #ef4444;
                border-radius: 15px;
                padding: 25px;
                margin: 30px 0;
                position: relative;
                overflow: hidden;
            }

            .workflow-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1), transparent);
                animation: shimmer 2s infinite;
            }

            @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            .workflow-label {
                font-size: 14px;
                color: #ef4444;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 600;
            }

            .workflow-name {
                font-size: 20px;
                font-weight: 700;
                color: #ffffff;
                margin: 0;
                position: relative;
                z-index: 1;
            }

            .execution-stats {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 25px 0;
            }

            .stat-item {
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                border-radius: 10px;
                padding: 15px;
                text-align: center;
            }

            .stat-label {
                font-size: 12px;
                color: #ef4444;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
            }

            .stat-value {
                font-size: 18px;
                font-weight: 700;
                color: #ffffff;
            }

            .error-container {
                background: #0a0a0a;
                border: 1px solid #ef4444;
                border-radius: 10px;
                padding: 20px;
                margin: 25px 0;
                text-align: left;
            }

            .error-label {
                font-size: 14px;
                color: #ef4444;
                margin-bottom: 15px;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 600;
                text-align: center;
            }

            .error-content {
                background: #1a1a1a;
                border-radius: 8px;
                padding: 15px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                color: #ff6b9d;
                white-space: pre-wrap;
                word-wrap: break-word;
                border: 1px solid #ef4444;
            }

            .failure-badge {
                background: rgba(239, 68, 68, 0.2);
                border: 1px solid #ef4444;
                border-radius: 20px;
                padding: 8px 16px;
                display: inline-block;
                margin: 20px 0;
                color: #ef4444;
                font-weight: 600;
                font-size: 14px;
            }

            .troubleshooting {
                background: rgba(15, 219, 255, 0.05);
                border: 1px solid rgba(15, 219, 255, 0.2);
                border-radius: 10px;
                padding: 20px;
                margin: 25px 0;
                color: #cfcfcf;
                font-size: 14px;
                line-height: 1.6;
                text-align: left;
            }

            .troubleshooting-title {
                color: #0fdbff;
                font-weight: 600;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
            }

            .troubleshooting-icon {
                color: #0fdbff;
                font-size: 18px;
                margin-right: 8px;
            }

            .troubleshooting ul {
                margin: 10px 0 0 20px;
                padding: 0;
            }

            .troubleshooting li {
                margin-bottom: 8px;
            }

            .footer {
                background: #0a0a0a;
                padding: 25px 30px;
                text-align: center;
                border-top: 1px solid #2a2a2a;
            }

            .support {
                font-size: 14px;
                color: #999999;
                line-height: 1.6;
            }

            .support a {
                color: #0fdbff;
                text-decoration: none;
                font-weight: 600;
            }

            .support a:hover {
                text-decoration: underline;
            }

            .divider {
                height: 1px;
                background: linear-gradient(90deg, transparent, #2a2a2a, transparent);
                margin: 20px 0;
            }

            /* Responsive */
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                    border-radius: 15px;
                }
                
                .content {
                    padding: 30px 20px;
                }
                
                .execution-stats {
                    grid-template-columns: 1fr;
                }
                
                .workflow-name {
                    font-size: 18px;
                }
            }
        </style>
    </head>

    <body>
        <div class="container">
            <!-- Header with logo and brand -->
            <div class="header">
                <div class="logo">
                    <div class="logo-icon">❌</div>
                </div>
                <h1 class="brand-name">FlowEn</h1>
            </div>

            <!-- Main content -->
            <div class="content">
                <div class="message">Execution Failed</div>
                
                <div class="body">
                    <p>Hello ${userName},</p>
                    <p>We're sorry to inform you that your workflow execution encountered an issue. Here are the details:</p>
                </div>

                <!-- Workflow Display -->
                <div class="workflow-container">
                    <div class="workflow-label">Workflow Name</div>
                    <div class="workflow-name">${workflowName}</div>
                </div>

                <div class="failure-badge">
                    ⚠️ Execution Failed
                </div>

                <!-- Execution Statistics -->
                <div class="execution-stats">
                    <div class="stat-item">
                        <div class="stat-label">Execution Time</div>
                        <div class="stat-value">${executionTime}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Status</div>
                        <div class="stat-value">Failed</div>
                    </div>
                </div>

                <!-- Error Details -->
                <div class="error-container">
                    <div class="error-label">Error Details</div>
                    <div class="error-content">${errorMessage || 'Unknown error occurred during execution'}</div>
                </div>

                <!-- Troubleshooting Tips -->
                <div class="troubleshooting">
                    <div class="troubleshooting-title">
                        <span class="troubleshooting-icon">🛠️</span>
                        Troubleshooting Tips
                    </div>
                    <ul>
                        <li>Check if all required data sources are accessible</li>
                        <li>Verify that your workflow configuration is correct</li>
                        <li>Ensure you have sufficient credits for execution</li>
                        <li>Review the error message above for specific issues</li>
                        <li>Try running the workflow manually to test</li>
                    </ul>
                </div>

                <div class="divider"></div>

                <div class="body">
                    <p>Don't worry - workflow failures can happen for various reasons. Our team has been notified and will investigate if this is a system issue.</p>
                    <p>You can retry the workflow or contact our support team for assistance.</p>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <div class="support">
                    Need immediate help? Contact us at <a href="mailto:support@flowen.com">support@flowen.com</a>
                    <br>
                    We're here to assist you 24/7
                </div>
            </div>
        </div>
    </body>

    </html>`;
};

module.exports = workflowFailureTemplate;