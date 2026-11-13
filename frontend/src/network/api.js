import { topologyAnswer } from './topology.js';

const BASE_URL = (import.meta.env?.VITE_API_URL || "/api").replace(/\/$/, "");
const USE_MOCK = import.meta.env?.VITE_USE_MOCK === "true";

export const MISSION_STEP_IDS = [1, 2, 3, 4];

const MOCK_STEPS = Array(4).fill("Lorem ipsum dolor sit amet, consectetur libero.");
const MOCK_HINT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis";
const MOCK_ANSWER = ["wo", "o", "wg", "b", "wb", "g", "wbr", "br"];
const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

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
  if (USE_MOCK) {
    await wait();
    return MOCK_STEPS;
  }
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
  if (USE_MOCK) {
    await wait();
    return MOCK_HINT;
  }
  const data = await request(`/hint/builder/${missionId}`);
  return textOf(data?.hint ?? data);
}

export async function getCableHint(hintId) {
  if (USE_MOCK) {
    await wait();
    return MOCK_HINT;
  }
  const data = await request(`/hint/cable/${hintId}`);
  return textOf(data?.hint ?? data);
}

export async function validateBuilder(payload) {
  let userAnswer;
  try {
    userAnswer = topologyAnswer(payload.nodes, payload.links);
  } catch (error) {
    return { success: false, message: error.message };
  }
  if (USE_MOCK) {
    await wait();
    return { success: true, message: "" };
  }
  const data = await request("/validate/builder", {
    method: "POST",
    body: JSON.stringify({ userAnswer }),
  });
  return { success: isSuccess(data), message: data?.message ?? "" };
}

export async function validateCable(payload) {
  if (USE_MOCK) {
    await wait();
    return {
      success: payload.order.every((w, i) => w === MOCK_ANSWER[i]),
      message: "",
    };
  }
  const data = await request("/validate/cable", {
    method: "POST",
    body: JSON.stringify({ userAnswer: payload.order.map((wire) => ({
      wo: "White/Orange", o: "Orange", wg: "White/Green", b: "Blue",
      wb: "White/Blue", g: "Green", wbr: "White/Brown", br: "Brown",
    })[wire]) }),
  });
  return { success: isSuccess(data), message: data?.message ?? "" };
}
