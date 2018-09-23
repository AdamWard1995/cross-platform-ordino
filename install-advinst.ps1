Invoke-WebRequest http://www.advancedinstaller.com/downloads/14.3/advinst.msi -OutFile "$env:TEMP\advinst.msi"
msiexec.exe /i "$env:TEMP\advinst.msi" /qn | Out-Null
Get-ItemProperty 'hklm:\SOFTWARE\Wow6432Node\Caphyon\Advanced Installer' -ErrorAction SilentlyContinue | select -ExpandProperty 'Advanced Installer Path' -OutVariable ADVANCED_INSTALLER_PATH >$null
If (!$ADVANCED_INSTALLER_PATH) {
  Get-ItemProperty 'hklm:\SOFTWARE\Caphyon\Advanced Installer' -ErrorAction SilentlyContinue | select -ExpandProperty 'Advanced Installer Path' -OutVariable ADVANCED_INSTALLER_PATH >$null

  If (!$ADVANCED_INSTALLER_PATH) {
    "AdvancedInstaller not installed correctly"
    Exit 1
  }
}

$ADVANCED_INSTALLER_PATH = Join-Path $ADVANCED_INSTALLER_PATH "bin\x86"

$env:PATH = "$ADVANCED_INSTALLER_PATH;$env:PATH"
AdvancedInstaller.com /register "$env:ADVANCED_INSTALLER_LICENSE_ID"