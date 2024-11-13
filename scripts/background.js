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

// Configurar listener para bloqueio de requisições
loadTrackerList().then(trackerList => {
  console.log("Lista de rastreadores carregada:", trackerList);

  browser.webRequest.onBeforeRequest.addListener(
      function(details) {
          const url = new URL(details.url);
          console.log("Verificando URL:", url.hostname);

          // Verificar se o hostname contém algum domínio da lista
          if (trackerList.some(tracker => url.hostname.includes(tracker))) {
              console.log(`Rastreador detectado e bloqueado: ${url.hostname}`);
              browser.storage.local.get('blockedTrackers').then(data => {
                  const blocked = data.blockedTrackers || [];
                  if (!blocked.includes(url.hostname)) {
                      blocked.push(url.hostname);
                      browser.storage.local.set({ blockedTrackers: blocked }).then(() => {
                          // Enviar mensagem para o popup atualizar
                          browser.runtime.sendMessage({ action: "updatePopup" });
                      });
                  }
              });
              return { cancel: true };
          }
      },
      { urls: ["<all_urls>"] },
      ["blocking"]
  );
});

// Notificar o popup ao mudar de página
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
      console.log("Página recarregada, enviando notificação ao popup.");
      browser.runtime.sendMessage({ action: "updatePopup" });
  }
});