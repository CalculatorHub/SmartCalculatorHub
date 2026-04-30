import React, { useState, useEffect } from 'react';
import { Coins, IndianRupee, Percent } from 'lucide-react';

interface PurityOption {
  label: string;
  value: number;
}

const PURITIES: PurityOption[] = [
  { label: '99.9%', value: 1.0 },
  { label: '92.5%', value: 0.925 },
];

export default function SilverCard() {
  const [weight, setWeight] = useState('100');
  const [rate, setRate] = useState('92');
  const [making, setMaking] = useState('8');
  const [purity, setPurity] = useState(PURITIES[0]);

  const [results, setResults] = useState({
    adjustedRate: 0,
    metalValue: 0,
    makingCharges: 0,
    totalPrice: 0
  });

  useEffect(() => {
    const W = parseFloat(weight) || 0;
    const R = parseFloat(rate) || 0;
    const M = parseFloat(making) || 0;
    
    const adjustedRate = R * purity.value;
    const metalValue = W * adjustedRate;
    const makingCharges = (metalValue * M) / 100;
    const total = metalValue + makingCharges;

    setResults({
      adjustedRate,
      metalValue,
      makingCharges,
      totalPrice: total
    });
  }, [weight, rate, making, purity]);

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-md p-5 border border-gray-200 dark:border-white/10 space-y-6" id="silver-valuation-card">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">METALLIC EVALUATION</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-slate-500" />
              Silver Valuation
            </h3>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {PURITIES.map((p) => (
            <button
              key={p.label}
              onClick={() => setPurity(p)}
              className={`h-10 rounded-xl text-xs font-black transition-all ${
                purity.label === p.label 
                  ? 'bg-slate-500 text-white shadow-md' 
                  : 'bg-gray-50 dark:bg-white/10 text-gray-500'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Weight (g)</label>
                <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    autoComplete="off"
                    className="w-full h-10 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-3 text-sm font-bold focus:ring-2 focus:ring-slate-500 outline-none border border-transparent dark:border-white/10"
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Silver Rate (₹)</label>
                <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    autoComplete="off"
                    className="w-full h-10 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-3 text-sm font-bold focus:ring-2 focus:ring-slate-500 outline-none border border-transparent dark:border-white/10"
                />
             </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Making (%)</label>
            <input
                type="number"
                value={making}
                onChange={(e) => setMaking(e.target.value)}
                autoComplete="off"
                className="w-full h-10 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-3 text-sm font-bold focus:ring-2 focus:ring-slate-500 outline-none border border-transparent dark:border-white/10"
            />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-2 text-xs font-bold text-gray-500 dark:text-gray-400 border border-transparent dark:border-white/10">
           <div className="flex justify-between">
              <span>Adj. Rate</span>
              <span className="text-gray-900 dark:text-white">₹{results.adjustedRate.toFixed(2)}/g</span>
           </div>
           <div className="flex justify-between">
              <span>Making Val</span>
              <span className="text-emerald-500">+₹{results.makingCharges.toFixed(2)}</span>
           </div>
           <div className="pt-2 border-t border-gray-200 dark:border-white/10 flex justify-between items-baseline">
              <span className="text-[9px] uppercase tracking-widest text-slate-500">Total Price</span>
              <span className="text-xl font-black text-gray-900 dark:text-white">₹{results.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
           </div>
        </div>

        <button className="w-full h-11 bg-slate-500 hover:bg-slate-600 text-white text-sm font-black rounded-xl transition-all shadow-md active:scale-[0.98]">
           CALCULATE
        </button>
      </div>
    </div>
  );
}
