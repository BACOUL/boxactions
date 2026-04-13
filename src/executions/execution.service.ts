import type { Execution } from "../types";

const executions = new Map<string, Execution>();

export function createExecution(
  input: Omit<Execution, "id" | "createdAt">,
): Execution {
  const execution: Execution = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };

  executions.set(execution.id, execution);
  return execution;
}

export function getExecutionById(id: string): Execution | null {
  return executions.get(id) ?? null;
}

export function updateExecutionStatus(
  id: string,
  status: Execution["status"],
  params?: {
    result?: Record<string, unknown> | null;
    error?: string | null;
  },
): Execution | null {
  const execution = executions.get(id);
  if (!execution) return null;

  const updated: Execution = {
    ...execution,
    status,
    result: params?.result ?? execution.result ?? null,
    error: params?.error ?? execution.error ?? null,
    executedAt: status === "done" || status === "failed"
      ? new Date().toISOString()
      : execution.executedAt ?? null,
  };

  executions.set(id, updated);
  return updated;
}
