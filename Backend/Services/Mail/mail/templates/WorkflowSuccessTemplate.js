const workflowSuccessTemplate = (userName, workflowName, executionTime, output) => {
    // Helper function to format output data
    const formatOutput = (output) => {
        if (!output) return 'No output data available';
        
        if (typeof output === 'string') return output;
        
        if (typeof output === 'object') {
            return JSON.stringify(output, null, 2);
        }
        
        return String(output);
    };

    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Workflow Executed Successfully</title>
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
                background: linear-gradient(135deg, #10b981 0%, #1e2a78 100%);
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
                background: linear-gradient(135deg, #10b981, #ffffff);
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
                border: 2px solid #10b981;
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
                background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent);
                animation: shimmer 2s infinite;
            }

            @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            .workflow-label {
                font-size: 14px;
                color: #10b981;
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
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.3);
                border-radius: 10px;
                padding: 15px;
                text-align: center;
            }

            .stat-label {
                font-size: 12px;
                color: #10b981;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
            }

            .stat-value {
                font-size: 18px;
                font-weight: 700;
                color: #ffffff;
            }

            .output-container {
                background: #0a0a0a;
                border: 1px solid #2a2a2a;
                border-radius: 10px;
                padding: 20px;
                margin: 25px 0;
                text-align: left;
            }

            .output-label {
                font-size: 14px;
                color: #0fdbff;
                margin-bottom: 15px;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 600;
                text-align: center;
            }

            .output-content {
                background: #1a1a1a;
                border-radius: 8px;
                padding: 15px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                color: #cfcfcf;
                white-space: pre-wrap;
                word-wrap: break-word;
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid #333333;
            }

            .success-badge {
                background: rgba(16, 185, 129, 0.2);
                border: 1px solid #10b981;
                border-radius: 20px;
                padding: 8px 16px;
                display: inline-block;
                margin: 20px 0;
                color: #10b981;
                font-weight: 600;
                font-size: 14px;
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
                    <div class="logo-icon">✅</div>
                </div>
                <h1 class="brand-name">FlowEn</h1>
            </div>

            <!-- Main content -->
            <div class="content">
                <div class="message">Execution Successful</div>
                
                <div class="body">
                    <p>Great news, ${userName}!</p>
                    <p>Your workflow has been executed successfully. Here's what happened:</p>
                </div>

                <!-- Workflow Display -->
                <div class="workflow-container">
                    <div class="workflow-label">Workflow Name</div>
                    <div class="workflow-name">${workflowName}</div>
                </div>

                <div class="success-badge">
                    🎉 Execution Completed Successfully
                </div>

                <!-- Execution Statistics -->
                <div class="execution-stats">
                    <div class="stat-item">
                        <div class="stat-label">Execution Time</div>
                        <div class="stat-value">${executionTime}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Status</div>
                        <div class="stat-value">Success</div>
                    </div>
                </div>

                <!-- Output Results -->
                <div class="output-container">
                    <div class="output-label">Workflow Output</div>
                    <div class="output-content">${formatOutput(output)}</div>
                </div>

                <div class="divider"></div>

                <div class="body">
                    <p>Your workflow completed without any issues. The results are now available and ready for use.</p>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <div class="support">
                    Need help? Contact us at <a href="mailto:support@flowen.com">support@flowen.com</a>
                    <br>
                    We're here to assist you 24/7
                </div>
            </div>
        </div>
    </body>

    </html>`;
};

module.exports = workflowSuccessTemplate;