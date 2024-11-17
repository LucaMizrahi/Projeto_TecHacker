// Função para carregar a lista de rastreadores
async function loadTrackerList() {
    try {
        const response = await fetch(browser.runtime.getURL('trackerList.json'));
        const trackers = await response.json();
        console.log("Lista de rastreadores carregada:", trackers);
        return trackers;
    } catch (error) {
        console.error("Erro ao carregar a lista de rastreadores:", error);
        return [];
    }
}

// Configurar listener para bloqueio de requisições
loadTrackerList().then(trackerList => {
    console.log("Registrando o listener de webRequest...");

    browser.webRequest.onBeforeRequest.addListener(
        async function(details) {
            const url = new URL(details.url);

            // Verificar se o bloqueio global está ativado
            const { blockEnabled } = await browser.storage.local.get('blockEnabled');
            if (blockEnabled === false) {
                console.log("Bloqueio de rastreadores está desativado. Requisição permitida:", url.hostname);
                return;
            }

            // Obter a aba ativa para associar ao URL
            const tabs = await browser.tabs.query({ active: true, currentWindow: true });
            const activeTab = tabs[0];
            const tabUrl = activeTab ? activeTab.url : 'unknown';

            console.log("Interceptando requisição para URL:", url.hostname, "Aba ativa:", tabUrl);

            // Verificar se a URL contém algum rastreador na lista
            const isTracker = trackerList.some(tracker => url.hostname.includes(tracker));
            console.log(`URL interceptada: ${url.hostname}, Bloquear: ${isTracker}`);

            if (isTracker) {
                console.log(`Rastreador detectado e bloqueado: ${url.hostname}`);

                // Atualizar storage com rastreadores bloqueados por aba/URL
                browser.storage.local.get('blockedTrackers').then(data => {
                    const blockedTrackers = data.blockedTrackers || {};
                    const siteTrackers = blockedTrackers[tabUrl] || [];

                    if (!siteTrackers.includes(url.hostname)) {
                        siteTrackers.push(url.hostname);
                        blockedTrackers[tabUrl] = siteTrackers;

                        browser.storage.local.set({ blockedTrackers }).then(() => {
                            console.log("Storage atualizado com rastreadores bloqueados:", blockedTrackers);

                            // Enviar mensagem ao popup para atualização
                            browser.runtime.sendMessage({
                                action: "updatePopup",
                                siteUrl: tabUrl,
                                trackers: siteTrackers
                            });
                        });
                    }
                });
                return { cancel: true };
            }
        },
        { urls: ["<all_urls>"] },
        ["blocking"]
    );

    // Notificar o popup quando a aba for atualizada
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
            console.log(`Aba atualizada para URL: ${tab.url}`);
            browser.storage.local.get('blockedTrackers').then(data => {
                const blockedTrackers = data.blockedTrackers || {};
                const siteTrackers = blockedTrackers[tab.url] || [];
                browser.runtime.sendMessage({
                    action: "updatePopup",
                    siteUrl: tab.url,
                    trackers: siteTrackers
                });
            });
        }
    });

    // Escutar mensagens do popup para alternar o estado do bloqueio
    browser.runtime.onMessage.addListener((message) => {
        if (message.action === "toggleBlock") {
            const enabled = message.enabled;
            browser.storage.local.set({ blockEnabled: enabled }).then(() => {
                console.log(`Bloqueio de rastreadores ${enabled ? 'ativado' : 'desativado'}.`);
            });
        }
    });
});
