import { useEffect, useMemo, useState } from 'react';
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

import { campaigns, platformStats } from './data/mockData.ts';
import { activityFeed } from './data/mockExtra.ts';

import { useMidnightConnection } from './services/midnight/useMidnightConnection.ts';

import type { AppView, Campaign } from './types/index.ts';
import { NgoDashboard } from './pages/NgoDashboard.tsx';


function AppContent() {
  const navigate = useNavigate();

  const [view, setView] = useState<AppView>('discover');

  const [selected, setSelected] =
    useState<Campaign | null>(null);

  const [donateTarget, setDonateTarget] =
    useState<Campaign | null>(null);

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


  const featured = useMemo(
    () => campaigns,
    [],
  );


  useEffect(() => {
    const t = window.setTimeout(
      () => setLoading(false),
      450,
    );

    return () => window.clearTimeout(t);
  }, []);


  const go = (v: AppView) => {
    setView(v);

    navigate('/');

    window.setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 50);
  };


  const openDeployPage = () => {
    navigate('/deploy');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* ================= NAVBAR ================= */}

      <Navbar
        view={view}
        onNavigate={go}
        connection={connection}
        onConnect={simulateConnect}
        onDisconnect={simulateDisconnect}
        onDeploy={openDeployPage}
      />


      {/* ================= MAIN ================= */}

      <main id="main-content">

        <Routes>

          {/* ================= HOME ================= */}

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
                          .getElementById('campaigns')
                          ?.scrollIntoView({
                            behavior: 'smooth',
                          })
                      }

                      onHowItWorks={() =>
                        go('how-it-works')
                      }
                    />


                    <div id="campaigns">

                      <CampaignGrid
                        campaigns={featured}
                        onDonate={setDonateTarget}
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


                {/* NGOS */}
{view === 'ngos' ? (
  <NgoDashboard
    api={api}
    contractAddress={contractAddress}
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


          {/* ================= DEPLOY CONTRACT ================= */}

          <Route
            path="/deploy"
            element={
              <DeployContractPage
                connection={connection}
                deploying={deploying}
                contractAddress={contractAddress}
                deploymentTxId={deploymentTxId}
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
      contractAddress={contractAddress}
    />
  }
/>

        </Routes>

      </main>


      {/* ================= FOOTER ================= */}

      <Footer
        onNavigate={go}
      />


      {/* ================= CAMPAIGN DETAIL ================= */}

      {selected ? (
        <CampaignDetail
          campaign={selected}

          onClose={() =>
            setSelected(null)
          }

          onDonate={(campaign) => {
            setSelected(null);
            setDonateTarget(campaign);
          }}
        />
      ) : null}


      {/* ================= DONATE MODAL ================= */}

      {donateTarget ? (
        <DonateModal
          campaign={donateTarget}
          connection={connection}
          api={api}
          contractAddress={contractAddress}

          onClose={() =>
            setDonateTarget(null)
          }
        />
      ) : null}

    </div>
  );
}


/* ================= APP ================= */

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}