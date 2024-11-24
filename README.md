# Tracker Blocker - Firefox Plugin

## Colaboradores
- [Gustavo Stevenson](https://github.com/gustavoeso)
- [Luca Mizrahi](https://github.com/LucaMizrahi)
- [Pedro Paulo Camargo](https://github.com/PedroPauloMorenoCamargo)

## Sobre o Projeto
O **Tracker Blocker** é uma extensão para o navegador Firefox desenvolvida para bloquear rastreadores em sites. O plugin utiliza listas personalizadas e listas padrão para identificar e bloquear rastreadores durante a navegação.

## Funcionalidades
- **Bloqueio de Rastreadores**:
  - Utiliza uma lista padrão de rastreadores conhecidos.
  - Suporta uma lista personalizada criada pelo usuário.
- **Gerenciamento de Domínios**:
  - Adicionar e remover domínios na lista personalizada.
- **Interface Simples e Intuitiva**:
  - Visualize e gerencie os rastreadores diretamente na extensão.

## Funcionamento:

A extensão salva os rastreadores bloqueados de acordo com a aba atual. Ou seja, para cada aba, a extensão mantém uma lista de rastreadores que foram bloqueados naquela aba. 

**Observações Importantes**:

- Quando a extensão é removida, a lista de rastreadores bloqueados é apagada. 

- Mesmo que o bloqueio dos rastreadores seja desativado, a lista de rastreadores bloqueados é mantida com todos os rastreadores que foram bloqueados até o momento.

- O bloqueio de rastreadores é feito verificando se o domínio que deve ser bloqueado aparece na URL da requisição.

## Base de Rastreadores Utilizada

A base de rastreadores utilizada no projeto foi derivada da **[WhoTracksMe](https://www.ghostery.com/whotracksme/trackers)**, uma ferramenta da **Ghostery** para identificar rastreadores amplamente utilizados.  

A lista inicial de rastreadores incluía domínios amplamente conhecidos, como:
- **doubleclick.net**
- **googlesyndication.com**
- **ads.pubmatic.com**
- **optimizely.com**
- **chartbeat.com**

Essa lista foi expandida e adaptada ao longo do desenvolvimento para incluir rastreadores adicionais e permitir a personalização pelos usuários.

---

## Como Instalar
1. Faça o download dos arquivos do repositório.
2. No Firefox, vá até `about:debugging`.
3. Clique em **This Firefox** e selecione **Load Temporary Add-on**.
4. Escolha o arquivo `manifest.json` do projeto.

## Estrutura do Projeto
```plaintext
├── background.js     # Script principal para interceptar e bloquear requisições.
├── popup.html        # Interface da extensão.
├── popup.css         # Estilo da interface.
├── popup.js          # Lógica de interação do usuário.
├── trackerList.json  # Lista padrão de rastreadores.
```

## **Como Usar**

1. **Ativar/Desativar Bloqueio**  
   - Use o botão de alternância no popup para ativar ou desativar o bloqueio global de rastreadores.  

2. **Gerenciar Domínios Personalizados**  
   - Adicione ou remova domínios na lista personalizada:
     - Digite o domínio no campo de entrada.
     - Clique em "Adicionar" para incluir o domínio na lista.
     - Clique em "Remover" para excluí-lo da lista *(Para remover, o domínio deve estar na lista e escrito no campo de entrada)*.

3. **Visualizar Rastreadores Bloqueados**  
   - Acesse a seção **Rastreadores Bloqueados** no popup para visualizar os rastreadores detectados e bloqueados para o site atual.  

## **Tecnologias Utilizadas**

- **HTML, CSS e JavaScript**  
  - Para criar a interface e lógica do plugin.  

- **API de Extensão do Firefox**  
  - Para interceptar requisições e gerenciar o bloqueio de rastreadores.  

## **Capturas de Tela**

#### Gerenciamento de Domínios
![Gerenciamento de Domínios](./screenshots/domains-management.png)

#### Rastreadores Bloqueados
![Status dos Rastreadores](./screenshots/trackers-status.png)

### **Contribuições**

Contribuições são bem-vindas! Para enviar melhorias ou corrigir problemas:  

1. Abra uma issue descrevendo a mudança desejada.  
2. Envie um pull request com as alterações no repositório.  

### **Licença**

Este projeto está licenciado sob a **[MIT License](./LICENSE)**.  

--- 