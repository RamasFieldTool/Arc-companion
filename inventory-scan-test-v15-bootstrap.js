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
if (stateEl) stateEl.textContent = "Test 15: vollständige TensorFlow-Laufzeit wird geladen …";
if (outputEl) outputEl.textContent = "[camera test v15]\nstatus: loading TensorFlow runtime";

try {
  // Use one known-good TensorFlow namespace for the whole test. Test 14 mixed
  // browser globals from different bundles, which is why core functions were
  // missing on this Android browser.
  window.tf = tfModule;

  if (typeof tfModule.ready !== "function" ||
      typeof tfModule.getBackend !== "function" ||
      typeof tfModule.loadGraphModel !== "function" ||
      !tfModule.browser?.fromPixels) {
    throw new Error("TensorFlow-ESM ist unvollständig");
  }

  try {
    await tfModule.setBackend("webgl");
  } catch (_) {
    try { await tfModule.setBackend("cpu"); } catch (_) {}
  }
  await tfModule.ready();

  const backend = tfModule.getBackend();
  if (stateEl) stateEl.textContent = `TensorFlow bereit (${backend}). Direktes MobileNet-Modell wird geladen …`;
  if (outputEl) outputEl.textContent = `[camera test v15]\nruntime: tfjs ${tfModule.version?.tfjs || "unknown"}\nbackend: ${backend}\nmodel-source: storage.googleapis.com\nstatus: loading direct graph model`;

  // The previous MobileNet helper loads from TFHub. TFHub now redirects model
  // traffic and the browser returned "Failed to fetch". Test 15 bypasses that
  // path entirely and loads TensorFlow's public graph model directly from
  // storage.googleapis.com.
  const probe = await fetch(MODEL_URL, { method: "GET", cache: "force-cache", mode: "cors" });
  if (!probe.ok) throw new Error(`MobileNet model.json HTTP ${probe.status}`);

  const graphModel = await tfModule.loadGraphModel(MODEL_URL, { requestInit: { cache: "force-cache", mode: "cors" } });

  let useEmbeddingNode = false;
  const warmInput = tfModule.zeros([1, 224, 224, 3]);
  try {
    let warm = firstTensor(graphModel.execute(warmInput, EMBEDDING_NODE));
    if (warm && typeof warm.data === "function") {
      await warm.data();
      warm.dispose?.();
      useEmbeddingNode = true;
    }
  } catch (_) {
    let warm = firstTensor(graphModel.predict(warmInput));
    if (warm && typeof warm.data === "function") {
      await warm.data();
      warm.dispose?.();
    }
  } finally {
    warmInput.dispose();
  }

  // Present the direct graph model through the tiny API expected by the
  // existing scan engine. infer() stays synchronous and returns a Tensor, just
  // like @tensorflow-models/mobilenet.
  window.mobilenet = {
    load: async () => ({
      infer(image, embedding = true) {
        return tfModule.tidy(() => {
          const input = tfModule.browser.fromPixels(image)
            .toFloat()
            .div(255)
            .expandDims(0);
          let result;
          if (embedding && useEmbeddingNode) {
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

  // Reuse the tested slot/ARC comparison pipeline, but without the failing
  // MobileNet network loader. The wrapper above already owns the model.
  await loadClassicScript("inventory-scan-test-v14.js?v=15-direct-model-2");

  const relabelObserver = new MutationObserver(relabelV14Messages);
  if (stateEl) relabelObserver.observe(stateEl, { childList: true, characterData: true, subtree: true });
  if (outputEl) relabelObserver.observe(outputEl, { childList: true, characterData: true, subtree: true });

  setControls(true);
  if (stateEl) stateEl.textContent = "ML-Laufzeit und direktes MobileNet-Modell bereit. Jetzt Inventar scannen.";
  if (outputEl) outputEl.textContent = `[camera test v15]\nruntime: tfjs ${tfModule.version?.tfjs || "unknown"}\nbackend: ${backend}\nloadGraphModel: OK\nmodel: direct storage model OK\nfeature-output: ${useEmbeddingNode ? "AvgPool embedding" : "classification vector fallback"}\nstatus: ready for scan`;
} catch (error) {
  setControls(false);
  if (stateEl) stateEl.textContent = "Test 15 konnte die ML-Laufzeit oder das Modell nicht starten. Diagnose siehe unten.";
  if (outputEl) outputEl.textContent = `[camera test v15]\nerror: ${String(error?.message || error).slice(0,300)}`;
}
