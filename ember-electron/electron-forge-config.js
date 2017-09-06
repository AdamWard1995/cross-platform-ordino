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
  "electronPackagerConfig": {},
  "electronWinstallerConfig": {
    "name": "ordino"
  },
  "electronInstallerDebian": {},
  "electronInstallerRedhat": {},
  "github_repository": {
    "owner": "AdamWard1995",
    "name": "cross-platform-ordino"
  },
  "windowsStoreConfig": {
    "packageName": "ordino"
  }
};
