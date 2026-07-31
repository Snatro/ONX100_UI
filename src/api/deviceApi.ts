const API_URL = "https://localhost:7205/api/device";

export interface DeviceStatus {
  isPoweredOn: boolean;

  isMuted: boolean;

  volumeLevel: number;

  inputSource: number;
}
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Device timeout.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function getPower() {
  return request<boolean>("/power");
}

export function getVolume() {
  return request<number>("/volume");
}

export function getInput() {
  return request<number>("/input");
}

export function getMute() {
  return request<boolean>("/mute");
}
export function powerDeviceOn() {
  return request<void>("/power/on", {
    method: "POST",
  });
}

export function powerDeviceOff() {
  return request<void>("/power/off", {
    method: "POST",
  });
}

export function setDeviceInput(input: number) {
  return request<void>(`/input/${input}`, {
    method: "POST",
  });
}

export function setDeviceVolume(volume: number) {
  return request<void>(`/volume/${volume}`, {
    method: "POST",
  });
}

export function setDeviceMute(enabled: boolean) {
  return request<void>(
    enabled ? "/mute/on" : "/mute/off",

    {
      method: "POST",
    },
  );
}
