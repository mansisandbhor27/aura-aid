import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';

import { ActivityFeed } from './components/transparency/ActivityFeed.tsx';
import { CampaignDetail } from './components/campaigns/CampaignDetail.tsx';
import { CampaignGrid } from './components/campaigns/CampaignGrid.tsx';
import { DonateModal } from './components/donate/DonateModal.tsx';

import { Footer } from './components/layout/Footer.tsx';
import { Navbar } from './components/layout/Navbar.tsx';

import { Hero } from './components/landing/Hero.tsx';
import { HowItWorks } from './components/landing/HowItWorks.tsx';

import { DeployContractPage } from './pages/DeployContractPage.tsx';
import { NgoDashboard } from './pages/NgoDashboard.tsx';

import {
  campaigns as mockCampaigns,
  platformStats,
} from './data/mockData.ts';

import { activityFeed } from './data/mockExtra.ts';

import { useMidnightConnection } from './services/midnight/useMidnightConnection.ts';

import type {
  AppView,
  Campaign,
} from './types/index.ts';


const STORAGE_KEY = 'auraaid_campaigns';
const CAMPAIGN_CREATED_EVENT = 'auraaid-campaign-created';


interface SavedCampaign {
  id: string;
  campaignId?: number;
  ledgerId?: number;
  title: string;
  description: string;
  goalAmount: number;
  txId?: string;
  createdAt?: string;
}


