document.addEventListener('DOMContentLoaded', () => {
    const statusDiv = document.getElementById('status');
  
    // Exibir a lista de rastreadores bloqueados
    browser.storage.local.get('blockedTrackers').then(data => {
      const blocked = data.blockedTrackers || [];
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
    });
  });
  