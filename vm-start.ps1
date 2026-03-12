# Start the AutoTask Azure VM
Write-Host "Starting AutoTask VM..." -ForegroundColor Green
az vm start --resource-group autotask-rg --name autotask-vm
Write-Host ""
Write-Host "VM started! Getting public IP..." -ForegroundColor Green
$ip = az vm show -d --resource-group autotask-rg --name autotask-vm --query publicIps -o tsv
Write-Host "Public IP: $ip" -ForegroundColor Cyan
Write-Host "Backend:   http://${ip}/api/health" -ForegroundColor Cyan
Write-Host "Frontend:  https://autotask.yaswanthsai.tech" -ForegroundColor Cyan
