import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

import type { Campaign } from './types/index.ts';

import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';

import { Hero } from './components/landing/Hero.tsx';
import { HowItWorks } from './components/landing/HowItWorks.tsx';

import { CampaignDetail } from './components/campaigns/CampaignDetail.tsx';
import { CampaignGrid } from './components/campaigns/CampaignGrid.tsx';

import { DonateModal } from './components/donate/DonateModal.tsx';

import { ActivityFeed } from './components/transparency/ActivityFeed.tsx';

import { NgoDashboard } from './pages/NgoDashboard.tsx';
import { DeployContractPage } from './pages/DeployContractPage.tsx';

import { useMidnightConnection } from './services/midnight/useMidnightConnection.ts';

import {
  campaigns as mockCampaigns,
  platformStats,
} from './data/mockData.ts';

import {
  activityFeed,
} from './data/mockExtra.ts';


/* =========================================================
   TYPES
========================================================= */

type AppView =
  | 'discover'
  | 'transparency'
  | 'ngos'
  | 'how-it-works';


/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEY =
  'auraaid_campaigns';

const DONATION_STORAGE_KEY =
  'auraaid_campaign_donations';

const CONTRACT_ADDRESS_STORAGE_KEY =
  'auraaid_contract_address';

const DEPLOYMENT_TX_STORAGE_KEY =
  'auraaid_deployment_tx';

const CAMPAIGN_CREATED_EVENT =
  'auraaid-campaign-created';

const DONATION_COMPLETED_EVENT =
  'auraaid-donation-completed';


/* =========================================================
   SAVED CAMPAIGN TYPE
========================================================= */

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


/* =========================================================
   SAVED DONATION TYPE
========================================================= */

interface SavedDonation {
  campaignId: number;
  amount: number;
  txId: string;
  createdAt?: string;
}


/* =========================================================
   APP CONTENT
========================================================= */

