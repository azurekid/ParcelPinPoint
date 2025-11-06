# Deployment Guide for ParcelPinPoint

## Azure Deployment Options

ParcelPinPoint is a **Node.js/Express application** that requires server-side processing for API endpoints. Here are your deployment options:

---

## ✅ Option 1: Azure App Service (Recommended)

**Best for:** Full-featured deployment with easy scaling and management

### Why App Service?
- Native Node.js runtime support
- Easy deployment via GitHub Actions, VS Code, or Azure CLI
- Built-in SSL certificates
- Auto-scaling capabilities
- Environment variable management
- Continuous deployment support

### Deployment Steps

#### Using Azure CLI:

```bash
# 1. Login to Azure
az login

# 2. Create a resource group
az group create --name ParcelPinPoint-rg --location westeurope

# 3. Create an App Service Plan (Linux, B1 tier for dev/test)
az appservice plan create \
  --name ParcelPinPoint-plan \
  --resource-group ParcelPinPoint-rg \
  --sku B1 \
  --is-linux

# 4. Create the Web App with Node.js runtime
az webapp create \
  --resource-group ParcelPinPoint-rg \
  --plan ParcelPinPoint-plan \
  --name parcelpinpoint-app \
  --runtime "NODE:18-lts"

# 5. Configure deployment from local Git (or use GitHub Actions)
az webapp deployment source config-local-git \
  --name parcelpinpoint-app \
  --resource-group ParcelPinPoint-rg

# 6. Deploy the application
git remote add azure <git-url-from-previous-command>
git push azure main:master
```

#### Using Azure Portal:

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" → "Web App"
3. Configure:
   - **Runtime stack**: Node 18 LTS
   - **Operating System**: Linux
   - **Region**: West Europe (or your preferred region)
   - **App Service Plan**: B1 (Basic) or higher
4. After creation, go to "Deployment Center"
5. Connect to your GitHub repository
6. Azure will auto-deploy on every push

### Cost Estimate:
- **B1 Basic**: ~€12/month (suitable for development/testing)
- **S1 Standard**: ~€58/month (recommended for production)

---

## ❌ Option 2: Azure Static Web Apps (NOT Suitable)

**Why it won't work:**
- Azure Static Web Apps on Storage Accounts are designed for **static content only** (HTML, CSS, JavaScript files)
- Cannot run Node.js server processes
- Cannot execute backend API endpoints
- No server-side rendering or API routes

**What would happen if you tried:**
- The HTML/CSS/JS files would load
- All API calls to `/api/locations`, `/api/services`, etc. would fail
- The application would not function

**Note:** Azure Static Web Apps with **managed functions** (not storage-backed) could work if you refactor the Express API into Azure Functions, but this requires significant code changes.

---

## ✅ Option 3: Azure Container Instances (ACI)

**Best for:** Containerized deployment without Kubernetes complexity

### Steps:

```bash
# 1. Create a Dockerfile (see below)
# 2. Build and push to Azure Container Registry

az acr create \
  --resource-group ParcelPinPoint-rg \
  --name parcelpinpointacr \
  --sku Basic

az acr build \
  --registry parcelpinpointacr \
  --image parcelpinpoint:latest .

# 3. Deploy to ACI
az container create \
  --resource-group ParcelPinPoint-rg \
  --name parcelpinpoint-container \
  --image parcelpinpointacr.azurecr.io/parcelpinpoint:latest \
  --dns-name-label parcelpinpoint \
  --ports 3000 \
  --cpu 1 \
  --memory 1
```

### Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## ✅ Option 4: Azure Kubernetes Service (AKS)

**Best for:** Large-scale, enterprise deployments with high availability

- Requires Kubernetes knowledge
- Overkill for this simple application
- Recommended only if you have existing AKS infrastructure

---

## Comparison Table

| Option | Cost (Monthly) | Complexity | Suitable? | Best For |
|--------|---------------|------------|-----------|----------|
| **App Service** | €12-58+ | Low | ✅ Yes | **Recommended** - Easy management |
| **Static Web Apps (Storage)** | €0.20 | Low | ❌ No | Static sites only |
| **Container Instances** | €12-30 | Medium | ✅ Yes | Docker enthusiasts |
| **AKS** | €60+ | High | ✅ Yes | Enterprise scale |

---

## 🎯 Recommendation

**Use Azure App Service (Option 1)** for ParcelPinPoint because:

1. ✅ Native Node.js support (no containers needed)
2. ✅ Easy deployment and management
3. ✅ Cost-effective for small to medium apps
4. ✅ Built-in monitoring and logging
5. ✅ Automatic SSL certificates
6. ✅ Can scale up/down as needed

---

## Environment Configuration

Regardless of deployment method, configure these environment variables:

```bash
PORT=3000  # Azure App Service sets this automatically
NODE_ENV=production
```

For production, consider:
- Adding a real database (Azure Cosmos DB, PostgreSQL)
- Implementing authentication
- Adding Application Insights for monitoring
- Setting up a custom domain

---

## Quick Start with GitHub Actions

Add `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure App Service

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'parcelpinpoint-app'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
```

---

## Support

For issues or questions:
- Azure App Service: [Documentation](https://docs.microsoft.com/azure/app-service/)
- Azure Static Web Apps: [Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- Azure Container Instances: [Documentation](https://docs.microsoft.com/azure/container-instances/)
