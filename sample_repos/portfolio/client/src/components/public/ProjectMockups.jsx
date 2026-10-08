import React from 'react';

// 1. X-Dash Laptop Mockup (Card 01 - Realistic MacBook with Dashboard UI)
export const XDashLaptopMockup = () => (
  <div className="w-full h-full bg-[#E5DFD7] relative flex items-center justify-center p-3 overflow-hidden select-none">
    {/* Ambient shadow underneath laptop */}
    <div className="absolute bottom-2 w-[72%] h-4 bg-black/25 blur-md rounded-full" />

    {/* Laptop Container */}
    <div className="relative w-[88%] max-w-[340px] flex flex-col items-center z-10">

      {/* Laptop Screen Bezel */}
      <div className="relative w-full aspect-[16/10] bg-[#121214] rounded-t-lg p-1.5 pt-2 shadow-2xl border border-zinc-800 flex flex-col">
        {/* Top Notch Camera */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-[#1C1C1E] rounded-b-sm flex items-center justify-center z-20">
          <div className="w-1 h-1 rounded-full bg-[#050505] ring-1 ring-zinc-700" />
        </div>

        {/* Screen Display Content (Clean Light Dashboard) */}
        <div className="w-full h-full bg-white rounded-sm overflow-hidden flex flex-col p-2 text-[8px] leading-tight">

          {/* Dashboard Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-zinc-900 flex items-center justify-center text-[5px] text-white font-bold">X</div>
              <span className="font-bold text-[7px] text-zinc-800">X-Dash</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 text-[6px]">
              <span className="text-zinc-800 font-semibold">Overview</span>
              <span>Analytics</span>
              <span>Orders</span>
            </div>
            <div className="w-3 h-3 rounded-full bg-zinc-200" />
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-3 gap-1 mb-1.5">
            <div className="bg-[#EDE9FE] p-1 rounded">
              <span className="text-[5px] text-zinc-500 block">Total Balance</span>
              <span className="font-bold text-[8px] text-[#5B21B6]">$1,054.00</span>
            </div>
            <div className="bg-[#FEF3C7] p-1 rounded">
              <span className="text-[5px] text-zinc-500 block">Monthly In</span>
              <span className="font-bold text-[8px] text-[#B45309]">$4,820.50</span>
            </div>
            <div className="bg-[#D1FAE5] p-1 rounded">
              <span className="text-[5px] text-zinc-500 block">Growth</span>
              <span className="font-bold text-[8px] text-[#047857]">+32.4%</span>
            </div>
          </div>

          {/* Chart & Activity Area */}
          <div className="flex-1 grid grid-cols-5 gap-1.5 items-end pt-1">
            {/* Donut Chart / Metric Widget */}
            <div className="col-span-2 flex items-center gap-1 bg-zinc-50 p-1 rounded h-full">
              <div className="w-6 h-6 rounded-full border-2 border-emerald-400 border-t-purple-400 border-r-amber-400 flex items-center justify-center">
                <span className="text-[5px] font-bold text-zinc-700">78%</span>
              </div>
              <div className="flex flex-col text-[5px]">
                <span className="font-semibold text-zinc-700">Sales Goal</span>
                <span className="text-zinc-400">On Track</span>
              </div>
            </div>

            {/* Mini Bar Chart */}
            <div className="col-span-3 flex items-end justify-between h-full bg-zinc-50 p-1 rounded px-2">
              <div className="w-1.5 h-[40%] bg-zinc-200 rounded-t-xs" />
              <div className="w-1.5 h-[65%] bg-zinc-300 rounded-t-xs" />
              <div className="w-1.5 h-[50%] bg-zinc-300 rounded-t-xs" />
              <div className="w-1.5 h-[85%] bg-purple-500 rounded-t-xs" />
              <div className="w-1.5 h-[70%] bg-zinc-300 rounded-t-xs" />
              <div className="w-1.5 h-[95%] bg-emerald-500 rounded-t-xs" />
            </div>
          </div>

        </div>
      </div>

      {/* Laptop Base / Keyboard Deck */}
      <div className="relative w-[114%] h-2 bg-gradient-to-b from-[#2A2A2E] to-[#1C1C1E] rounded-b-md shadow-md flex items-center justify-center">
        {/* Center Display Open Notch */}
        <div className="w-10 h-0.5 bg-[#4A4A50] rounded-b-xs" />
      </div>

    </div>
  </div>
);

// 2. TrioX Laptop Mockup (Card 02 - Creative Digital Reality Showcase on Laptop)
export const TrioXLaptopMockup = () => (
  <div className="w-full h-full bg-[#E5D2B8] relative flex items-center justify-center p-3 overflow-hidden select-none">
    {/* Ambient shadow */}
    <div className="absolute bottom-2 w-[72%] h-4 bg-black/30 blur-md rounded-full" />

    {/* Laptop Container */}
    <div className="relative w-[88%] max-w-[340px] flex flex-col items-center z-10">

      {/* Screen Bezel */}
      <div className="relative w-full aspect-[16/10] bg-[#121214] rounded-t-lg p-1.5 pt-2 shadow-2xl border border-zinc-800 flex flex-col">
        {/* Top Notch */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-[#1C1C1E] rounded-b-sm flex items-center justify-center z-20">
          <div className="w-1 h-1 rounded-full bg-[#050505] ring-1 ring-zinc-700" />
        </div>

        {/* Screen Content: Vibrant Creative 3D Reality Agency */}
        <div className="w-full h-full bg-[#0A0A0E] rounded-sm overflow-hidden flex flex-col justify-between p-2 relative">

          {/* Subtle 3D mesh background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(168,85,247,0.35)_0%,rgba(236,72,153,0.2)_40%,transparent_70%)]" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between text-[7px] text-white/80 border-b border-white/10 pb-1">
            <span className="font-extrabold tracking-wider text-white">TrioX</span>
            <div className="flex gap-2 text-[6px] opacity-70">
              <span>Work</span>
              <span>About</span>
              <span>Contact</span>
            </div>
          </div>

          {/* Central 3D Graphic & Headline */}
          <div className="relative z-10 my-auto text-center flex flex-col items-center">
            {/* Iridescent 3D Ribbon / Sphere */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 via-purple-500 to-indigo-400 shadow-lg shadow-purple-500/50 mb-1 ring-2 ring-white/20 animate-pulse" />
            <span className="text-[6px] uppercase tracking-widest text-purple-300 font-medium">Transforming Ideas Into</span>
            <h4 className="text-[10px] font-extrabold text-white leading-tight tracking-tight mt-0.5">Digital Reality</h4>
          </div>

          {/* Bottom Category Ticker Bar */}
          <div className="relative z-10 bg-white/10 backdrop-blur-xs py-0.5 px-1.5 rounded text-[5px] text-white/90 flex justify-between font-mono">
            <span>UI/UX DESIGN</span>
            <span>·</span>
            <span>3D ANIMATION</span>
            <span>·</span>
            <span>BRANDING</span>
          </div>

        </div>
      </div>

      {/* Laptop Base Deck */}
      <div className="relative w-[114%] h-2 bg-gradient-to-b from-[#2A2A2E] to-[#1C1C1E] rounded-b-md shadow-md flex items-center justify-center">
        <div className="w-10 h-0.5 bg-[#4A4A50] rounded-b-xs" />
      </div>

    </div>
  </div>
);

// 3. CashX Dual Phone Mockup (Card 03 - Two Angled Smartphones with FinTech Analytics)
export const CashXPhoneMockup = () => (
  <div className="w-full h-full bg-[#E8EAE8] relative flex items-center justify-center p-3 overflow-hidden select-none">

    {/* Phone Shadows */}
    <div className="absolute bottom-2 left-6 w-24 h-6 bg-black/20 blur-md rounded-full transform -rotate-12" />
    <div className="absolute bottom-2 right-6 w-28 h-6 bg-black/25 blur-md rounded-full transform rotate-6" />

    {/* Dual Phones Container */}
    <div className="relative w-full max-w-[290px] h-[160px] flex items-center justify-center">

      {/* Left Phone (Slightly behind, angled left, showing transactions) */}
      <div className="absolute left-4 -bottom-3 w-[110px] h-[155px] bg-[#121214] rounded-2xl p-1 shadow-xl transform -rotate-12 border border-zinc-700/60 z-10 flex flex-col">
        {/* Screen */}
        <div className="w-full h-full bg-white rounded-xl p-1.5 overflow-hidden flex flex-col text-[6px]">
          {/* Card Graphic */}
          <div className="w-full h-11 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-lg p-1 text-white flex flex-col justify-between mb-1.5">
            <div className="flex justify-between text-[5px]">
              <span className="font-bold">CashX</span>
              <span>•••• 4821</span>
            </div>
            <span className="text-[7px] font-bold">$1,450.00</span>
          </div>

          {/* Transactions List */}
          <span className="font-bold text-[6px] text-zinc-700 mb-1">Recent</span>
          <div className="flex items-center justify-between border-b border-zinc-100 pb-0.5 mb-1">
            <span className="text-zinc-600">Starbucks</span>
            <span className="font-bold text-zinc-800">-$4.50</span>
          </div>
          <div className="flex items-center justify-between border-b border-zinc-100 pb-0.5">
            <span className="text-zinc-600">Netflix</span>
            <span className="font-bold text-zinc-800">-$12.99</span>
          </div>
        </div>
      </div>

      {/* Right Phone (Prominent, front, angled right, showing Analytics Donut Chart) */}
      <div className="absolute right-4 -bottom-1 w-[122px] h-[165px] bg-[#121214] rounded-2xl p-1 shadow-2xl transform rotate-6 border border-zinc-800 z-20 flex flex-col">
        {/* Dynamic Island */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-black rounded-full z-30" />

        {/* Screen */}
        <div className="w-full h-full bg-white rounded-xl p-2 pt-3 overflow-hidden flex flex-col items-center text-[7px]">

          <div className="w-full flex justify-between items-center text-[6px] text-zinc-500 font-semibold mb-1">
            <span className="text-zinc-950">Analytics</span>
            <span>Cards</span>
          </div>

          <span className="text-[6px] text-zinc-400">Total Spent</span>
          <span className="text-[11px] font-black text-zinc-950 mb-1.5">$2,316.27</span>

          {/* Donut Chart */}
          <div className="relative w-12 h-12 rounded-full border-4 border-teal-500 border-t-amber-400 border-r-rose-400 border-l-emerald-300 flex items-center justify-center mb-1">
            <span className="text-[5px] font-bold text-zinc-600">October</span>
          </div>

          {/* Breakdown tags */}
          <div className="flex gap-1 text-[5px] text-zinc-500">
            <span className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-teal-500" />Food</span>
            <span className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-amber-400" />Bills</span>
          </div>

        </div>
      </div>

    </div>
  </div>
);
