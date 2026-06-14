import type { AppHealth } from './aiService';

function wingetCommand(app: AppHealth): string {
  const cmd = app.updateCommand || `winget upgrade --id ${app.name}`;
  return `${cmd} --accept-package-agreements --accept-source-agreements`;
}

export function buildSingleAppPs1(app: AppHealth): string {
  const cmd = wingetCommand(app);
  return `# SoftScan — update script for ${app.name}
# Generated ${new Date().toLocaleString()}

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Run PowerShell as Administrator." -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    Exit
}

Write-Host "Updating ${app.name}..." -ForegroundColor Cyan
Invoke-Expression "${cmd}"
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: ${app.name} updated." -ForegroundColor Green
} else {
    Write-Host "Finished with exit code $LASTEXITCODE." -ForegroundColor Yellow
}
Read-Host "Press Enter to close..."
`;
}

export function buildBatchPs1(apps: AppHealth[]): string {
  const commandsBlock = apps
    .map((app) => {
      const cmd = wingetCommand(app);
      return `Write-Host ">>> Starting update for ${app.name}..." -ForegroundColor Cyan
Invoke-Expression "${cmd}"
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: ${app.name} successfully updated!" -ForegroundColor Green
} else {
    Write-Host "WARNING: ${app.name} update finished with status code $LASTEXITCODE." -ForegroundColor Yellow
}
Write-Host ""`;
    })
    .join('\n');

  return `# SoftScan Software Safety Audit - BATCH Update Script
# Generated automatically to upgrade ${apps.length} applications

Clear-Host
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "   SoftScan BATCH Application Updater Script  " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Updating ${apps.length} applications sequentially." -ForegroundColor Yellow
Write-Host ""

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host ""
    Write-Host "CRITICAL WARNING: ADMINISTRATOR PRIVILEGES REQUIRED!" -ForegroundColor Red
    Write-Host "Please re-run this PowerShell script in an elevated window." -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit..."
    Exit
}

Write-Host "Status: Administrator privileges verified." -ForegroundColor Green
Write-Host "Starting batch updates now..." -ForegroundColor Cyan
Write-Host ""

${commandsBlock}

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "   Batch update process completed!            " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to close this window..."
`;
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
