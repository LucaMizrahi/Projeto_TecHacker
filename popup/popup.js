document.addEventListener('DOMContentLoaded', () => {
  function updatePopup(siteUrl) {
      console.log("Função updatePopup chamada para o site:", siteUrl);
      const statusDiv = document.getElementById('status');

      // Obter rastreadores bloqueados para o site específico
      browser.storage.local.get('blockedTrackers').then(data => {
          const blockedTrackers = data.blockedTrackers || {};
          const siteTrackers = blockedTrackers[siteUrl] || []; // Rastreador específico para o site

          // Limpar o conteúdo da div antes de atualizar
          statusDiv.innerHTML = '';
          if (siteTrackers.length > 0) {
              statusDiv.textContent = "Rastreadores bloqueados:";
              const ul = document.createElement('ul');
              siteTrackers.forEach(domain => {
                  const li = document.createElement('li');
                  li.textContent = domain;
                  ul.appendChild(li);
              });
              statusDiv.appendChild(ul);
          } else {
              statusDiv.textContent = "Nenhum rastreador bloqueado até agora para este site.";
          }
      }).catch(err => console.error("Erro ao acessar storage:", err));
  }

  // Ouvir mensagens do background script para atualização em tempo real
  browser.runtime.onMessage.addListener((message) => {
      if (message.action === "updatePopup") {
          // Pega a aba ativa e atualiza o popup para essa URL
          browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
              const siteUrl = tabs[0].url;
              updatePopup(siteUrl);
          });
      }
  });

  // Atualizar o popup quando carregado
  browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      const siteUrl = tabs[0].url;
      updatePopup(siteUrl);
  });
});
