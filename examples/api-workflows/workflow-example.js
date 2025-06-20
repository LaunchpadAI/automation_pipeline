// Simple example using fetch to create and update a workflow

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

if (!API_URL || !API_KEY) {
  console.error('Please set API_URL and API_KEY environment variables');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${API_KEY}`,
};

async function api(path, options) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  if (!res.ok) {
    throw new Error(`API call failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function run() {
  // 1. create project
  const project = await api('/projects', {
    method: 'POST',
    body: JSON.stringify({ displayName: 'API Demo Project' }),
  });
  console.log('Created project', project.id);

  // 2. create flow
  const flow = await api('/flows', {
    method: 'POST',
    body: JSON.stringify({ displayName: 'Demo Flow', projectId: project.id }),
  });
  console.log('Created flow', flow.id);

  // 3. update trigger to schedule piece "every_day"
  await api(`/flows/${flow.id}`, {
    method: 'POST',
    body: JSON.stringify({
      type: 'UPDATE_TRIGGER',
      request: {
        name: 'trigger',
        valid: true,
        displayName: 'Every Day',
        type: 'PIECE_TRIGGER',
        settings: {
          packageType: 'REGISTRY',
          pieceType: 'OFFICIAL',
          pieceName: 'schedule',
          pieceVersion: '0.1.5',
          triggerName: 'every_day',
          input: {
            hour_of_the_day: 0,
            timezone: 'UTC',
            run_on_weekends: true,
          },
          inputUiInfo: {},
        },
      },
    }),
  });
  console.log('Updated trigger');

  // 4. add slack action step
  await api(`/flows/${flow.id}`, {
    method: 'POST',
    body: JSON.stringify({
      type: 'ADD_ACTION',
      request: {
        parentStep: 'trigger',
        stepLocationRelativeToParent: 'AFTER',
        action: {
          name: 'step_1',
          valid: true,
          displayName: 'Send Slack Message',
          type: 'PIECE',
          settings: {
            packageType: 'REGISTRY',
            pieceType: 'OFFICIAL',
            pieceName: 'slack',
            pieceVersion: '0.9.1',
            actionName: 'send_channel_message',
            input: {
              channel: 'CHANNEL_ID',
              text: 'Hello from API',
            },
            inputUiInfo: {},
          },
        },
      },
    }),
  });
  console.log('Added Slack step');

  // 5. change the action to Microsoft Teams
  await api(`/flows/${flow.id}`, {
    method: 'POST',
    body: JSON.stringify({
      type: 'UPDATE_ACTION',
      request: {
        name: 'step_1',
        valid: true,
        displayName: 'Send Teams Message',
        type: 'PIECE',
        settings: {
          packageType: 'REGISTRY',
          pieceType: 'OFFICIAL',
          pieceName: 'microsoft-teams',
          pieceVersion: '0.1.0',
          actionName: 'microsoft_teams_send_channel_message',
          input: {
            teamId: 'TEAM_ID',
            channelId: 'CHANNEL_ID',
            contentType: 'text',
            content: 'Hello from Teams',
          },
          inputUiInfo: {},
        },
      },
    }),
  });
  console.log('Updated step to Microsoft Teams');

  const updatedFlow = await api(`/flows/${flow.id}`, { method: 'GET' });
  console.log('Final flow:', JSON.stringify(updatedFlow, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
