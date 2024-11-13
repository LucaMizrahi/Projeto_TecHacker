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
        async function(details) {
            const url = new URL(details.url);
            const tabId = details.tabId;

            // Se não houver um tabId válido, ignore (background requests)
            if (tabId === -1) return;

            // Obter a URL da aba ativa para identificar o site
            const tabs = await browser.tabs.get(tabId);
            const initiatorUrl = tabs.url;

            console.log("Verificando URL:", url.hostname);

            // Verificar se o hostname contém algum domínio da lista de rastreadores
            if (trackerList.some(tracker => url.hostname.includes(tracker))) {
                console.log(`Rastreador detectado e bloqueado: ${url.hostname}`);

                // Recuperar o estado atual dos rastreadores bloqueados para cada site
                const { blockedTrackers } = await browser.storage.local.get('blockedTrackers') || {};
                const siteTrackers = blockedTrackers?.[initiatorUrl] || [];

                if (!siteTrackers.includes(url.hostname)) {
                    // Adicionar o rastreador detectado na lista específica do site
                    siteTrackers.push(url.hostname);
                    blockedTrackers[initiatorUrl] = siteTrackers;

                    // Salvar o estado atualizado
                    await browser.storage.local.set({ blockedTrackers });

                    // Notificar o popup para atualizar
                    browser.runtime.sendMessage({ action: "updatePopup", siteUrl: initiatorUrl });
                }
                return { cancel: true };
            }
        },
        { urls: ["<all_urls>"] },
        ["blocking"]
    );

    // Limpar rastreadores ao carregar uma nova página
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
            browser.runtime.sendMessage({ action: "updatePopup", siteUrl: tab.url });
        }
    });
});
