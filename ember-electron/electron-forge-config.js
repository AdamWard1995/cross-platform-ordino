/* eslint-env node */
module.exports = {
  "make_targets": {
    "win32": [
      "squirrel"
    ],
    "darwin": [
      "zip"
    ],
    "linux": [
      "deb",
      "rpm"
    ]
  },
  "electronPackagerConfig": {
    "name": "Ordino",
    "icon": "public/icon.ico",
    "overwrite": true,
    "win32metadata": {
      "CompanyName": "Quadriga Software Development Group",
      "ProductName": "Ordino",
      "InternalName": "Ordino",
      "FileDescription": "Ordino, student organization on the go.",
      "LegalCopyright": "",
      "OriginalFilename": "Ordino.exe"
    }
  },
  "electronWinstallerConfig": {
    name: 'Ordino',
    icon: 'public/icon.ico',
    exe: 'Ordino.exe',
    setupExe: 'Ordino-Windows-Setup.exe',
    setupIcon: 'public/icon.ico',
    loadingGif: 'public/loading.gif',
    iconUrl: 'https://firebasestorage.googleapis.com/v0/b/ordino-b5acf.appspot.com/o/icon.ico?alt=media&token=48c3b1c0-f02a-4f82-aba5-622f9c5b9ea8',
    noMsi: true,
    authors: 'Quadriga Software Development Group',
    title: 'Ordino'
  },
  "electronInstallerDebian": {},
  "electronInstallerRedhat": {},
  "github_repository": {
    "owner": "",
    "name": ""
  },
  "windowsStoreConfig": {
    "packageName": ""
  }
};
