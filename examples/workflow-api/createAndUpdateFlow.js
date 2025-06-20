const fetch = require('node-fetch');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
const API_KEY = process.env.AP_API_KEY || 'YOUR_API_KEY';
const PROJECT_ID = process.env.PROJECT_ID || 'YOUR_PROJECT_ID';

async function request(path, method, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed (${res.status}): ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function run() {
  const flow = await request('/flows', 'POST', {
    displayName: 'API Demo Flow',
    projectId: PROJECT_ID,
  });
  console.log('Created flow', flow.id);

  const trigger = {
    name: 'trigger',
    displayName: 'Every Day',
    valid: true,
    type: 'PIECE_TRIGGER',
    settings: {
      pieceName: 'schedule',
      pieceVersion: '0.1.5',
      pieceType: 'OFFICIAL',
      packageType: 'REGISTRY',
      triggerName: 'every_day',
      input: {
        hour_of_the_day: 0,
        timezone: 'UTC',
        run_on_weekends: false,
      },
      inputUiInfo: {},
    },
  };

  const action = {
    name: 'step_1',
    displayName: 'Map Data',
    valid: true,
    type: 'PIECE',
    settings: {
      packageType: 'REGISTRY',
      pieceType: 'OFFICIAL',
      pieceName: 'data-mapper',
      pieceVersion: '0.3.6',
      actionName: 'advanced_mapping',
      input: { mapping: { newProperty: 'value' } },
      inputUiInfo: {},
    },
  };

  trigger.nextAction = action;

  await request(`/flows/${flow.id}`, 'POST', {
    type: 'IMPORT_FLOW',
    request: {
      displayName: 'API Demo Flow',
      trigger,
      schemaVersion: null,
    },
  });
  console.log('Imported flow definition');

  const updatedAction = {
    ...action,
    settings: { ...action.settings, input: { mapping: { changed: true } } },
  };

  await request(`/flows/${flow.id}`, 'POST', {
    type: 'UPDATE_ACTION',
    request: updatedAction,
  });
  console.log('Updated action');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