function AppContent() {
  const navigate = useNavigate();

  const [view, setView] = useState<AppView>('discover');

  const [selected, setSelected] =
    useState<Campaign | null>(null);

  const [donateTarget, setDonateTarget] =
    useState<Campaign | null>(null);

  const [createdCampaigns, setCreatedCampaigns] =
    useState<Campaign[]>([]);

  const [loading, setLoading] = useState(true);


  const {
    connection,
    api,
    simulateConnect,
    simulateDisconnect,
    deploy,
    deploying,
    contractAddress,
    deploymentTxId,
  } = useMidnightConnection();


  /*
   * Load campaigns created by the NGO.
   *
   * These are stored in localStorage by CreateCampaign.tsx.
   */
  const loadCreatedCampaigns = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        setCreatedCampaigns([]);
        return;
      }

      const saved: SavedCampaign[] = JSON.parse(raw);

      if (!Array.isArray(saved)) {
        setCreatedCampaigns([]);
        return;
      }

      const mapped: Campaign[] = saved
        .map((item): Campaign | null => {
          const ledgerId = Number(
            item.ledgerId ?? item.campaignId,
          );

          const goalAmount = Number(
            item.goalAmount,
          );

          /*
           * Real donations need a valid on-chain
           * campaign ID.
           */
          if (
            !Number.isInteger(ledgerId) ||
            ledgerId <= 0
          ) {
            console.warn(
              '[AURA APP] Invalid campaign ID:',
              item,
            );

            return null;
          }

          if (
            !Number.isFinite(goalAmount) ||
            goalAmount <= 0
          ) {
            console.warn(
              '[AURA APP] Invalid campaign goal:',
              item,
            );

            return null;
          }

          return {
            id:
              item.id ||
              `created-${ledgerId}`,

            ledgerId,

            ngoId: 'ngo-user-created',

            ngoName: 'AuraAid NGO',

            ngoVerified: true,

            title:
              item.title ||
              `Campaign #${ledgerId}`,

            description:
              item.description ||
              'Community fundraising campaign.',

            category: 'emergency',

            location: 'India',

            imageGradient:
              'from-teal-500 via-cyan-500 to-blue-600',

            goalAmount,

            raisedAmount: 0,

            donorCount: 0,

            status: 'active',

            deadlineDaysLeft: 30,

            shieldedPercent: 100,

            milestones: [],

            tags: [
              'New Campaign',
              'Community',
            ],
          };
        })
        .filter(
          (
            campaign,
          ): campaign is Campaign =>
            campaign !== null,
        );


      /*
       * Avoid duplicate on-chain campaign IDs.
       */
      const unique: Campaign[] = [];
      const seen = new Set<number>();

      for (const campaign of mapped) {
        if (
          campaign.ledgerId === undefined
        ) {
          continue;
        }

        if (
          seen.has(campaign.ledgerId)
        ) {
          continue;
        }

        seen.add(campaign.ledgerId);
        unique.push(campaign);
      }

      console.log(
        '[AURA APP] Created campaigns:',
        unique,
      );

      setCreatedCampaigns(unique);

    } catch (error) {
      console.error(
        '[AURA APP] Failed loading campaigns:',
        error,
      );

      setCreatedCampaigns([]);
    }
  }, []);


  /*
   * Initial load + listen for newly created campaigns.
   */
  useEffect(() => {
    loadCreatedCampaigns();

    const handleCampaignCreated = () => {
      console.log(
        '[AURA APP] Campaign created event received.',
      );

      loadCreatedCampaigns();
    };

    window.addEventListener(
      CAMPAIGN_CREATED_EVENT,
      handleCampaignCreated,
    );

    const handleStorage = (
      event: StorageEvent,
    ) => {
      if (
        event.key === STORAGE_KEY
      ) {
        loadCreatedCampaigns();
      }
    };

    window.addEventListener(
      'storage',
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        CAMPAIGN_CREATED_EVENT,
        handleCampaignCreated,
      );

      window.removeEventListener(
        'storage',
        handleStorage,
      );
    };
  }, [loadCreatedCampaigns]);


  /*
   * Small initial loading delay.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 450);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);


  /*
   * Combine newly created campaigns with
   * existing demo campaigns.
   */
  const featured = useMemo(() => {
    const combined = [
      ...createdCampaigns,
      ...mockCampaigns,
    ];

    const result: Campaign[] = [];

    const seenIds = new Set<string>();
    const seenLedgerIds = new Set<number>();

    for (const campaign of combined) {
      const id = String(campaign.id);

      if (seenIds.has(id)) {
        continue;
      }

      if (
        campaign.ledgerId !== undefined &&
        seenLedgerIds.has(
          campaign.ledgerId,
        )
      ) {
        continue;
      }

      seenIds.add(id);

      if (
        campaign.ledgerId !== undefined
      ) {
        seenLedgerIds.add(
          campaign.ledgerId,
        );
      }

      result.push(campaign);
    }

    return result;
  }, [createdCampaigns]);


  /*
   * Navbar navigation.
   */
  const go = (nextView: AppView) => {
    setView(nextView);

    navigate('/');

    window.setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 50);
  };


  /*
   * Deploy page.
   */
  const openDeployPage = () => {
    navigate('/deploy');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  /*
   * Donation handler.
   */
  const handleDonate = (
    campaign: Campaign,
  ) => {
    console.log(
      '[AURA APP] Donate clicked:',
      {
        id: campaign.id,
        ledgerId: campaign.ledgerId,
        title: campaign.title,
      },
    );

    /*
     * Do not open the real donation flow
     * if the campaign is not linked to an
     * on-chain campaign.
     */
    if (
      !campaign.ledgerId ||
      campaign.ledgerId <= 0
    ) {
      console.error(
        '[AURA APP] Campaign has no valid ledger ID:',
        campaign,
      );

      return;
    }

    setDonateTarget(campaign);
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      <Navbar
        view={view}
        onNavigate={go}
        connection={connection}
        onConnect={simulateConnect}
        onDisconnect={simulateDisconnect}
        onDeploy={openDeployPage}
      />


      <main id="main-content">

        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={
              <>

                {/* DISCOVER */}
                {view === 'discover' ? (
                  <>
                    <Hero
                      stats={platformStats}
                      onExplore={() =>
                        document
                          .getElementById(
                            'campaigns',
                          )
                          ?.scrollIntoView({
                            behavior: 'smooth',
                          })
                      }
                      onHowItWorks={() =>
                        go('how-it-works')
                      }
                    />


                    {/* EXPLORE CAMPAIGNS */}
                    <div
                      id="campaigns"
                      className="scroll-mt-24"
                    >
                      <CampaignGrid
                        campaigns={featured}
                        onDonate={handleDonate}
                        onSelect={setSelected}
                        loading={loading}
                      />
                    </div>


                    <HowItWorks />
                  </>
                ) : null}


                {/* TRANSPARENCY */}
                {view === 'transparency' ? (
                  <ActivityFeed
                    items={activityFeed}
                  />
                ) : null}


                {/* NGO */}
                {view === 'ngos' ? (
                  <NgoDashboard
                    api={api}
                    contractAddress={
                      contractAddress
                    }
                  />
                ) : null}


                {/* HOW IT WORKS */}
                {view === 'how-it-works' ? (
                  <HowItWorks
                    detailed
                  />
                ) : null}

              </>
            }
          />


          {/* DEPLOY */}
          <Route
            path="/deploy"
            element={
              <DeployContractPage
                connection={connection}
                deploying={deploying}
                contractAddress={
                  contractAddress
                }
                deploymentTxId={
                  deploymentTxId
                }
                onDeploy={deploy}
              />
            }
          />


          {/* NGO DASHBOARD */}
          <Route
            path="/ngo-dashboard"
            element={
              <NgoDashboard
                api={api}
                contractAddress={
                  contractAddress
                }
              />
            }
          />

        </Routes>

      </main>


      <Footer
        onNavigate={go}
      />


      {/* CAMPAIGN DETAIL */}
      {selected ? (
        <CampaignDetail
          campaign={selected}
          onClose={() =>
            setSelected(null)
          }
          onDonate={(campaign) => {
            setSelected(null);
            handleDonate(campaign);
          }}
        />
      ) : null}


      {/* DONATION MODAL */}
      {donateTarget ? (
        <DonateModal
          campaign={donateTarget}
          connection={connection}
          api={api}
          contractAddress={
            contractAddress
          }
          onClose={() =>
            setDonateTarget(null)
          }
        />
      ) : null}

    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
