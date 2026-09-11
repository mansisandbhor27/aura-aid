export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <header className="max-w-2xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Midnight Preprod Ready
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
          AuraAid
        </h1>
        <p className="text-lg text-slate-400">
          Privacy-Preserving NGO Donation Transparency Platform powered by Midnight blockchain.
        </p>
      </header>
    </div>
  );
}
