import { topologyAnswer } from './topology.js';

const BASE_URL = (import.meta.env?.VITE_API_URL || "/api").replace(/\/$/, "");

export const MISSION_STEP_IDS = [1, 2, 3, 4];

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

const textOf = (v) =>
  typeof v === "string" ? v : v?.text ?? v?.description ?? v?.title ?? v?.message ?? "";

const isSuccess = (data) =>
  typeof data === "boolean"
    ? data
    : Boolean(data?.success ?? data?.valid ?? data?.correct ?? data?.passed ?? (data?.message === "CONGRATULATIONS !!!"));

export async function getMissionInstructions() {
  // These IDs identify individual instructions, not separate playable missions.
  return Promise.all(MISSION_STEP_IDS.map(async (id) => {
    const data = await request(`/mission/${id}`);
    if (typeof data?.message !== "string" || !data.message.trim()) {
      throw new Error(`Missing instruction for step ${id}`);
    }
    return data.message;
  }));
}

export async function getBuilderHint(missionId) {
  const data = await request(`/hint/builder/${missionId}`);
  const text = textOf(data?.hint ?? data);
  return text === "There are no more hint" ? "" : text;
}

export async function getCableHint(hintId) {
  const data = await request(`/hint/cable/${hintId}`);
  const text = textOf(data?.hint ?? data);
  return text === "There are no more hint" ? "" : text;
}

export async function validateBuilder(payload) {
  let userAnswer;
  try {
    userAnswer = topologyAnswer(payload.nodes, payload.links);
  } catch (error) {
    return { success: false, message: error.message };
  }
  const data = await request("/validate/builder", {
    method: "POST",
    body: JSON.stringify({ userAnswer }),
  });
  return { success: isSuccess(data), message: data?.message ?? "" };
}

export async function validateCable(payload) {
  const data = await request("/validate/cable", {
    method: "POST",
    body: JSON.stringify({ userAnswer: payload.order.map((wire) => ({
      wo: "White/Orange", o: "Orange", wg: "White/Green", b: "Blue",
      wb: "White/Blue", g: "Green", wbr: "White/Brown", br: "Brown",
    })[wire]) }),
  });
  return { success: isSuccess(data), message: data?.message ?? "" };
}
