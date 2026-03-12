# Stop (deallocate) the AutoTask Azure VM to save costs
Write-Host "Deallocating AutoTask VM (this stops billing for compute)..." -ForegroundColor Yellow
az vm deallocate --resource-group autotask-rg --name autotask-vm
Write-Host "VM deallocated. No compute charges while stopped." -ForegroundColor Green
Write-Host "Run .\vm-start.ps1 to start it again." -ForegroundColor Cyan
