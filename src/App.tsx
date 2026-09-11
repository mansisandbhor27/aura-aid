import { useMemo, useState } from 'react';
import { ActivityFeed } from './components/transparency/ActivityFeed.tsx';
import { CampaignDetail } from './components/campaigns/CampaignDetail.tsx';
import { CampaignGrid } from './components/campaigns/CampaignGrid.tsx';
import { DonateModal } from './components/donate/DonateModal.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Hero } from './components/landing/Hero.tsx';
import { HowItWorks } from './components/landing/HowItWorks.tsx';
import { NgoCards } from './components/ngos/NgoCards.tsx';
import { campaigns, platformStats } from './data/mockData.ts';
import { activityFeed, ngos } from './data/mockExtra.ts';
import { useMidnightConnection } from './services/midnight/useMidnightConnection.ts';
import type { AppView, Campaign } from './types/index.ts';

export default function App() {
  const [view, setView] = useState<AppView>('discover');
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [donateTarget, setDonateTarget] = useState<Campaign | null>(null);
  const { connection, simulateConnect, simulateDisconnect } = useMidnightConnection();
  const featured = useMemo(() => campaigns.slice(0, 6), []);

  const go = (v: AppView) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar view={view} onNavigate={go} connection={connection} onConnect={simulateConnect} onDisconnect={simulateDisconnect} />
      <main>
        {view === 'discover' ? (
          <>
            <Hero
              stats={platformStats}
              onExplore={() => document.getElementById('campaigns')?.scrollIntoView({ behavior: 'smooth' })}
              onHowItWorks={() => go('how-it-works')}
            />
            <div id="campaigns">
              <CampaignGrid campaigns={featured} onDonate={setDonateTarget} onSelect={setSelected} />
            </div>
            <HowItWorks />
          </>
        ) : null}
        {view === 'transparency' ? <ActivityFeed items={activityFeed} /> : null}
        {view === 'ngos' ? <NgoCards ngos={ngos} /> : null}
        {view === 'how-it-works' ? <HowItWorks /> : null}
      </main>
      <Footer onNavigate={go} />
      {selected ? (
        <CampaignDetail
          campaign={selected}
          onClose={() => setSelected(null)}
          onDonate={(c) => {
            setSelected(null);
            setDonateTarget(c);
          }}
        />
      ) : null}
      {donateTarget ? (
        <DonateModal campaign={donateTarget} connection={connection} onClose={() => setDonateTarget(null)} />
      ) : null}
    </div>
  );
}