function AppContent() {
  const navigate = useNavigate();


  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */

  const [view, setView] =
    useState<AppView>('discover');

  const [selected, setSelected] =
    useState<Campaign | null>(null);

  const [donateTarget, setDonateTarget] =
    useState<Campaign | null>(null);

  const [createdCampaigns, setCreatedCampaigns] =
    useState<Campaign[]>([]);

  const [loading, setLoading] =
    useState(true);


  /* -------------------------------------------------------
     MIDNIGHT CONNECTION
  ------------------------------------------------------- */

  const {
    connection,
    api,
    simulateConnect,
    simulateDisconnect,
    deploy,
    deploying,

    /*
     * IMPORTANT:
     * This is the live value from the Midnight hook.
     */
    contractAddress: liveContractAddress,

    deploymentTxId: liveDeploymentTxId,
  } = useMidnightConnection();


  /* =======================================================
     PERSIST CONTRACT ADDRESS
  ======================================================= */

  /*
   * Restore previously deployed contract address
   * from browser storage.
   *
   * This fixes:
   *
   * refresh page
   *      ↓
   * hook resets contractAddress
   *      ↓
   * DonateModal says "Contract not deployed"
   *
   * We now restore the deployed address.
   */

  const [storedContractAddress, setStoredContractAddress] =
    useState<string | null>(() => {
      try {
        return (
          localStorage.getItem(
            CONTRACT_ADDRESS_STORAGE_KEY,
          ) || null
        );
      } catch {
        return null;
      }
    });


  const [storedDeploymentTxId, setStoredDeploymentTxId] =
    useState<string | null>(() => {
      try {
        return (
          localStorage.getItem(
            DEPLOYMENT_TX_STORAGE_KEY,
          ) || null
        );
      } catch {
        return null;
      }
    });


  /*
   * If the hook has a live address use it.
   * Otherwise use the persisted address.
   */

  const contractAddress =
    liveContractAddress ||
    storedContractAddress ||
    null;


  const deploymentTxId =
    liveDeploymentTxId ||
    storedDeploymentTxId ||
    null;


  /* =======================================================
     SAVE NEW DEPLOYMENT
  ======================================================= */

  useEffect(() => {
    if (!liveContractAddress) {
      return;
    }

    try {
      localStorage.setItem(
        CONTRACT_ADDRESS_STORAGE_KEY,
        liveContractAddress,
      );

      setStoredContractAddress(
        liveContractAddress,
      );

      console.log(
        '[AURA DEPLOY] Contract address persisted:',
        liveContractAddress,
      );
    } catch (error) {
      console.error(
        '[AURA DEPLOY] Failed to persist contract address:',
        error,
      );
    }
  }, [
    liveContractAddress,
  ]);


  useEffect(() => {
    if (!liveDeploymentTxId) {
      return;
    }

    try {
      localStorage.setItem(
        DEPLOYMENT_TX_STORAGE_KEY,
        liveDeploymentTxId,
      );

      setStoredDeploymentTxId(
        liveDeploymentTxId,
      );

      console.log(
        '[AURA DEPLOY] Deployment tx persisted:',
        liveDeploymentTxId,
      );
    } catch (error) {
      console.error(
        '[AURA DEPLOY] Failed to persist deployment tx:',
        error,
      );
    }
  }, [
    liveDeploymentTxId,
  ]);


  /* =======================================================
     DEBUG CONTRACT STATE
  ======================================================= */

  useEffect(() => {
    console.log(
      '[AURA APP] Live contract:',
      liveContractAddress,
    );

    console.log(
      '[AURA APP] Stored contract:',
      storedContractAddress,
    );

    console.log(
      '[AURA APP] Active contract:',
      contractAddress,
    );
  }, [
    liveContractAddress,
    storedContractAddress,
    contractAddress,
  ]);


  /* =======================================================
     LOAD CREATED CAMPAIGNS
  ======================================================= */

  const loadCreatedCampaigns = useCallback(() => {
    try {

      /* ---------------------------------------------------
         LOAD CAMPAIGNS
      --------------------------------------------------- */

      const raw =
        localStorage.getItem(
          STORAGE_KEY,
        );


      if (!raw) {
        setCreatedCampaigns([]);
        return;
      }


      const saved: SavedCampaign[] =
        JSON.parse(raw);


      if (!Array.isArray(saved)) {
        setCreatedCampaigns([]);
        return;
      }


      /* ---------------------------------------------------
         LOAD DONATIONS
      --------------------------------------------------- */

      let savedDonations: SavedDonation[] = [];


      try {
        const donationRaw =
          localStorage.getItem(
            DONATION_STORAGE_KEY,
          );


        if (donationRaw) {
          const parsed =
            JSON.parse(donationRaw);


          if (Array.isArray(parsed)) {
            savedDonations =
              parsed.filter(
                (
                  donation,
                ): donation is SavedDonation =>
                  donation !== null &&
                  typeof donation === 'object' &&

                  Number.isFinite(
                    Number(
                      (
                        donation as SavedDonation
                      ).campaignId,
                    ),
                  ) &&

                  Number.isFinite(
                    Number(
                      (
                        donation as SavedDonation
                      ).amount,
                    ),
                  ) &&

                  typeof
                    (
                      donation as SavedDonation
                    ).txId === 'string',
              );
          }
        }

      } catch (donationError) {

        console.warn(
          '[AURA APP] Failed loading donations:',
          donationError,
        );

        savedDonations = [];
      }


      /* ---------------------------------------------------
         MAP CAMPAIGNS
      --------------------------------------------------- */

      const mapped: Campaign[] =
        saved
          .map(
            (
              item,
            ): Campaign | null => {

              const ledgerId =
                Number(
                  item.ledgerId ??
                    item.campaignId,
                );


              const goalAmount =
                Number(
                  item.goalAmount,
                );


              /* -------------------------------------------
                 VALID CAMPAIGN ID
              ------------------------------------------- */

              if (
                !Number.isInteger(
                  ledgerId,
                ) ||
                ledgerId <= 0
              ) {

                console.warn(
                  '[AURA APP] Invalid campaign ID:',
                  item,
                );

                return null;
              }


              /* -------------------------------------------
                 VALID GOAL
              ------------------------------------------- */

              if (
                !Number.isFinite(
                  goalAmount,
                ) ||
                goalAmount <= 0
              ) {

                console.warn(
                  '[AURA APP] Invalid campaign goal:',
                  item,
                );

                return null;
              }


              /* -------------------------------------------
                 GET DONATIONS
              ------------------------------------------- */

              const campaignDonations =
                savedDonations.filter(
                  (
                    donation,
                  ) =>
                    Number(
                      donation.campaignId,
                    ) === ledgerId,
                );


              /* -------------------------------------------
                 REMOVE DUPLICATE TRANSACTIONS
              ------------------------------------------- */

              const uniqueDonations =
                Array.from(
                  new Map(
                    campaignDonations.map(
                      (
                        donation,
                      ) => [
                        donation.txId,
                        donation,
                      ],
                    ),
                  ).values(),
                );


              /* -------------------------------------------
                 TOTAL RAISED
              ------------------------------------------- */

              const raisedAmount =
                uniqueDonations.reduce(
                  (
                    total,
                    donation,
                  ) =>
                    total +
                    Number(
                      donation.amount || 0,
                    ),
                  0,
                );


              /* -------------------------------------------
                 DONOR COUNT
              ------------------------------------------- */

              const donorCount =
                uniqueDonations.length;


              /* -------------------------------------------
                 CAMPAIGN OBJECT
              ------------------------------------------- */

              return {

                id:
                  item.id ||
                  `created-${ledgerId}`,

                ledgerId,

                ngoId:
                  'ngo-user-created',

                ngoName:
                  'AuraAid NGO',

                ngoVerified:
                  true,

                title:
                  item.title ||
                  `Campaign #${ledgerId}`,

                description:
                  item.description ||
                  'Community fundraising campaign.',

                category:
                  'emergency',

                location:
                  'India',

                imageGradient:
                  'from-teal-500 via-cyan-500 to-blue-600',

                goalAmount,

                /*
                 * IMPORTANT:
                 * Raised amount comes from
                 * successful donation records.
                 */
                raisedAmount,

                /*
                 * Number of successful
                 * unique transactions.
                 */
                donorCount,

                status:
                  'active',

                deadlineDaysLeft:
                  30,

                shieldedPercent:
                  100,

                milestones:
                  [],

                tags: [
                  'New Campaign',
                  'Community',
                ],
              };
            },
          )
          .filter(
            (
              campaign,
            ): campaign is Campaign =>
              campaign !== null,
          );


      /* ===================================================
         REMOVE DUPLICATE ON-CHAIN CAMPAIGN IDS
      =================================================== */

      const unique: Campaign[] = [];

      const seen =
        new Set<number>();


      for (
        const campaign of mapped
      ) {

        if (
          campaign.ledgerId ===
          undefined
        ) {
          continue;
        }


        if (
          seen.has(
            campaign.ledgerId,
          )
        ) {
          continue;
        }


        seen.add(
          campaign.ledgerId,
        );


        unique.push(
          campaign,
        );
      }


      console.log(
        '[AURA APP] Created campaigns:',
        unique,
      );


      setCreatedCampaigns(
        unique,
      );

    } catch (error) {

      console.error(
        '[AURA APP] Failed loading campaigns:',
        error,
      );

      setCreatedCampaigns([]);
    }

  }, []);


  /* =======================================================
     INITIAL LOAD + EVENTS
  ======================================================= */

  useEffect(() => {

    loadCreatedCampaigns();


    /* -----------------------------------------------------
       CAMPAIGN CREATED
    ----------------------------------------------------- */

    const handleCampaignCreated =
      () => {

        console.log(
          '[AURA APP] Campaign created event received.',
        );

        loadCreatedCampaigns();
      };


    window.addEventListener(
      CAMPAIGN_CREATED_EVENT,
      handleCampaignCreated,
    );


    /* -----------------------------------------------------
       DONATION COMPLETED
    ----------------------------------------------------- */

    const handleDonationCompleted =
      () => {

        console.log(
          '[AURA APP] Donation completed - refreshing campaigns.',
        );

        loadCreatedCampaigns();
      };


    window.addEventListener(
      DONATION_COMPLETED_EVENT,
      handleDonationCompleted,
    );


    /* -----------------------------------------------------
       STORAGE EVENT
    ----------------------------------------------------- */

    const handleStorage =
      (
        event: StorageEvent,
      ) => {

        if (
          event.key ===
            STORAGE_KEY ||

          event.key ===
            DONATION_STORAGE_KEY ||

          event.key ===
            CONTRACT_ADDRESS_STORAGE_KEY ||

          event.key ===
            DEPLOYMENT_TX_STORAGE_KEY
        ) {

          loadCreatedCampaigns();
        }
      };


    window.addEventListener(
      'storage',
      handleStorage,
    );


    /* -----------------------------------------------------
       CLEANUP
    ----------------------------------------------------- */

    return () => {

      window.removeEventListener(
        CAMPAIGN_CREATED_EVENT,
        handleCampaignCreated,
      );

      window.removeEventListener(
        DONATION_COMPLETED_EVENT,
        handleDonationCompleted,
      );

      window.removeEventListener(
        'storage',
        handleStorage,
      );
    };

  }, [
    loadCreatedCampaigns,
  ]);


  /* =======================================================
     INITIAL LOADING DELAY
  ======================================================= */

  useEffect(() => {

    const timer =
      window.setTimeout(
        () => {
          setLoading(false);
        },
        450,
      );


    return () => {
      window.clearTimeout(
        timer,
      );
    };

  }, []);


  /* =======================================================
     COMBINE CREATED + DEMO CAMPAIGNS
  ======================================================= */

  const featured =
    useMemo(() => {

      const combined = [
        ...createdCampaigns,
        ...mockCampaigns,
      ];


      const result: Campaign[] =
        [];


      const seenIds =
        new Set<string>();


      const seenLedgerIds =
        new Set<number>();


      for (
        const campaign of combined
      ) {

        const id =
          String(
            campaign.id,
          );


        /* -----------------------------------------------
           DUPLICATE STRING ID
        ----------------------------------------------- */

        if (
          seenIds.has(id)
        ) {
          continue;
        }


        /* -----------------------------------------------
           DUPLICATE LEDGER ID
        ----------------------------------------------- */

        if (
          campaign.ledgerId !==
            undefined &&

          seenLedgerIds.has(
            campaign.ledgerId,
          )
        ) {
          continue;
        }


        seenIds.add(
          id,
        );


        if (
          campaign.ledgerId !==
            undefined
        ) {

          seenLedgerIds.add(
            campaign.ledgerId,
          );
        }


        result.push(
          campaign,
        );
      }


      return result;

    }, [
      createdCampaigns,
    ]);


  /* =======================================================
     NAVIGATION
  ======================================================= */

  const go =
    (
      nextView: AppView,
    ) => {

      setView(
        nextView,
      );


      navigate('/');


      window.setTimeout(
        () => {

          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });

        },
        50,
      );
    };


  /* =======================================================
     DEPLOY PAGE
  ======================================================= */

  const openDeployPage =
    () => {

      navigate(
        '/deploy',
      );


      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };


  /* =======================================================
     DONATION HANDLER
  ======================================================= */

  const handleDonate =
    (
      campaign: Campaign,
    ) => {

      console.log(
        '[AURA APP] Donate clicked:',
        {
          id:
            campaign.id,

          ledgerId:
            campaign.ledgerId,

          title:
            campaign.title,

          contractAddress,
        },
      );


      /* ---------------------------------------------------
         VALID ON-CHAIN CAMPAIGN
      --------------------------------------------------- */

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


      /*
       * We intentionally DO NOT block here
       * based on contractAddress.
       *
       * DonateModal will receive the persisted
       * contract address.
       */

      setDonateTarget(
        campaign,
      );
    };


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar
        view={view}
        onNavigate={go}
        connection={connection}
        onConnect={simulateConnect}
        onDisconnect={
          simulateDisconnect
        }
        onDeploy={
          openDeployPage
        }
      />


      {/* =================================================
          MAIN
      ================================================= */}

      <main id="main-content">

        <Routes>

          {/* =================================================
              HOME
          ================================================= */}

          <Route
            path="/"
            element={
              <>

                {/* =========================================
                    DISCOVER
                ========================================= */}

                {view ===
                'discover' ? (
                  <>

                    <Hero
                      stats={
                        platformStats
                      }

                      onExplore={() =>
                        document
                          .getElementById(
                            'campaigns',
                          )
                          ?.scrollIntoView(
                            {
                              behavior:
                                'smooth',
                            },
                          )
                      }

                      onHowItWorks={() =>
                        go(
                          'how-it-works',
                        )
                      }
                    />


                    {/* =====================================
                        CAMPAIGNS
                    ===================================== */}

                    <div
                      id="campaigns"
                      className="scroll-mt-24"
                    >

                      <CampaignGrid
                        campaigns={
                          featured
                        }

                        onDonate={
                          handleDonate
                        }

                        onSelect={
                          setSelected
                        }

                        loading={
                          loading
                        }
                      />

                    </div>


                    <HowItWorks />

                  </>
                ) : null}


                {/* =========================================
                    TRANSPARENCY
                ========================================= */}

                {view ===
                'transparency' ? (

                  <ActivityFeed
                    items={
                      activityFeed
                    }
                  />

                ) : null}


                {/* =========================================
                    NGO
                ========================================= */}

                {view ===
                'ngos' ? (

                  <NgoDashboard
                    api={api}
                    contractAddress={
                      contractAddress
                    }
                  />

                ) : null}


                {/* =========================================
                    HOW IT WORKS
                ========================================= */}

                {view ===
                'how-it-works' ? (

                  <HowItWorks
                    detailed
                  />

                ) : null}

              </>
            }
          />


          {/* =================================================
              DEPLOY CONTRACT
          ================================================= */}

          <Route
            path="/deploy"
            element={
              <DeployContractPage
                connection={
                  connection
                }

                deploying={
                  deploying
                }

                contractAddress={
                  contractAddress
                }

                deploymentTxId={
                  deploymentTxId
                }

                onDeploy={
                  deploy
                }
              />
            }
          />


          {/* =================================================
              NGO DASHBOARD
          ================================================= */}

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


      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer
        onNavigate={go}
      />


      {/* =================================================
          CAMPAIGN DETAIL
      ================================================= */}

      {selected ? (

        <CampaignDetail
          campaign={
            selected
          }

          onClose={() =>
            setSelected(
              null,
            )
          }

          onDonate={(
            campaign,
          ) => {

            setSelected(
              null,
            );

            handleDonate(
              campaign,
            );
          }}
        />

      ) : null}


      {/* =================================================
          DONATION MODAL
      ================================================= */}

      {donateTarget ? (

        <DonateModal
          campaign={
            donateTarget
          }

          connection={
            connection
          }

          api={
            api
          }

          /*
           * IMPORTANT:
           * This is now the persisted contract address
           * when the live hook value is unavailable.
           */
          contractAddress={
            contractAddress
          }

          onClose={() =>
            setDonateTarget(
              null,
            )
          }
        />

      ) : null}

    </div>
  );
}


/* =========================================================
   APP ROOT
========================================================= */

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}