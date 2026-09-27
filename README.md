# 🌙 AuraAid — Privacy-Preserving NGO Donation Platform

[![AuraAid CI](https://github.com/mansisandbhor27/aura-aid/actions/workflows/ci.yml/badge.svg)](https://github.com/mansisandbhor27/aura-aid/actions/workflows/ci.yml)

AuraAid is a privacy-focused NGO donation platform built on the **Midnight blockchain Preprod network**.

The platform enables charitable organizations to register fundraising campaigns and accept transparent donations in native NIGHT tokens while protecting donor off-chain personal identity through client-side zero-knowledge proof generation.

---

## 🚀 Live MVP & Network Details

| Item | Details |
|---|---|
| **Network** | Midnight Preprod |
| **Live Demo** | [https://aura-aid-pied.vercel.app](https://aura-aid-pied.vercel.app) |
| **Deployed Contract Address** | `6afc78083dea96c04496a6de0e174c1e021e27a47f474bfbdedf91579310d4d1` |
| **Explorer Link** | [View Contract on Midnight Explorer](https://preprod.midnightexplorer.com/contract/6afc78083dea96c04496a6de0e174c1e021e27a47f474bfbdedf91579310d4d1) |
| **Product X Profile** | [https://x.com/AuraAid_NGO](https://x.com/AuraAid_NGO) |
| **GitHub Repository** | [https://github.com/mansisandbhor27/aura-aid](https://github.com/mansisandbhor27/aura-aid) |
| **User & Developer Guide** | [docs/USAGE.md](docs/USAGE.md) |

---

## 🎯 The Problem

Traditional donation platforms present challenges for both donors and NGOs:

- **Personal Data Exposure**: Donors must often surrender sensitive personal identifying information (PII) including physical addresses, email addresses, and phone numbers.
- **Centralized Custody & Tracking**: Centralized intermediaries maintain non-verifiable ledgers with high processing fees.
- **Verification Gaps**: Difficulty independently verifying that funds were received by legitimate NGO campaigns on-chain.

---

## 💡 The Solution

AuraAid leverages Midnight's zero-knowledge capabilities and smart contracts to create a verifiable donation workflow:

1. **NGO Campaign Registration**: NGOs create fundraising initiatives recorded on-chain via the Compact smart contract (`createCampaign`).
2. **Client-Side ZK Proving**: Donors generate zero-knowledge validity proofs locally using the Midnight Lace wallet (`keys/donate.prover`, `zkir/donate.bzkir`).
3. **Transparent Accounting**: The smart contract updates campaign balances on the public ledger (`campaignBalances`), ensuring real-time auditability.
4. **Donor Identity Protection**: No donor PII (names, emails, IP addresses) is submitted to or stored on the blockchain.

---

## ✨ Key Features

### 🔐 Zero-Knowledge Verifiable Donations
- Client-side zero-knowledge proofs verify transaction validity before broadcast.
- Donor wallet private keys and seed phrases remain isolated in the Midnight Lace wallet.
- No donor personal data or off-chain credentials are stored on the Midnight ledger.

### 🏛️ On-Chain Campaign Creation
- NGOs register campaigns with title, description, and fundraising goals.
- Goal amounts are recorded on-chain via the `createCampaign` circuit.
- Real-time indexing maps on-chain campaign IDs to frontend discovery cards.

### 💰 Direct Blockchain Donations
- Native NIGHT token donations through Midnight Preprod.
- Each contribution executes through the `donate` circuit and generates a verifiable transaction hash (`txId`).

### 📊 Transparent Campaign Balance Tracking
- Smart contract maintains on-chain balance maps (`campaignBalances`).
- Campaign progress percentages update dynamically from on-chain state and local indexer events.

### 🔎 Independent Transaction Verification
- Every donation produces a block height and transaction hash verifiable on the Midnight Explorer.
- Activity feed provides a chronological audit log of all platform donations.

### 🔗 Persistent Contract Configuration
- Deployed contract address is preserved across browser sessions via local storage.
- Custom deployment interface allows deploying new contract instances to Preprod when needed.

---

## 🧩 Architecture & Workflow

```text
┌─────────────────────────────────────────────────────────┐
│                      Donor / NGO                        │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│             Midnight Lace Wallet (Preprod)              │
│  • Private Key & Seed Protection                        │
│  • Client-Side ZK Proof Generation (Prover & ZKIR)      │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 AuraAid Web Application                 │
│  • Campaign Discovery & Filtering                       │
│  • NGO Dashboard & Campaign Creator                     │
│  • Real-Time Activity & Transparency Feed               │
│  • On-Chain Balance Reader (@midnight-ntwrk/midnight-js)│
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│             AuraAid Compact Smart Contract              │
│  • export ledger campaignCount: Uint<64>                │
│  • export ledger campaigns: Map<Uint<64>, Uint<64>>     │
│  • export ledger campaignBalances: Map<Uint<64>,Uint<64>│
│  • export circuit createCampaign(goalAmount_)           │
│  • export circuit donate(campaignId_, amount_)          │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 Midnight Preprod Network                │
│  • RPC: https://rpc.preprod.midnight.network            │
│  • Indexer: https://indexer.preprod.midnight.network    │
│  • Explorer: https://preprod.midnightexplorer.com       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔒 Privacy Model & On-Chain Analysis

To maintain technical accuracy and avoid overclaiming privacy capabilities:

- **What is Public on Ledger**:
  - Registered campaign count (`campaignCount`).
  - Target fundraising goals (`campaigns`).
  - Accumulated campaign balances (`campaignBalances`).
  - Disclosed parameters in `createCampaign` (goal amount) and `donate` (campaign ID and donation amount) for on-chain fund transfer and accounting.
  - Transaction identifiers (`txId`) and block numbers.
- **What is Protected / Private**:
  - Donor personal identifying information (real name, email, IP address, street address) is never requested by or stored on the ledger.
  - Wallet private keys, shielding keys, and seed phrases remain securely inside the Midnight Lace wallet.
  - Zero-knowledge proof execution occurs on the client device prior to submission.

---

## 🛠️ Local Development & Setup

### Prerequisites
- **Node.js**: `20.x` or `22.x` (LTS)
- **npm**: `10.x` or later
- **Midnight Lace Extension**: Configured for Midnight Preprod

### Installation

```bash
# 1. Clone repository
git clone https://github.com/mansisandbhor27/aura-aid.git
cd aura-aid

# 2. Install dependencies
npm ci

# 3. Start local development server
npm run dev
```

### Verification & Testing Commands

```bash
# Run TypeScript type check
npm run typecheck

# Run unit tests
npm test

# Build production bundle
npm run build
```

---

## 📖 Detailed Documentation

For a comprehensive walkthrough of wallet configuration, Preprod faucet funding, campaign lifecycle, and smart contract circuits, see [docs/USAGE.md](docs/USAGE.md).

---

## 🌐 Official Channels

- **Product X (Twitter)**: [https://x.com/AuraAid_NGO](https://x.com/AuraAid_NGO)
- **GitHub Repository**: [https://github.com/mansisandbhor27/aura-aid](https://github.com/mansisandbhor27/aura-aid)
- **Midnight Testnet Faucet**: [https://midnight-tmnight-preprod.nethermind.dev](https://midnight-tmnight-preprod.nethermind.dev)

---

## ⚠️ Limitations & Testnet Disclaimer

- **Testnet Environment**: AuraAid operates on the Midnight Preprod testnet. All tokens used are testnet NIGHT (tNIGHT) without real monetary value.
- **Seed Campaigns**: Initial campaign entries (IDs 1 through 6) are seeded in the contract constructor for demonstration purposes.
- **Network Latency**: Zero-knowledge proof generation and Preprod block confirmation typically require 10–30 seconds.
