export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    console.log("🕒 Debounce triggered, waiting for", delay, "ms"); // ✅ Log when user clicks
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      console.log("🚀 Debounced function running"); // ✅ Log when actual function runs
      fn(...args);
    }, delay);
  };
}
