# AuraAid User & Developer Guide

AuraAid is a privacy-focused NGO donation platform built on the **Midnight Preprod network**. It combines client-side zero-knowledge proof generation with transparent on-chain accounting so donors can contribute without exposing off-chain personal identifying information (PII).

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites & System Requirements](#2-prerequisites--system-requirements)
3. [Midnight Lace Wallet Setup](#3-midnight-lace-wallet-setup)
4. [Preprod Network Configuration](#4-preprod-network-configuration)
5. [Local Development & Running the App](#5-local-development--running-the-app)
6. [Discovering Campaigns](#6-discovering-campaigns)
7. [How Campaign Creation Works](#7-how-campaign-creation-works)
8. [How Donation Works](#8-how-donation-works)
9. [Transparency & Activity Verification](#9-transparency--activity-verification)
10. [Contract Deployment & Persistence](#10-contract-deployment--persistence)
11. [Privacy Architecture & On-Chain Guarantees](#11-privacy-architecture--on-chain-guarantees)
12. [Demo & Testnet Limitations](#12-demo--testnet-limitations)

---

## 1. Overview

AuraAid connects charitable organizations (NGOs) and donors using smart contracts deployed on Midnight. It offers:
- **Direct on-chain campaign registration** (`createCampaign` circuit).
- **Verifiable native token donations** in NIGHT (`donate` circuit).
- **Transparent ledger accounting** for campaign goals and accumulated balances.
- **Client-side zero-knowledge proofs** generated through the Midnight Lace wallet.
- **Off-chain donor privacy**: no real names, emails, or personal data are stored on the blockchain ledger.

---

## 2. Prerequisites & System Requirements

To run and build AuraAid locally, ensure you have:
- **Node.js**: Version `20.x` or `22.x` (LTS recommended)
- **npm**: Version `10.x` or later
- **Browser**: Google Chrome, Brave, or any Chromium-based browser supporting the Midnight Lace wallet extension
- **Git**: For source control

Verify your versions:
```bash
node -v
npm -v
```

---

## 3. Midnight Lace Wallet Setup

1. **Install the Midnight Lace Extension**:
   - Install the Lace wallet extension with Midnight support in your Chromium browser.
2. **Select the Preprod Network**:
   - Open the Lace wallet settings and ensure the active network is set to **Midnight Preprod**.
3. **Fund Your Wallet with Testnet NIGHT**:
   - Obtain testnet tNIGHT tokens via the official Midnight Nethermind Faucet:  
     `https://midnight-tmnight-preprod.nethermind.dev`
   - Paste your Midnight wallet unshielded address and request test tokens.
4. **Authorize the DApp**:
   - When connecting on AuraAid, approve the connection request in the Lace pop-up.

---

## 4. Preprod Network Configuration

The application connects to Midnight Preprod public infrastructure:

| Service | Endpoint |
|---|---|
| **Network ID** | `preprod` |
| **Node RPC** | `https://rpc.preprod.midnight.network` |
| **Node WebSocket** | `wss://rpc.preprod.midnight.network` |
| **Indexer GraphQL** | `https://indexer.preprod.midnight.network/api/v4/graphql` |
| **Indexer WebSocket** | `wss://indexer.preprod.midnight.network/api/v4/graphql/ws` |
| **Block Explorer** | `https://preprod.midnightexplorer.com` |
| **Testnet Faucet** | `https://midnight-tmnight-preprod.nethermind.dev` |
| **Deployed Contract** | `6afc78083dea96c04496a6de0e174c1e021e27a47f474bfbdedf91579310d4d1` |

---

## 5. Local Development & Running the App

### Step 1: Install Dependencies
```bash
npm ci
```

### Step 2: Start Development Server
```bash
npm run dev
```
The application will start at `http://localhost:5173`.

### Step 3: Typecheck, Test, and Build
```bash
# Run TypeScript validation
npm run typecheck

# Run unit tests with Vitest
npm test

# Build for production
npm run build
```

---

## 6. Discovering Campaigns

1. Navigate to the **Discover** tab in the top navigation bar.
2. Filter campaigns by category:
   - **All**: Displays all available campaigns.
   - **Active**: Ongoing fundraising initiatives.
   - **Funded**: Campaigns that have reached their target goal.
   - **Closing soon**: Campaigns nearing deadline.
3. Use the search bar to locate campaigns by title, NGO name, location, or tag (e.g. *Education*, *Water*, *Medical*).
4. Click on any campaign card to view detailed milestone descriptions, NGO credentials, and donation history.

---

## 7. How Campaign Creation Works

NGOs register fundraising campaigns on-chain via the AuraAid smart contract:

1. Click **NGO Dashboard** or navigate to the campaign creation section.
2. Enter the campaign details:
   - **Title & Description**
   - **Target Goal Amount** (in USD / NIGHT)
   - **Category & Location**
3. Ensure your Midnight Lace wallet is connected.
4. Click **Create Campaign On-Chain**:
   - The app calls the Compact `createCampaign(goalAmount_)` circuit.
   - A client-side zero-knowledge proof is generated with `keys/createCampaign.prover` and `zkir/createCampaign.bzkir`.
   - The Lace wallet prompts for transaction authorization.
   - Upon confirmation, the transaction is indexed on Midnight Preprod, incrementing `campaignCount` and registering the new campaign ID.

---

## 8. How Donation Works

1. Click **Donate** on any campaign card or detail page.
2. Select or enter a donation amount (e.g., \$25, \$50, \$100, or custom amount).
3. Review the on-chain transfer details:
   - Amount in base units (`1 NIGHT = 1,000,000 base units`).
   - Destination campaign ID on the ledger.
4. Click **Donate**:
   - **Stage 1 (Validating)**: Validates input amount and checks campaign existence on-chain.
   - **Stage 2 (Proving)**: Constructs the transaction and computes the zero-knowledge proof using `keys/donate.prover` and `zkir/donate.bzkir`.
   - **Stage 3 (Wallet Approval)**: Midnight Lace wallet prompts to sign and balance the unshielded NIGHT transaction.
   - **Stage 4 (Finalization)**: Submits transaction to Midnight Preprod RPC.
   - **Stage 5 (Confirmation)**: Returns transaction ID (`txId`), block height, and updated on-chain balance. Click the tx hash to view on Midnight Explorer.

---

## 9. Transparency & Activity Verification

1. Navigate to the **Transparency** tab.
2. View real-time donation records, block heights, explorer links, and aggregated campaign metrics.
3. Every transaction can be independently inspected on the [Midnight Explorer](https://preprod.midnightexplorer.com) using the on-chain transaction hash.

---

## 10. Contract Deployment & Persistence

- AuraAid comes pre-configured with an active deployed contract address on Preprod (`6afc78083dea96c04496a6de0e174c1e021e27a47f474bfbdedf91579310d4d1`).
- The contract address is persisted in browser storage (`localStorage`), allowing the application to maintain state across refreshes.
- Developers wishing to deploy a new instance can navigate to **Deploy Contract** in the navigation bar to submit a fresh contract deployment transaction.

---

## 11. Privacy Architecture & On-Chain Guarantees

AuraAid emphasizes truthful, verifiable privacy claims:

### What Is Kept Private:
- **Donor Personal Identifying Information (PII)**: Real names, email addresses, IP addresses, and physical locations are never written to the blockchain.
- **Wallet Keys & Seeds**: Private spending keys and seed phrases remain securely inside the Midnight Lace wallet.
- **Client-Side Proof Execution**: Zero-knowledge proofs are calculated locally on the user's machine before broadcast.

### What Is Recorded Publicly on the Ledger:
- **Campaign Ledger State**: Total registered campaigns (`campaignCount`), campaign goal targets (`campaigns` map), and total accumulated balance (`campaignBalances` map).
- **Disclosed Transaction Parameters**: The `donate(campaignId_, amount_)` circuit discloses the target campaign ID and donation amount to perform transparent ledger accounting and unshielded native NIGHT transfer (`receiveUnshielded`).
- **Transaction Metadata**: Transaction ID (`txId`), block number, and execution status.

---

## 12. Demo & Testnet Limitations

- **Network Environment**: Running on the **Midnight Preprod Testnet**. Transactions use testnet NIGHT (tNIGHT) tokens with no real-world monetary value.
- **Seed Campaigns**: The application includes illustrative seed campaigns (IDs 1 through 6) pre-populated in the smart contract constructor for demonstration.
- **Indexer & Proof Latency**: Zero-knowledge proof generation and block finalization on Preprod typically take between 10 to 30 seconds depending on network load and local CPU capacity.
