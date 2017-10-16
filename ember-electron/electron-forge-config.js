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
    // "versionString": {
    //   "CompanyName": "Quadriga",
    //   "ProductName": "Ordino",
    //   "InternalName": "Ordino"
    // },
  },
  "electronWinstallerConfig": {
    name: 'Ordino',
    icon: 'public/icon.ico',
    exe: 'Ordino.exe',
    setupExe: 'Ordino-Windows-Installer.exe',
    setupIcon: 'public/icon.ico',
    loadingGif: 'public/loading.gif',
    noMsi: true,
    authors: 'Adam Ward',
    title: 'Ordino',
    "win32metadata": {
      "CompanyName": "Quadriga",
      "ProductName": "Ordino",
      "InternalName": "Ordino",
      "FileDescription": "Ordino",
      "OriginalFilename": "Ordino.exe"
    }
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
