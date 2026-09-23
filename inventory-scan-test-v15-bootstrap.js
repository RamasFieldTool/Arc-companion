import * as tfModule from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/+esm";

const MODEL_URL = "https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json";
const EMBEDDING_NODE = "module_apply_default/MobilenetV2/Logits/AvgPool";

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

function firstTensor(value) {
  if (Array.isArray(value)) return value[0] || null;
  if (value && typeof value === "object" && typeof value.data !== "function") {
    const first = Object.values(value).find(v => v && typeof v.data === "function");
    if (first) return first;
  }
  return value;
}

function relabelV14Messages() {
  if (stateEl && stateEl.textContent) {
    stateEl.textContent = stateEl.textContent.replace(/Test 14/g, "Test 15");
  }
  if (outputEl && outputEl.textContent) {
    outputEl.textContent = outputEl.textContent.replace(/camera test v14/g, "camera test v15");
  }
}

setControls(false);
if (stateEl) stateEl.textContent = "Test 15: Low-Memory-ML-Laufzeit wird geladen …";
if (outputEl) outputEl.textContent = "[camera test v15]\nstatus: loading low-memory TensorFlow runtime";

try {
  if (typeof tfModule.ready !== "function" ||
      typeof tfModule.getBackend !== "function" ||
      typeof tfModule.loadGraphModel !== "function" ||
      !tfModule.browser?.fromPixels) {
    throw new Error("TensorFlow-ESM ist unvollständig");
  }

  // The previous build initialized WebGL and immediately warmed the full
  // MobileNet graph. On the tested Android browser that can kill the renderer
  // process before JavaScript can report an exception. Keep this feasibility
  // test deliberately conservative: CPU only, no warm-up, no eager inference.
  await tfModule.setBackend("cpu");
  await tfModule.ready();
  const backend = tfModule.getBackend();

  // v14's scanner asks for WebGL during loadModel(). Give it a compatibility
  // facade that keeps the already selected CPU backend instead of switching.
  const tfFacade = Object.create(null);
  for (const key of Object.keys(tfModule)) tfFacade[key] = tfModule[key];
  tfFacade.setBackend = async (name) => {
    if (name === "webgl") return true;
    return tfModule.setBackend(name);
  };
  tfFacade.getBackend = () => tfModule.getBackend();
  window.tf = tfFacade;

  if (stateEl) stateEl.textContent = `TensorFlow bereit (${backend}). Modell wird speicherschonend geladen …`;
  if (outputEl) outputEl.textContent = `[camera test v15]\nruntime: tfjs ${tfModule.version?.tfjs || "unknown"}\nbackend: ${backend}\nmode: low-memory / no warm-up\nstatus: loading direct graph model`;

  const probe = await fetch(MODEL_URL, { method: "GET", cache: "force-cache", mode: "cors" });
  if (!probe.ok) throw new Error(`MobileNet model.json HTTP ${probe.status}`);

  const graphModel = await tfModule.loadGraphModel(MODEL_URL, {
    requestInit: { cache: "force-cache", mode: "cors" }
  });

  // Do not execute the graph here. The old eager warm-up was the point at
  // which the browser tab died. The first real inference happens only after a
  // scan, and every temporary tensor is contained in tf.tidy().
  window.mobilenet = {
    load: async () => ({
      infer(image, embedding = true) {
        return tfModule.tidy(() => {
          const input = tfModule.browser.fromPixels(image)
            .toFloat()
            .div(255)
            .expandDims(0);
          let result;
          if (embedding) {
            try {
              result = graphModel.execute(input, EMBEDDING_NODE);
            } catch (_) {
              result = graphModel.predict(input);
            }
          } else {
            result = graphModel.predict(input);
          }
          const tensor = firstTensor(result);
          if (!tensor || typeof tensor.clone !== "function") {
            throw new Error("MobileNet lieferte keinen Tensor");
          }
          return tensor.clone();
        });
      }
    })
  };

  await loadClassicScript("inventory-scan-test-v14.js?v=15-low-memory-1");

  const relabelObserver = new MutationObserver(relabelV14Messages);
  if (stateEl) relabelObserver.observe(stateEl, { childList: true, characterData: true, subtree: true });
  if (outputEl) relabelObserver.observe(outputEl, { childList: true, characterData: true, subtree: true });

  setControls(true);
  if (stateEl) stateEl.textContent = "Low-Memory-ML bereit. Jetzt Inventar scannen.";
  if (outputEl) outputEl.textContent = `[camera test v15]\nruntime: tfjs ${tfModule.version?.tfjs || "unknown"}\nbackend: ${backend}\nloadGraphModel: OK\nmodel: loaded without warm-up\nmode: CPU / low-memory\nstatus: ready for scan`;
} catch (error) {
  setControls(false);
  if (stateEl) stateEl.textContent = "Test 15 konnte die Low-Memory-ML-Laufzeit nicht starten. Diagnose siehe unten.";
  if (outputEl) outputEl.textContent = `[camera test v15]\nerror: ${String(error?.message || error).slice(0,300)}`;
}
