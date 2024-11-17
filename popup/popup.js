document.addEventListener('DOMContentLoaded', () => {
    const statusDiv = document.getElementById('status');
    const blockToggle = document.getElementById('blockToggle');
    const customDomainInput = document.getElementById('customDomainInput');
    const addDomainButton = document.getElementById('addDomainButton');
    const removeDomainButton = document.getElementById('removeDomainButton');
    const customDomainsList = document.getElementById('customDomainsList');

    function updatePopup(siteUrl, trackers) {
        console.log("Atualizando popup para o site:", siteUrl);

        // Atualizar a interface do popup
        statusDiv.innerHTML = '';
        if (trackers.length > 0) {
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

    function updateCustomDomainsList() {
        browser.storage.local.get('customTrackers').then(data => {
            const customTrackers = data.customTrackers || [];
            customDomainsList.innerHTML = '';
            customTrackers.forEach(domain => {
                const li = document.createElement('li');
                li.textContent = domain;
                customDomainsList.appendChild(li);
            });
        }).catch(err => console.error("Erro ao acessar a lista personalizada:", err));
    }

    addDomainButton.addEventListener('click', () => {
        const domain = customDomainInput.value.trim();
        if (domain) {
            browser.storage.local.get('customTrackers').then(data => {
                const customTrackers = data.customTrackers || [];
                if (!customTrackers.includes(domain)) {
                    customTrackers.push(domain);
                    browser.storage.local.set({ customTrackers }).then(() => {
                        console.log(`Domínio adicionado: ${domain}`);
                        updateCustomDomainsList();
                    });
                }
            });
        }
    });

    removeDomainButton.addEventListener('click', () => {
        const domain = customDomainInput.value.trim();
        if (domain) {
            browser.storage.local.get('customTrackers').then(data => {
                const customTrackers = data.customTrackers || [];
                const index = customTrackers.indexOf(domain);
                if (index > -1) {
                    customTrackers.splice(index, 1);
                    browser.storage.local.set({ customTrackers }).then(() => {
                        console.log(`Domínio removido: ${domain}`);
                        updateCustomDomainsList();
                    });
                }
            });
        }
    });

    blockToggle.addEventListener('change', () => {
        const enabled = blockToggle.checked;
        browser.storage.local.set({ blockEnabled: enabled }).then(() => {
            console.log(`Bloqueio de rastreadores ${enabled ? 'ativado' : 'desativado'}.`);
            browser.runtime.sendMessage({ action: "toggleBlock", enabled });
        });
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

    updateCustomDomainsList();
});
