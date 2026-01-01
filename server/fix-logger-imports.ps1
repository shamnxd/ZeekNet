# PowerShell script to fix logger imports in all use cases
# Run this from server directory

$files = @(
    "src/application/use-cases/company/revert-to-default-plan.use-case.ts",
    "src/application/use-cases/company/handle-stripe-webhook.use-case.ts",
    "src/application/use-cases/company/change-subscription-plan.use-case.ts",
    "src/application/use-cases/admin/migrate-plan-subscribers.use-case.ts"
)

foreach ($file in $files) {
    Write-Host "Processing $file..." -ForegroundColor Green
    
    # Read file content
    $content = Get-Content $file -Raw
    
    # Replace logger import with ILogger
    $content = $content -replace "import \{ logger \} from '../../../infrastructure/config/logger';", "import { ILogger } from '../../../domain/interfaces/services/ILogger';"
    
    # Replace all logger. calls with this._logger.
    $content = $content -replace '\blogger\.', 'this._logger.'
    
    # Save file
    Set-Content -Path $file -Value $content -NoNewline
    
    Write-Host "Fixed $file" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Done! Fixed $($files.Count) files." -ForegroundColor Green
Write-Host "Next: Manually add logger to each constructor" -ForegroundColor Yellow
