# 🌙 AuraAid — Privacy-Preserving NGO Donation Platform

AuraAid is a privacy-preserving NGO donation platform built on the **Midnight blockchain**.

The goal of AuraAid is to make charitable donations more transparent and verifiable while protecting sensitive donor information through Midnight's privacy-focused architecture and zero-knowledge technology.

---

## 🚀 Live MVP

| Item | Details |
|---|---|
| Network | Midnight Preprod |
| Live Demo | https://aura-aid-pied.vercel.app |
| Contract Address | 6afc78083dea96c04496a6de0e174c1e021e27a47f474bfbdedf91579310d4d1|
| Product X Profile | https://x.com/AuraAid_NGO |
| GitHub | https://github.com/mansisandbhor27/aura-aid |

> The live demo and contract address will be updated with the final deployed Preprod values.

---

# 🎯 Problem

Traditional NGO donation platforms often require donors to trust centralized systems with donation records and personal information.

This creates several challenges:

- Limited transparency around donation activity
- Centralized handling of sensitive information
- Difficulty independently verifying transactions
- Reduced privacy for donors
- Limited connection between donation records and blockchain verification

AuraAid explores how blockchain and zero-knowledge technology can address these problems.

---

# 💡 Solution

AuraAid provides a blockchain-based donation workflow where:

1. An NGO creates a fundraising campaign.
2. The campaign is recorded through the AuraAid Midnight smart contract.
3. A donor connects a compatible Midnight wallet.
4. The donor selects a campaign.
5. The donation transaction is submitted through the Midnight network.
6. The application updates the campaign's donation information.
7. Transaction information can be used for verification while sensitive donor information remains protected.

---

# ✨ Key Features

## 🔐 Privacy-Preserving Donations

AuraAid is designed around Midnight's privacy-focused architecture.

Sensitive information and private witness data remain associated with the user's local/private state instead of being unnecessarily exposed publicly.

---

## 🏛️ NGO Campaign Creation

NGOs can create fundraising campaigns by providing:

- Campaign title
- Campaign description
- Fundraising goal

Campaign creation is performed through the AuraAid Midnight smart contract.

---

## 💰 Blockchain Donations

Donors can contribute to campaigns through the Midnight network.

Each successful donation produces a transaction identifier that can be used for verification.

---

## 📊 Campaign Progress

Campaign pages display fundraising progress based on successful donation records.

The application maintains campaign-level donation information and updates the displayed amount after successful transactions.

---

## 🔎 Transaction Verification

AuraAid records relevant transaction identifiers so that blockchain activity can be independently inspected and verified.

---

## 🦾 NGO Dashboard

The application provides an NGO dashboard for campaign-related information and blockchain-connected functionality.

---

## 🔗 Persistent Contract Configuration

The deployed AuraAid contract address is persisted in browser storage.

This allows the application to continue using the deployed contract after a browser refresh instead of requiring a new deployment every time.

---

# 🧩 How AuraAid Works

```text
                    ┌─────────────────────┐
                    │       Donor         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Midnight Wallet   │
                    └──────────┬──────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │       AuraAid Web App          │
              │                                │
              │  • Campaign Creation           │
              │  • Campaign Discovery          │
              │  • Donations                   │
              │  • Campaign Progress           │
              │  • Transaction Information     │
              └───────────────┬────────────────┘
                              │
                              ▼
              ┌────────────────────────────────┐
              │   AuraAid Midnight Contract   │
              └───────────────┬────────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │   Midnight Preprod      │
                 │        Network          │
                 └─────────────────────────┘
