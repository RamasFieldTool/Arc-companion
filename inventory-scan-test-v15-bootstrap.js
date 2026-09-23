import * as tfModule from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/+esm";

const stateEl = document.getElementById("itemRecognitionState");
const outputEl = document.getElementById("itemRecognitionOutput");
const openCamera = document.getElementById("openCamera");
const fileInput = document.getElementById("fileInput");
const retryBtn = document.getElementById("itemRecognitionRetry");

function setControls(enabled) {
  if (openCamera) openCamera.disabled = !enabled;
  if (fileInput) fileInput.disabled = !enabled;
  if (retryBtn) retryBtn.disabled = !enabled;
}

function loadClassicScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Script konnte nicht geladen werden: ${src}`));
    document.head.appendChild(script);
  });
}

setControls(false);
if (stateEl) stateEl.textContent = "Test 15: echte TensorFlow-Laufzeit wird geladen …";
if (outputEl) outputEl.textContent = "[camera test v15]\nstatus: loading ESM TensorFlow runtime";

try {
  // Use the actual ESM TensorFlow namespace. The previous test relied on a
  // browser global named `tf`, which on this Android browser was only a
  // partial/incompatible object (missing ready/getBackend/loadGraphModel).
  window.tf = tfModule;

  if (typeof tfModule.ready !== "function" ||
      typeof tfModule.getBackend !== "function" ||
      typeof tfModule.loadGraphModel !== "function") {
    throw new Error("TensorFlow-ESM ist unvollständig");
  }

  try {
    await tfModule.setBackend("webgl");
  } catch (_) {
    try { await tfModule.setBackend("cpu"); } catch (_) {}
  }
  await tfModule.ready();

  if (stateEl) stateEl.textContent = `TensorFlow bereit (${tfModule.getBackend()}). MobileNet wird geladen …`;
  if (outputEl) outputEl.textContent = `[camera test v15]\nruntime: tfjs ${tfModule.version?.tfjs || "unknown"}\nbackend: ${tfModule.getBackend()}\nstatus: loading MobileNet`;

  await loadClassicScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js");
  if (!window.mobilenet || typeof window.mobilenet.load !== "function") {
    throw new Error("MobileNet konnte nicht initialisiert werden");
  }

  // Load the existing ML scanner only after a validated, complete TensorFlow
  // runtime and MobileNet are present. This avoids the chain of compatibility
  // polyfills from Test 14.
  await loadClassicScript("inventory-scan-test-v14.js?v=15esm");

  setControls(true);
  if (stateEl) stateEl.textContent = "ML-Laufzeit bereit. Jetzt Inventar scannen.";
  if (outputEl) outputEl.textContent = `[camera test v15]\nruntime: tfjs ${tfModule.version?.tfjs || "unknown"}\nbackend: ${tfModule.getBackend()}\nloadGraphModel: OK\nMobileNet: OK\nstatus: ready for scan`;
} catch (error) {
  setControls(false);
  if (stateEl) stateEl.textContent = "Test 15 konnte die ML-Laufzeit nicht starten. Diagnose siehe unten.";
  if (outputEl) outputEl.textContent = `[camera test v15]\nerror: ${String(error?.message || error).slice(0,300)}`;
}
