import { useEffect, useState } from "react";
import {
  getPower,
  getVolume,
  getInput,
  getMute,
  powerDeviceOn,
  powerDeviceOff,
  setDeviceInput,
  setDeviceVolume,
  setDeviceMute,
} from "../api/deviceApi";

interface BusyState {
  power: boolean;
  volume: boolean;
  input: boolean;
  mute: boolean;
}

export function useDevice() {
  const [power, setPower] = useState<string>("Unknown");

  const [volume, setVolume] = useState<number>(0);

  const [volumePreview, setVolumePreview] = useState<number>(0);

  const [input, setInput] = useState<number>(-1);

  const [mute, setMute] = useState<boolean>(false);

  const [connected, setConnected] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const [busy, setBusy] = useState<BusyState>({
    power: false,
    volume: false,
    input: false,
    mute: false,
  });

  async function refreshPower() {
    try {
      const result = await getPower();

      setPower(result ? "ON" : "OFF");

      return true;
    } catch {
      setPower("Unavailable");

      return false;
    }
  }

  async function refreshVolume() {
    try {
      const result = await getVolume();

      setVolume(result);
      setVolumePreview(result);

      return true;
    } catch {
      return false;
    }
  }

  async function refreshInput() {
    try {
      const result = await getInput();

      setInput(result);

      return true;
    } catch {
      setInput(-1);

      return false;
    }
  }

  async function refreshMute() {
    try {
      const result = await getMute();

      setMute(result);

      return true;
    } catch {
      return false;
    }
  }

  async function refreshDevice() {
    setLoading(true);

    setError(null);

    const results = await Promise.allSettled([
      refreshPower(),

      refreshVolume(),

      refreshInput(),

      refreshMute(),
    ]);

    const successful = results.some(
      (result) => result.status === "fulfilled" && result.value === true,
    );

    setConnected(successful);

    if (!successful) {
      setError("Unable to communicate with device.");
    }

    setLoading(false);
  }

  async function executeAction(
    action: () => Promise<void>,
    refresh: () => Promise<boolean>,
    key: keyof BusyState,
  ) {
    setBusy((prev) => ({
      ...prev,
      [key]: true,
    }));

    try {
      setError(null);

      await action();

      await refresh();

      setConnected(true);
    } catch {
      setError("Device command failed.");
    } finally {
      setBusy((prev) => ({
        ...prev,
        [key]: false,
      }));
    }
  }

  async function powerOn() {
    await executeAction(
      () => powerDeviceOn(),

      refreshPower,

      "power",
    );
  }

  async function powerOff() {
    await executeAction(
      () => powerDeviceOff(),

      refreshPower,

      "power",
    );
  }

  async function changeInput(inputNumber: number) {
    await executeAction(
      () => setDeviceInput(inputNumber),

      refreshInput,

      "input",
    );
  }

  async function changeVolume(value: number) {
    await executeAction(
      () => setDeviceVolume(value),

      refreshVolume,

      "volume",
    );
  }

  async function toggleMute() {
    await executeAction(
      () => setDeviceMute(!mute),

      refreshMute,

      "mute",
    );
  }

  useEffect(() => {
    refreshDevice();
  }, []);

  return {
    power,

    volume,

    volumePreview,

    input,

    mute,

    connected,

    error,

    loading,

    busy,

    powerOn,

    powerOff,

    changeInput,

    changeVolume,

    toggleMute,

    setVolumePreview,

    refreshDevice,
  };
}
