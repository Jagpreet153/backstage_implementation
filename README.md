#  Backstage Local Setup

## Overview

This project sets up **Backstage**, an open-source developer portal platform by Spotify, locally on your machine.  
Backstage provides a central place for managing software catalogs, developer tools, documentation, CI/CD pipelines, and infrastructure.

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

Ensure you have the following installed on your system:

| Tool         | Version  |
|--------------|----------|
| **Node.js**  | >= 18.x  |
| **Yarn**     | >= 1.22  |
| **Docker**   | Optional (for local PostgreSQL setup) |
| **Git**      | Latest   |

---

### 2️⃣ Setup Instructions

#### Clone the Repository (if applicable)

```bash
git clone <your-repo-url>
cd <project-directory>
```

### 3️⃣ Install Dependencies

```bash
yarn install
```

### 5️⃣: Run the Application

```bash
yarn start
```

### 9️⃣: Project Structure
```bash
├── app/                # Frontend application
├── backend/            # Backend services (catalog, scaffolder, etc.)
├── plugins/            # Custom plugins (optional)
├── packages/           # Shared components, APIs, utilities
├── catalog-info.yaml   # Service and component catalog definitions
├── app-config.yaml     # Main configuration file
```

### 🔟: Create a Plugin (Optional)
```bash
yarn backstage-cli create-plugin


