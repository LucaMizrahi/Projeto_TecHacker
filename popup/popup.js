document.addEventListener('DOMContentLoaded', () => {
    function updatePopup() {
      console.log("Função updatePopup chamada");
      const statusDiv = document.getElementById('status');
  
      browser.storage.local.get('blockedTrackers').then(data => {
        const blocked = data.blockedTrackers || [];
        console.log("Dados recebidos do storage:", blocked);
  
        // Limpar o conteúdo da div antes de atualizar
        statusDiv.innerHTML = '';
        if (blocked.length > 0) {
          statusDiv.textContent = "Rastreadores bloqueados:";
          const ul = document.createElement('ul');
          blocked.forEach(domain => {
            const li = document.createElement('li');
            li.textContent = domain;
            ul.appendChild(li);
          });
          statusDiv.appendChild(ul);
        } else {
          statusDiv.textContent = "Nenhum rastreador bloqueado ate agora.";
        }
      }).catch(err => console.error("Erro ao acessar storage:", err));
    }
  
    // Ouvir mensagens do background script para atualização em tempo real
    browser.runtime.onMessage.addListener((message) => {
      if (message.action === "updatePopup") {
        updatePopup();
      }
    });
  
    // Atualizar o popup quando carregado
    updatePopup();
  });
  