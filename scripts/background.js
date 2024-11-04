// Função para carregar a lista de rastreadores
async function loadTrackerList() {
    try {
      const response = await fetch(browser.runtime.getURL('trackerList.json'));
      const trackers = await response.json();
      return trackers;
    } catch (error) {
      console.error("Erro ao carregar a lista de rastreadores:", error);
      return [];
    }
  }
  
  // Carregar a lista de rastreadores e configurar o listener de bloqueio
  loadTrackerList().then(trackerList => {
    browser.webRequest.onBeforeRequest.addListener(
      function(details) {
        const url = new URL(details.url);
        if (trackerList.includes(url.hostname)) {
          console.log(`Bloqueado: ${url.hostname}`);
          // Salvar em armazenamento para mostrar no popup
          browser.storage.local.get('blockedTrackers').then(data => {
            const blocked = data.blockedTrackers || [];
            if (!blocked.includes(url.hostname)) {
              blocked.push(url.hostname);
              browser.storage.local.set({ blockedTrackers: blocked });
            }
          });
          return { cancel: true };
        }
      },
      { urls: ["<all_urls>"] },
      ["blocking"]
    );
  });
  