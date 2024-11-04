// Função para carregar a lista de rastreadores a partir do arquivo JSON
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
  
  // Evento para reiniciar as informações quando uma nova página é carregada
//   browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === 'complete') {
//       browser.storage.local.set({ blockedTrackers: [] }).then(() => {
//         console.log("Informações de rastreadores reiniciadas para a nova página.");
//         browser.runtime.sendMessage({ action: "updatePopup" });
//         console.log("Mensagem enviada para atualizar o popup.");
//       });
//     }
//   });
  
  // Carregar a lista de rastreadores e configurar o listener de bloqueio
  loadTrackerList().then(trackerList => {
    console.log("Lista de rastreadores carregada:", trackerList);
    browser.webRequest.onBeforeRequest.addListener(
      function(details) {
        const url = new URL(details.url);
        console.log("Verificando URL:", url.hostname);
        
        // Verificar se o hostname contém algum domínio da lista de rastreadores
        if (trackerList.some(tracker => url.hostname.includes(tracker))) {
          console.log(`Rastreador detectado e bloqueado: ${url.hostname}`);
          browser.storage.local.get('blockedTrackers').then(data => {
            const blocked = data.blockedTrackers || [];
            if (!blocked.includes(url.hostname)) {
              blocked.push(url.hostname);
              browser.storage.local.set({ blockedTrackers: blocked });
              browser.runtime.sendMessage({ action: "updatePopup" });
            }
          });
          return { cancel: true };
        }
      },
      { urls: ["<all_urls>"] },
      ["blocking"]
    );
  });
  