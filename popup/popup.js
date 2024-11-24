document.addEventListener('DOMContentLoaded', () => {
    const statusDiv = document.getElementById('status');
    const blockToggle = document.getElementById('blockToggle');
    const customDomainInput = document.getElementById('customDomainInput');
    const addDomainButton = document.getElementById('addDomainButton');
    const removeDomainButton = document.getElementById('removeDomainButton');
    const customDomainsList = document.getElementById('customDomainsList');
    const listSelector = document.getElementById('listSelector');
    const newListInput = document.getElementById('newListInput');
    const createListButton = document.getElementById('createListButton');

    // Verificar se o botão de remover lista já existe
    let removeListButton = document.getElementById('removeListButton');
    if (!removeListButton) {
        removeListButton = document.createElement('button');
        removeListButton.textContent = "Remover Lista";
        removeListButton.id = "removeListButton";
        listSelector.insertAdjacentElement("afterend", removeListButton);
    }

    // Atualizar a lista personalizada na interface
    function updateCustomDomainsList(selectedList) {
        browser.storage.local.get('customLists').then(data => {
            const customLists = data.customLists || {};
            const domains = customLists[selectedList] || [];
            customDomainsList.innerHTML = '';
            domains.forEach(domain => {
                const li = document.createElement('li');
                li.textContent = domain;
                customDomainsList.appendChild(li);
            });
        }).catch(err => console.error("Erro ao acessar a lista personalizada:", err));
    }

    // Atualizar o seletor de listas personalizadas
    function updateListSelector() {
        browser.storage.local.get('customLists').then(data => {
            const customLists = data.customLists || {};
            listSelector.innerHTML = '';
            Object.keys(customLists).forEach(listName => {
                const option = document.createElement('option');
                option.value = listName;
                option.textContent = listName;
                listSelector.appendChild(option);
            });
            if (listSelector.value) {
                updateCustomDomainsList(listSelector.value);
            }
        }).catch(err => console.error("Erro ao atualizar o seletor de listas:", err));
    }

    // Atualizar a interface do popup
    function updatePopup(siteUrl, trackers) {
        console.log("Atualizando popup para o site:", siteUrl);

        statusDiv.innerHTML = '';
        if (trackers.length > 0) {
            statusDiv.textContent = "Rastreadores bloqueados:";
            const ul = document.createElement('ul');
            trackers.forEach(tracker => {
                const li = document.createElement('li');
                li.textContent = `${tracker.domain} (${tracker.type === 'first-party' ? 'Primeira Parte' : 'Terceira Parte'})`;
                ul.appendChild(li);
            });
            statusDiv.appendChild(ul);
        } else {
            statusDiv.textContent = "Nenhum rastreador bloqueado.";
        }
    }

    // Criar nova lista personalizada
    createListButton.addEventListener('click', () => {
        const newListName = newListInput.value.trim();
        if (newListName) {
            browser.storage.local.get('customLists').then(data => {
                const customLists = data.customLists || {};
                if (!customLists[newListName]) {
                    customLists[newListName] = [];
                    browser.storage.local.set({ customLists }).then(() => {
                        console.log(`Lista criada: ${newListName}`);
                        updateListSelector();
                    });
                }
            });
        }
    });

    // Remover lista personalizada
    removeListButton.addEventListener('click', () => {
        const selectedList = listSelector.value;
        if (selectedList) {
            browser.storage.local.get('customLists').then(data => {
                const customLists = data.customLists || {};
                delete customLists[selectedList];
                browser.storage.local.set({ customLists }).then(() => {
                    console.log(`Lista removida: ${selectedList}`);
                    updateListSelector();
                    customDomainsList.innerHTML = ''; // Limpar domínios exibidos
                });
            });
        }
    });

    // Adicionar domínio à lista selecionada
    addDomainButton.addEventListener('click', () => {
        const selectedList = listSelector.value;
        const domain = customDomainInput.value.trim();
        if (selectedList && domain) {
            browser.storage.local.get('customLists').then(data => {
                const customLists = data.customLists || {};
                const domains = customLists[selectedList] || [];
                if (!domains.includes(domain)) {
                    domains.push(domain);
                    customLists[selectedList] = domains;
                    browser.storage.local.set({ customLists }).then(() => {
                        console.log(`Domínio adicionado à lista ${selectedList}: ${domain}`);
                        updateCustomDomainsList(selectedList);
                    });
                }
            });
        }
    });

    // Remover domínio da lista selecionada
    removeDomainButton.addEventListener('click', () => {
        const selectedList = listSelector.value;
        const domain = customDomainInput.value.trim();
        if (selectedList && domain) {
            browser.storage.local.get('customLists').then(data => {
                const customLists = data.customLists || {};
                const domains = customLists[selectedList] || [];
                const index = domains.indexOf(domain);
                if (index > -1) {
                    domains.splice(index, 1);
                    customLists[selectedList] = domains;
                    browser.storage.local.set({ customLists }).then(() => {
                        console.log(`Domínio removido da lista ${selectedList}: ${domain}`);
                        updateCustomDomainsList(selectedList);
                    });
                }
            });
        }
    });

    // Alterar estado do bloqueio global
    blockToggle.addEventListener('change', () => {
        const enabled = blockToggle.checked;
        browser.storage.local.set({ blockEnabled: enabled }).then(() => {
            console.log(`Bloqueio de rastreadores ${enabled ? 'ativado' : 'desativado'}`);
            browser.runtime.sendMessage({ action: "toggleBlock", enabled });
        });
    });

    // Inicializar o popup
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        const activeTab = tabs[0];
        if (activeTab) {
            browser.storage.local.get('blockedTrackers').then(data => {
                const blockedTrackers = data.blockedTrackers || {};
                const siteTrackers = (blockedTrackers[activeTab.url] || []).map(domain => ({
                    domain,
                    type: domain === new URL(activeTab.url).hostname ? 'first-party' : 'third-party'
                }));
                updatePopup(activeTab.url, siteTrackers);
            });
        }
    });

    updateListSelector();
});
