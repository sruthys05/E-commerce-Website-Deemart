const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    import("web-vitals").then(({ onCLS, onLCP, onFCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;