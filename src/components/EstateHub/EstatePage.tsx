import React, { useState, useMemo } from 'react';
import DimensionsCard from './DimensionsCard';
import ValuationCard from './ValuationCard';
import EstimationCard from './EstimationCard';
import ConversionCard from './ConversionCard';
import { Landmark } from 'lucide-react';

export default function EstatePage() {
  const [length, setLength] = useState('50');
  const [width, setWidth] = useState('30');
  const [unit, setUnit] = useState<'FEET' | 'METERS'>('FEET');
  const [rate, setRate] = useState('1500');
  const [rateUnit, setRateUnit] = useState('SQ.FT');

  const stats = useMemo(() => {
    const L = parseFloat(length) || 0;
    const W = parseFloat(width) || 0;
    const R = parseFloat(rate) || 0;

    let area = L * W;
    let convertedArea = area;

    // Logic: If inputs are in Meters but rate is in SQ.FT, convert area to SQ.FT for price calculation
    // Or just calculate Area in selected Unit, and if units mismatch, do conversion
    if (unit === 'METERS' && rateUnit === 'SQ.FT') {
        convertedArea = area * 10.7639;
    } else if (unit === 'FEET' && rateUnit === 'SQ.M') {
        convertedArea = area / 10.7639;
    }

    const price = convertedArea * R;

    return {
      area,
      totalPrice: price,
      displayUnit: unit === 'FEET' ? 'SQ.FT' : 'SQ.M'
    };
  }, [length, width, unit, rate, rateUnit]);

  return (
    <div className="space-y-6 pb-28 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500" id="estate-hub">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">🏠 Land</h2>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Real estate calculators</p>
        <span className="text-[8px] font-bold text-gray-400/50 uppercase tracking-[0.2em] mt-1">CRAFTED BY PATEL VAMSHIDHAR REDDY</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DimensionsCard 
            length={length} setLength={setLength}
            width={width} setWidth={setWidth}
            unit={unit} setUnit={setUnit}
          />
          <ValuationCard 
            rate={rate} setRate={setRate}
            rateUnit={rateUnit} setRateUnit={setRateUnit}
            onReset={() => { setLength(''); setWidth(''); setRate(''); }}
          />
        </div>
        <div className="space-y-6">
          <EstimationCard area={stats.area} totalPrice={stats.totalPrice} unit={stats.displayUnit} />
          <ConversionCard />
        </div>
      </div>
    </div>
  );
}
