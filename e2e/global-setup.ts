import { request, type APIRequestContext, type FullConfig } from '@playwright/test';

type RequiredService = {
  name: string;
  url: string;
  checkBody?: (body: string) => boolean;
};

const REQUIRED_SERVICES: RequiredService[] = [
  {
    name: 'gsnake-web preview',
    url: 'http://localhost:3000/health',
    checkBody: (body) => body.includes('gsnake-web:ok'),
  },
  {
    name: 'gsnake-editor UI',
    url: 'http://localhost:3003/health',
    checkBody: (body) => body.includes('gsnake-editor-ui:ok'),
  },
  {
    name: 'gsnake-editor API',
    url: 'http://localhost:3001/health',
    checkBody: (body) =>
      body.includes('"status":"ok"') && body.includes('"service":"gsnake-editor-api"'),
  },
];

const READY_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 1_000;

type ReadinessResult = {
  ok: boolean;
  detail: string;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function probeService(
  api: APIRequestContext,
  service: RequiredService
): Promise<ReadinessResult> {
  try {
    const response = await api.get(service.url, {
      failOnStatusCode: false,
      timeout: 2_000,
    });

    const body = await response.text();
    if (!response.ok()) {
      return {
        ok: false,
        detail: `HTTP ${response.status()}`,
      };
    }

    if (service.checkBody && !service.checkBody(body)) {
      const normalized = body.replace(/\s+/g, ' ').trim();
      return {
        ok: false,
        detail: `unexpected health payload: ${normalized.slice(0, 160)}`,
      };
    }

    return { ok: true, detail: 'ready' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, detail: message };
  }
}

async function waitForService(api: APIRequestContext, service: RequiredService): Promise<void> {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  let lastDetail = 'not yet checked';

  while (Date.now() < deadline) {
    const result = await probeService(api, service);
    if (result.ok) {
      return;
    }

    lastDetail = result.detail;
    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error(
    `[startup] Required service not ready: ${service.name} (${service.url}). Last check: ${lastDetail}`
  );
}

export default async function globalSetup(_config: FullConfig): Promise<void> {
  const api = await request.newContext();

  try {
    for (const service of REQUIRED_SERVICES) {
      await waitForService(api, service);
    }
  } finally {
    await api.dispose();
  }
}
