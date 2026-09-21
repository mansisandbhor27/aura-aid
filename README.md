# AuraAid — Privacy-Preserving NGO Donation Transparency

AuraAid is a privacy-preserving NGO donation platform built on the **Midnight blockchain**.

The platform allows donors to contribute to verified NGO campaigns while keeping sensitive donor information private. Campaign and donation activity can be verified on-chain without exposing private donor data.

## 🚀 Live MVP

- **Network:** Midnight Preprod
- **Live Demo:** ADD_PREPROD_DEMO_LINK_HERE
- **Contract Address:** ADD_CONTRACT_ADDRESS_HERE
- **Product X Profile:** ADD_X_PROFILE_LINK_HERE

## ✨ Key Features

### 🔐 Donor Privacy

Donor-sensitive information and private witness data remain on the user's side. Zero-knowledge technology allows the application to prove required conditions without unnecessarily exposing private information.

### 💰 Transparent Donations

Donation transactions are recorded on the Midnight blockchain and can be independently verified.

### 🏛️ NGO Campaigns

NGOs can create fundraising campaigns with defined campaign goals.

### ✅ Verifiable On-chain Activity

Campaign and donation operations are executed through the AuraAid Midnight smart contract.

### 🔎 Public Transparency

Users can inspect campaign and transaction information while sensitive donor information remains protected.

## 🧩 How AuraAid Works

```text
User
  │
  ▼
Midnight Wallet
  │
  ▼
AuraAid Web Application
  │
  ├── Campaign Creation
  │
  ├── Donation
  │
  └── Transaction Verification
  │
  ▼
AuraAid Midnight Smart Contract
  │
  ▼
Midnight Preprod Network
```

## 🔄 CI/CD

AuraAid uses GitHub Actions to automatically validate the project.

[![AuraAid CI](https://github.com/mansisandbhor27/aura-aid/actions/workflows/ci.yml/badge.svg)](https://github.com/mansisandbhor27/aura-aid/actions/workflows/ci.yml)

The CI pipeline validates the project through:

- Dependency installation
- Type checking
- Tests
- Production build

## 🛠️ Tech Stack

- **Blockchain:** Midnight Preprod
- **Smart Contract:** Midnight Compact
- **Privacy:** Zero-knowledge proofs
- **Wallet:** Midnight Lace Wallet
- **Frontend:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Testing:** Vitest + Testing Library
- **CI/CD:** GitHub Actions

## 📋 Prerequisites

- Node.js >= 24.11.1
- npm >= 10.0.0
- Midnight Lace Wallet
- Docker Desktop if required by the local proof environment

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/mansisandbhor27/aura-aid.git
cd aura-aid
```

