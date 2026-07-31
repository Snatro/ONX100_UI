import { useDevice } from "../../hooks/useDevice";
import "./DeviceDashboard.css";

export default function DeviceDashboard() {
  const {
    connected,
    error,
    power,
    volume,
    input,
    mute,
    loading,
    volumePreview,
    busy,
    powerOn,
    powerOff,
    changeInput,
    changeVolume,
    toggleMute,
    setVolumePreview,
  } = useDevice();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>ONX-100 Projector</h1>
          <p>Device Control Dashboard</p>
        </div>

        <div className={connected ? "connection online" : "connection offline"}>
          {connected ? "CONNECTED" : "DISCONNECTED"}
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <main className="dashboard-grid">
        <section className="card">
          <div className="card-header">
            <h2>Power</h2>
          </div>

          {loading ? (
            <div className="skeleton large"></div>
          ) : (
            <>
              <div className="current-value">{power}</div>

              <div className="button-row">
                <button disabled={busy.power} onClick={powerOn}>
                  ON
                </button>

                <button
                  className="danger"
                  disabled={busy.power}
                  onClick={powerOff}
                >
                  OFF
                </button>
              </div>
            </>
          )}
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Input</h2>
          </div>

          {loading ? (
            <div className="skeleton large"></div>
          ) : (
            <div className="input-grid">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  disabled={busy.input}
                  className={input === i ? "selected" : ""}
                  onClick={() => changeInput(i)}
                >
                  HDMI {i}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Volume</h2>
          </div>

          {loading ? (
            <>
              <div className="skeleton"></div>
              <div className="skeleton"></div>
            </>
          ) : (
            <>
              <div className="volume-container">
                <div
                  className="volume-bar"
                  style={{
                    width: `${volumePreview}%`,
                  }}
                />
              </div>

              <div className="volume-value">{volumePreview}%</div>

              <input
                type="range"
                min={0}
                max={100}
                value={volumePreview}
                disabled={busy.volume}
                onChange={(e) => setVolumePreview(Number(e.target.value))}
                onMouseUp={() => changeVolume(volumePreview)}
              />
            </>
          )}
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Audio</h2>
          </div>

          {loading ? (
            <div className="skeleton large"></div>
          ) : (
            <>
              <div className="current-value">{mute ? "Muted" : "Unmuted"}</div>

              <button disabled={busy.mute} onClick={toggleMute}>
                {mute ? "Disable Mute" : "Enable Mute"}
              </button>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
