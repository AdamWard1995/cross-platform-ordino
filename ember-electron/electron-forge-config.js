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
      "CompanyName": "Quadriga",
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
    iconUrl: 'https://firebasestorage.googleapis.com/v0/b/ordino-b5acf.appspot.com/o/icon.ico?alt=media&token=a20a6929-d0e5-4684-b2ed-825b67c52eec',
    noMsi: true,
    authors: 'Adam Ward',
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
