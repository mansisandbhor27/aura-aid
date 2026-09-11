# AuraAid — Privacy-Preserving NGO Donation Transparency

AuraAid is a decentralized transparency platform built on the **Midnight blockchain** that provides verifiable tracking of NGO donations, project allocations, itemized expenditures, and measurable impact—while safeguarding donor identity and sensitive financial data through zero-knowledge cryptography.

## Key Features

- **Donor Privacy**: Sensitive donor identity and private witness inputs remain strictly on the donor's device. On-chain commitments anchor transactions without exposing personal details.
- **Verifiable Fund Allocation**: Ensures that total allocated funds cannot exceed verified donations received.
- **Expense Verification**: Itemized expenditures with cryptographic invoice hashes anchored on the Midnight ledger.
- **Impact Tracking**: Transparent distinction between unverified self-reported impact and on-chain verified milestones.
- **Independent Verification**: Public explorer enabling donors, auditors, and community members to cryptographically verify claims against the Midnight Preprod network.

## Tech Stack

- **Blockchain**: Midnight Preprod (`networkId: 'preprod'`)
- **Smart Contracts**: Midnight Compact Language (`language_version >= 0.23`)
- **DApp Connector**: `@midnight-ntwrk/dapp-connector-api` & Midnight Lace Wallet
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **Testing**: Vitest & Testing Library

## Getting Started

### Prerequisites

- Node.js >= 24.11.1
- npm >= 10.0.0
- Docker Desktop (for local proof server)
- Midnight Lace Wallet Chrome Extension

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run unit and integration tests
npm run test

# Typecheck TypeScript
npm run typecheck

# Build for production
npm run build
```

## License

Apache-2.0
