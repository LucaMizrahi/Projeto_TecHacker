// Carregar lista de rastreadores (exemplo simplificado)
const trackerList = ["example-tracker.com", "another-tracker.com"];

browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = new URL(details.url);
    if (trackerList.includes(url.hostname)) {
      console.log(`Bloqueado: ${url.hostname}`);
      return { cancel: true };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
