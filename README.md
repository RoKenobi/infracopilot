# 🛠️ InfraCopilot  
*GenAI-Powered CLI for Debugging Cloud & Container Errors*

[![Run in AI Studio](https://img.shields.io/badge/AI_Studio-Deployed-blue?logo=google)](https://ai.studio/apps/drive/1uMihh1X1XhkPwgdhfPoevIB5XxRexZZH)

InfraCopilot uses **Google Gemini** to transform cryptic infrastructure errors (Docker, Kubernetes, SELinux, AWS) into actionable SRE-style guidance:  
✅ **Root Cause** | ✅ **Fix** (with commands) | ✅ **Prevention**

Built for engineers who debug cloud-native systems—and want AI that *understands production realities*, not just theory.

> *“Why is my container crashing? Paste the error. Get the fix.”*

---

## 🚀 Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Gemini API Key](https://aistudio.google.com/app/apikey)

### Setup
1. Install dependencies:  
   ```bash
   npm install
   ```
2. Add your API key to `.env.local`:  
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. Start the app:  
   ```bash
   npm run dev
   ```

---

## 💡 Sample Use Case
**Input error**:  
`docker: Error response from daemon: permission denied while trying to connect to the Docker daemon socket`

**InfraCopilot output**:  
```
ROOT CAUSE: Non-root user lacks permissions to access Docker socket (/var/run/docker.sock)  
FIX: Add user to docker group: sudo usermod -aG docker $USER && newgrp docker  
PREVENTION: Avoid direct socket access in CI/CD; use rootless Docker or Podman for security
```

---

## 🌐 Deploy Your Own
- **AI Studio**: [One-click deploy](https://ai.studio/apps/drive/1uMihh1X1XhkPwgdhfPoevIB5XxRexZZH)  
- **Self-host**: Build with `npm run build` → deploy to any Node.js platform (Railway, Render, etc.)

---

## 🛡️ Security Note
- Never commit `.env.local` to version control  
- Restrict Gemini API keys to `http://localhost:*` during development  
- In production, use short-lived credentials and audit logs

---

## 🤝 Why This Matters
This tool mirrors real-world SRE workflows at companies like **Visa**, where:  
- GenAI augments (not replaces) human expertise  
- Security hardening (SELinux, PoLP) is non-negotiable  
- Clear runbooks prevent repeat incidents  

*Ideal for aspiring infrastructure engineers, DevOps practitioners, and VC analysts evaluating infra-heavy startups.*

---

✨ **Contribute**: PRs welcome! Especially for adding error templates (AWS/GCP/K8s).  
📄 **License**: MIT

---
