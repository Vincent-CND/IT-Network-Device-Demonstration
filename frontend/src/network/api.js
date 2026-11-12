const BASE_URL = import.meta.env.VITE_API_URL || "/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

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
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

const textOf = (v) =>
  typeof v === "string" ? v : v?.text ?? v?.description ?? v?.title ?? v?.message ?? "";

const isSuccess = (data) =>
  typeof data === "boolean"
    ? data
    : Boolean(data?.success ?? data?.valid ?? data?.correct ?? data?.passed);

export async function getMission(missionId) {
  if (USE_MOCK) {
    await wait();
    return MOCK_STEPS;
  }
  const data = await request(`/mission/${missionId}`);
  const list = Array.isArray(data)
    ? data
    : data?.steps ?? data?.tasks ?? data?.instructions ?? [];
  return list.map(textOf);
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
  if (USE_MOCK) {
    await wait();
    return { success: true, message: "" };
  }
  const data = await request("/validate/builder", {
    method: "POST",
    body: JSON.stringify(payload),
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
    body: JSON.stringify(payload),
  });
  return { success: isSuccess(data), message: data?.message ?? "" };
}
