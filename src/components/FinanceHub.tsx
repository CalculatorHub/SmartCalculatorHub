import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Percent, IndianRupee, TrendingUp, Calculator, Tag, ArrowRightLeft, 
  ChevronRight, Info, AlertCircle, Zap, Target, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

/**
 * RATE ↔ RUPEES SMART CONVERTER
 */
const RateConverter = () => {
  const [mode, setMode] = useState<'pctToRs' | 'rsToPct'>('pctToRs');
  const [inputVal, setInputVal] = useState('12');
  const [result, setResult] = useState<{ value: string; unit: string } | null>(null);

  useEffect(() => {
    const val = parseFloat(inputVal);
    if (isNaN(val)) {
      setResult(null);
      return;
    }
    if (mode === 'pctToRs') {
      // 12% = ₹1 => ₹ = (pct / 12)
      const rs = val / 12;
      if (rs < 1) {
        setResult({ value: (rs * 100).toFixed(0), unit: 'Paise' });
      } else {
        setResult({ value: rs.toFixed(2), unit: 'Rupees (₹)' });
      }
    } else {
      // ₹1 = 12% => pct = (rs * 12)
      const pct = val * 12;
      setResult({ value: pct.toFixed(2), unit: 'Percent (%)' });
    }
  }, [inputVal, mode]);

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-md p-5 space-y-4 border border-gray-200 dark:border-white/10 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-blue-500" />
          Smart Converter
        </h3>
        <button 
          onClick={() => {
            setMode(prev => prev === 'pctToRs' ? 'rsToPct' : 'pctToRs');
            setInputVal('');
          }}
          className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800"
        >
          Switch Mode
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {mode === 'pctToRs' ? 'Enter Percentage (%)' : 'Enter Rupees (₹)'}
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-blue-500">
              {mode === 'pctToRs' ? <Percent className="w-4 h-4" /> : <IndianRupee className="w-4 h-4" />}
            </div>
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="0.00"
              autoComplete="off"
              className="w-full h-12 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none border border-transparent dark:border-white/5 transition-all placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              key={result.value + result.unit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex flex-col items-center justify-center gap-1"
            >
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest italic">Converted Value</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                   {mode === 'rsToPct' ? '' : (parseFloat(result.value) >= 1 && result.unit.includes('Rupees') ? '₹' : '')}
                   {result.value}
                </span>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{result.unit}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-start gap-2 px-1">
          <Info className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
          <p className="text-[10px] leading-relaxed text-gray-500 dark:text-gray-400 font-medium">
            Logic: Standard 12% rate per Rupee base calculation is applied.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * INTEREST CALCULATOR & BAR CHART
 */
const InterestCalculator = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(10);
  const [time, setTime] = useState(5);
  const [type, setType] = useState<'SI' | 'CI'>('CI');

  const stats = useMemo(() => {
    const P = principal || 0;
    const R = rate || 0;
    const T = time || 0;
    
    let totalInterest = 0;
    let totalAmount = 0;
    const chartData = [];

    if (type === 'SI') {
      totalInterest = (P * R * T) / 100;
      totalAmount = P + totalInterest;
      
      for (let i = 1; i <= T; i++) {
        chartData.push({
          year: i,
          amount: Math.round(P + (P * R * i) / 100)
        });
      }
    } else {
      totalAmount = P * Math.pow(1 + R / 100, T);
      totalInterest = totalAmount - P;
      
      for (let i = 1; i <= T; i++) {
        chartData.push({
          year: i,
          amount: Math.round(P * Math.pow(1 + R / 100, i))
        });
      }
    }

    return {
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      chartData
    };
  }, [principal, rate, time, type]);

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-md p-5 space-y-6 border border-gray-200 dark:border-white/10 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-500" />
          Interest Stats
        </h3>
        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button 
            onClick={() => setType('SI')}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${type === 'SI' ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-400'}`}
          >
            Simple
          </button>
          <button 
            onClick={() => setType('CI')}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${type === 'CI' ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-400'}`}
          >
            Compound
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Principal (₹)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            autoComplete="off"
            className="w-full h-11 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-4 text-sm font-bold outline-none border border-transparent dark:border-white/10 focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              autoComplete="off"
              className="w-full h-11 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-4 text-sm font-bold outline-none border border-transparent dark:border-white/10 focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Years</label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
              autoComplete="off"
              className="w-full h-11 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-4 text-sm font-bold outline-none border border-transparent dark:border-white/10 focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">Interest</span>
          <span className="text-base font-extrabold text-gray-900 dark:text-white">₹{stats.totalInterest.toLocaleString()}</span>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">Maturity</span>
          <span className="text-base font-extrabold text-gray-900 dark:text-white">₹{stats.totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em]">Growth Projection</h4>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="year" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip 
                cursor={{ fill: '#f8fafc', opacity: 0.1 }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  backgroundColor: '#fff'
                }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {stats.chartData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === stats.chartData.length - 1 ? '#2563eb' : '#3b82f6'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

/**
 * DISCOUNT CALCULATOR
 */
const DiscountCalculator = () => {
  const [price, setPrice] = useState(5000);
  const [discountPct, setDiscountPct] = useState(25);

  const discountAmount = (price * discountPct) / 100;
  const finalPrice = price - discountAmount;

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-md p-5 space-y-4 border border-gray-200 dark:border-white/10 transition-all hover:shadow-lg">
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Discount Saver</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base Price (₹)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            autoComplete="off"
            className="w-full h-11 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none border border-transparent dark:border-white/10"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Discount (%)</label>
          <input
            type="number"
            value={discountPct}
            onChange={(e) => setDiscountPct(Number(e.target.value))}
            autoComplete="off"
            className="w-full h-11 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none border border-transparent dark:border-white/10"
          />
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 font-medium tracking-tight">You Save:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{discountAmount.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-200 font-bold tracking-tight">Final Price:</span>
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">₹{finalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * CALCULATION LOG / STEP TRACKER
 */
export default function FinanceHub() {
  return (
    <div className="space-y-6 pb-28 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500" id="finance-hub-content">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">💰 Finance</h2>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Financial calculators & tools</p>
        <span className="text-[8px] font-bold text-gray-400/50 uppercase tracking-[0.2em] mt-1">CRAFTED BY PATEL VAMSHIDHAR REDDY</span>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">01. Rate Analysis</h3>
            <span className="w-8 h-px bg-gray-200 dark:bg-gray-700 flex-1 mx-4" />
          </div>
          <RateConverter />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">02. Growth Engine</h3>
            <span className="w-8 h-px bg-gray-200 dark:bg-gray-700 flex-1 mx-4" />
          </div>
          <InterestCalculator />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">03. Savings Tool</h3>
            <span className="w-8 h-px bg-gray-200 dark:bg-gray-700 flex-1 mx-4" />
          </div>
          <DiscountCalculator />
        </section>

        <section className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Financial Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="financial-insights">
            {[
              { title: 'Rate Analysis', desc: 'Analyze rate changes and trends.', icon: <Zap className="w-5 h-5 text-blue-500" /> },
              { title: 'Growth Engine', desc: 'Visualize growth over time.', icon: <Target className="w-5 h-5 text-emerald-500" /> },
              { title: 'Savings Tool', desc: 'Calculate and track savings.', icon: <ShieldCheck className="w-5 h-5 text-indigo-500" /> },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow-md border border-gray-200 dark:border-white/10 space-y-3 transition-all hover:shadow-lg group"
              >
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900/50 rounded-xl flex items-center justify-center transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{item.title}</h4>
                  <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="bg-blue-600/10 dark:bg-blue-600/5 p-4 rounded-2xl border border-blue-600/10 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <p className="text-[10px] leading-relaxed text-blue-800 dark:text-blue-300 font-bold uppercase tracking-wider">
          Market rates are updated in real-time. All calculations are approximate and should be verified with your financial advisor.
        </p>
      </div>
    </div>
  );
}
