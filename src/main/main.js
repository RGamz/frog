import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import * as cryptoUtil from '../utils/crypto.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
const userDataPath = app.getPath('userData');
const passwordFile = path.join(userDataPath, 'password.enc');
const notesFile = path.join(userDataPath, 'notes.enc');

console.log(passwordFile);

function createWindow(view) {
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  
  // Run the development server at localhost:4000
  mainWindow.loadURL('http://localhost:4000/#/' + view);
}

app.whenReady().then(() => {
  // Check if password file exists
  if (!fs.existsSync(passwordFile)) {
    // No password set yet => show password setup view
    createWindow('passwordSetup');
  } else {
    // Password file exists => show password prompt view
    createWindow('passwordPrompt');
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow('passwordPrompt');
  });
});

ipcMain.handle('set-password', async (event, password) => {
  const { salt, hashedKey } = await cryptoUtil.hashPassword(password);
  const data = { salt, hashedKey };
  fs.writeFileSync(passwordFile, JSON.stringify(data));
  return true;
});

ipcMain.handle('verify-password', async (event, password) => {
  const content = JSON.parse(fs.readFileSync(passwordFile, 'utf8'));
  const isValid = await cryptoUtil.verifyPassword(password, content.salt, content.hashedKey);
  return isValid;
});

ipcMain.handle('save-notes', async (event, { password, text }) => {
  const encrypted = await cryptoUtil.encryptText(text, password);
  fs.writeFileSync(notesFile, JSON.stringify(encrypted));
  return true;
});

ipcMain.handle('load-notes', async (event, password) => {
  if (!fs.existsSync(notesFile)) {
    return ''; // no notes yet
  }
  const encData = JSON.parse(fs.readFileSync(notesFile, 'utf8'));
  const decrypted = await cryptoUtil.decryptText(encData, password);
  return decrypted;
});
