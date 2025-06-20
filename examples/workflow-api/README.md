# Workflow API Example

This example demonstrates creating a new workflow and updating one of its steps using the REST API.

## Prerequisites

- Node.js installed
- An Activepieces instance running (Community edition works)
- An API key and project ID

Set these environment variables before running:

```bash
export API_BASE_URL=http://localhost:3000/api/v1
export AP_API_KEY=<your-api-key>
export PROJECT_ID=<your-project-id>
```

## Usage

Install dependencies and execute the script:

```bash
npm install node-fetch
node createAndUpdateFlow.js
```

The script performs the following:

1. **Create Flow** – `POST /v1/flows`
2. **Import Flow Definition** – `POST /v1/flows/{id}` with `IMPORT_FLOW`
3. **Update Action Step** – `POST /v1/flows/{id}` with `UPDATE_ACTION`

Check the console output for newly created flow ID and status messages.

For full API details see the [OpenAPI specification](../../docs/openapi.json).
