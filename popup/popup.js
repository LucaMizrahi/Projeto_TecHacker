document.addEventListener('DOMContentLoaded', () => {
    const statusDiv = document.getElementById('status');

    function updatePopup(siteUrl, trackers) {
        console.log("Atualizando popup para o site:", siteUrl);

        // Atualizar a interface do popup
        statusDiv.innerHTML = '';
        if (trackers.length > 0) {
            statusDiv.textContent = "Rastreadores bloqueados:";
            const ul = document.createElement('ul');
            trackers.forEach(domain => {
                const li = document.createElement('li');
                li.textContent = domain;
                ul.appendChild(li);
            });
            statusDiv.appendChild(ul);
        } else {
            statusDiv.textContent = "Nenhum rastreador bloqueado.";
        }
    }

    // Ouvir mensagens do background script para atualização em tempo real
    browser.runtime.onMessage.addListener((message) => {
        if (message.action === "updatePopup" && message.siteUrl && message.trackers) {
            updatePopup(message.siteUrl, message.trackers);
        }
    });

    // Atualizar o popup quando carregado
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        const activeTab = tabs[0];
        if (activeTab) {
            browser.storage.local.get('blockedTrackers').then(data => {
                const blockedTrackers = data.blockedTrackers || {};
                const siteTrackers = blockedTrackers[activeTab.url] || [];
                updatePopup(activeTab.url, siteTrackers);
            });
        }
    });
});
