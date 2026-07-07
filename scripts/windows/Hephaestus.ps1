$ErrorActionPreference = "Stop"

$Distro = "hephaestus"
$Project = "/home/user/hephaestus"
$Url = "http://localhost:8787"

function Invoke-HephaestusWsl($Command) {
  & wsl.exe -d $Distro -- bash -lc "cd '$Project' && $Command"
  if ($LASTEXITCODE -ne 0) {
    throw "WSL command failed: $Command"
  }
}

Invoke-HephaestusWsl "./scripts/service.sh start"

try {
  $edge = Get-Command msedge.exe -ErrorAction SilentlyContinue
  if ($edge) {
    $profile = Join-Path $env:TEMP "HephaestusAppProfile"
    $args = @("--user-data-dir=$profile", "--app=$Url", "--no-first-run")
    $process = Start-Process -FilePath $edge.Source -ArgumentList $args -PassThru
    Wait-Process -Id $process.Id
  } else {
    Start-Process $Url
    Read-Host "Close the browser window, then press Enter to stop Hephaestus"
  }
} finally {
  Invoke-HephaestusWsl "./scripts/service.sh stop"
}
