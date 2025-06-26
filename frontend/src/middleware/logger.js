const logs = [];

export function logEvent(event, details = {}) {
  logs.push({
    timestamp: new Date().toISOString(),
    event,
    ...details,
  });
}

export function getLogs() {
  return logs;
} 