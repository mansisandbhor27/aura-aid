export type NetworkStatus = 'disconnected' | 'connecting' | 'connected' | 'proof-ready' | 'error';

export type CampaignCategory =
  | 'education'
  | 'health'
  | 'water'
  | 'climate'
  | 'emergency'
  | 'livelihood';

export type CampaignStatus = 'active' | 'funded' | 'closing-soon';

export interface Milestone {
  id: string;
  title: string;
  targetAmount: number;
  releasedAmount: number;
  isReleased: boolean;
  proofHash: string;
}

export interface Campaign {
  id: string;
  ngoId: string;
  ngoName: string;
  ngoVerified: boolean;
  title: string;
  description: string;
  category: CampaignCategory;
  location: string;
  imageGradient: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  status: CampaignStatus;
  deadlineDaysLeft: number;
  shieldedPercent: number;
  milestones: Milestone[];
  tags: string[];
}

export interface Ngo {
  id: string;
  name: string;
  verified: boolean;
  mission: string;
  location: string;
  totalRaised: number;
  activeCampaigns: number;
  transparencyScore: number;
  proofCount: number;
  category: CampaignCategory;
}

export type ActivityKind = 'donation' | 'milestone-release' | 'proof-published' | 'ngo-verified';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  timestampLabel: string;
  shielded: boolean;
  amountLabel?: string;
  proofHash?: string;
  actorLabel: string;
}

export interface PlatformStats {
  totalDonated: number;
  totalDonors: number;
  activeNgos: number;
  proofsPublished: number;
  shieldedRatePercent: number;
}

export interface MidnightConnectionState {
  status: NetworkStatus;
  network: string;
  blockHeight: number | null;
  walletAddress: string | null;
  lastProofHash: string | null;
  message: string;
}

export type AppView = 'discover' | 'transparency' | 'ngos' | 'how-it-works';

export interface DonationDraft {
  campaignId: string;
  amount: number;
  shieldIdentity: boolean;
  shieldAmount: boolean;
}

export interface PrivacySummary {
  visibleToPublic: string[];
  hiddenByShielding: string[];
  verifiableWithoutReveal: string[];
}
