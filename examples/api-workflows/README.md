# API Workflow Example

This example demonstrates how to create and edit a workflow in Activepieces using the REST API.

## Prerequisites

- Node.js 18 or higher
- An Activepieces instance (local or remote)
- An API key with permission to manage projects and flows

Set the following environment variables before running the script:

```bash
export API_URL="http://localhost:3000/api/v1"
export API_KEY="YOUR_API_KEY"
```

## Running

```
node workflow-example.js
```

The script will:
1. Create a project
2. Create a flow in that project
3. Update the trigger to run on a schedule
4. Add a Slack action step
5. Update the step to use Microsoft Teams instead
