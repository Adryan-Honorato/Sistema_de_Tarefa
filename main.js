// Importa os módulos necessários do Electron
const { app, BrowserWindow } = require("electron");

// Função para criar uma janela do navegador
const createWindow = () => {
  // Cria uma nova instância da janela com configurações específicas
  const win = new BrowserWindow({
    width: 800, // Largura da janela
    height: 600, // Altura da janela
  });

  // Carrega o arquivo HTML que será exibido na janela
  win.loadFile("index.html");
};

// Quando o aplicativo estiver pronto, cria a janela
app.whenReady().then(() => {
  createWindow();

  // Escuta o evento 'activate', que ocorre quando o ícone do aplicativo é clicado
  // Caso não haja janelas abertas, cria uma nova janela
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Evento disparado quando todas as janelas do aplicativo são fechadas
app.on('window-all-closed', () => {
  // Em sistemas que não sejam Mac (platform !== 'darwin'), o aplicativo é encerrado
  // Em Mac, o aplicativo normalmente permanece ativo, mesmo com todas as janelas fechadas
  if (process.platform !== 'darwin') app.quit();
});
