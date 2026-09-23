"use strict";
(() => {
  const tf = window.tf;
  if (!tf) return;

  // Some mobile/browser builds expose the TensorFlow.js runtime without
  // tf.ready(), even though the backend APIs used by MobileNet are present.
  // Test 14 only needs a promise barrier here; setBackend/load() perform the
  // actual asynchronous initialisation.
  if (typeof tf.ready !== "function") {
    tf.ready = async () => true;
  }
})();
