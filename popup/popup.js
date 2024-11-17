document.addEventListener('DOMContentLoaded', () => {
    const statusDiv = document.getElementById('status');
    const blockToggle = document.getElementById('blockToggle'); // Botão de alternância para ativar/desativar o bloqueio

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

    // Atualizar estado do botão de alternância ao carregar o popup
    function updateToggle() {
        browser.storage.local.get('blockEnabled').then(data => {
            blockToggle.checked = data.blockEnabled !== false; // Default é true
            console.log(`Estado do bloqueio ao carregar: ${blockToggle.checked ? 'Ativado' : 'Desativado'}`);
        }).catch(err => console.error("Erro ao acessar o estado do bloqueio:", err));
    }

    // Ouvir mensagens do background script para atualização em tempo real
    browser.runtime.onMessage.addListener((message) => {
        if (message.action === "updatePopup" && message.siteUrl && message.trackers) {
            updatePopup(message.siteUrl, message.trackers);
        }
    });

    // Alterar estado de bloqueio ao alternar o botão
    blockToggle.addEventListener('change', () => {
        const enabled = blockToggle.checked;
        browser.storage.local.set({ blockEnabled: enabled }).then(() => {
            console.log(`Bloqueio de rastreadores ${enabled ? 'ativado' : 'desativado'}.`);
            browser.runtime.sendMessage({ action: "toggleBlock", enabled });
        }).catch(err => console.error("Erro ao salvar o estado do bloqueio:", err));
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

    // Inicializar o estado do botão de alternância
    updateToggle();
});
