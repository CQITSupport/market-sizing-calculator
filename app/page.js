'use client';

import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Target, DollarSign, Info, ChevronDown, ChevronUp, Download, Share2 } from 'lucide-react';

export default function MarketSizingCalculator() {
  const [method, setMethod] = useState('bottom-up');
  const [topDownTAM, setTopDownTAM] = useState(50000000000);
  const [numCustomers, setNumCustomers] = useState(5000000);
  const [revenuePerCustomer, setRevenuePerCustomer] = useState(1200);
  const [geographicReach, setGeographicReach] = useState(25);
  const [targetSegmentFit, setTargetSegmentFit] = useState(60);
  const [regulatoryAccess, setRegulatoryAccess] = useState(100);
  const [marketShare, setMarketShare] = useState(5);
  const [yearsToAchieve, setYearsToAchieve] = useState(5);
  const [growthRate, setGrowthRate] = useState(12);
  const [showBenchmarks, setShowBenchmarks] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const calculations = useMemo(() => {
    const tam = method === 'top-down' ? topDownTAM : numCustomers * revenuePerCustomer;
    const tamToSamRate = (geographicReach / 100) * (targetSegmentFit / 100) * (regulatoryAccess / 100);
    const sam = tam * tamToSamRate;
    const som = sam * (marketShare / 100);

    const projections = [];
    for (let year = 0; year <= 5; year++) {
      const factor = Math.pow(1 + growthRate / 100, year);
      projections.push({
        year,
        tam: tam * factor,
        sam: sam * factor,
        som: som * factor,
      });
    }

    return { tam, sam, som, tamToSamRate, projections };
  }, [method, topDownTAM, numCustomers, revenuePerCustomer, geographicReach, targetSegmentFit, regulatoryAccess, marketShare, growthRate]);

  const formatCurrency = (value) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatFullCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;

  const copyToClipboard = () => {
    const text = `Market Sizing Analysis
━━━━━━━━━━━━━━━━━━━━━━
TAM: ${formatFullCurrency(calculations.tam)}
SAM: ${formatFullCurrency(calculations.sam)} (${formatPercent(calculations.tamToSamRate)} of TAM)
SOM: ${formatFullCurrency(calculations.som)} (${marketShare}% market share)

5-Year Projection (${growthRate}% CAGR):
TAM: ${formatFullCurrency(calculations.projections[5].tam)}
SOM: ${formatFullCurrency(calculations.projections[5].som)}

Assumptions:
- Method: ${method === 'top-down' ? 'Top-Down' : 'Bottom-Up'}
${method === 'bottom-up' ? `- Customers: ${numCustomers.toLocaleString()}\n- Revenue/Customer: ${formatFullCurrency(revenuePerCustomer)}` : `- Industry Size: ${formatFullCurrency(topDownTAM)}`}
- Geographic Reach: ${geographicReach}%
- Target Segment Fit: ${targetSegmentFit}%
- Expected Market Share: ${marketShare}%`;
    
    navigator.clipboard.writeText(text);
    alert('Results copied to clipboard!');
  };

  const InputField = ({ label, value, onChange, prefix = '', suffix = '', hint = '', min = 0, max, step = 1 }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-2.5 text-gray-500 text-sm">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-12' : ''}`}
        />
        {suffix && <span className="absolute right-3 top-2.5 text-gray-500 text-sm">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );

  const ResultCard = ({ title, value, subtitle, color, icon: Icon }) => (
    <div className={`p-5 rounded-xl ${color} border transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon size={16} className="opacity-60" />}
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </div>
      <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(value)}</p>
      <p className="text-sm text-gray-500 mt-1">{formatFullCurrency(value)}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Calculator size={16} />
            Free Market Sizing Tool
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">TAM / SAM / SOM Calculator</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Calculate your Total Addressable, Serviceable Available, and Serviceable Obtainable Markets for investor-ready market sizing.
          </p>
        </div>

        {/* Results Summary */}
        <div className="grid gap-4 mb-6">
          <ResultCard 
            title="Total Addressable Market (TAM)" 
            value={calculations.tam} 
            subtitle="The entire market demand if you achieved 100% market share" 
            color="bg-blue-50 border-blue-200"
            icon={Target}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard 
              title="Serviceable Available Market (SAM)" 
              value={calculations.sam} 
              subtitle={`${formatPercent(calculations.tamToSamRate)} of TAM — your reachable market`} 
              color="bg-emerald-50 border-emerald-200"
              icon={DollarSign}
            />
            <ResultCard 
              title="Serviceable Obtainable Market (SOM)" 
              value={calculations.som} 
              subtitle={`${marketShare}% market share over ${yearsToAchieve} years`} 
              color="bg-amber-50 border-amber-200"
              icon={TrendingUp}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={copyToClipboard}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <Share2 size={16} />
            Copy Results
          </button>
        </div>

        {/* TAM Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Target className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold">1. Total Addressable Market (TAM)</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">The total market demand for your product or service</p>
          
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setMethod('bottom-up')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                method === 'bottom-up' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bottom-Up
              <span className="block text-xs opacity-75 mt-0.5">Customer × Revenue</span>
            </button>
            <button
              onClick={() => setMethod('top-down')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                method === 'top-down' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Top-Down
              <span className="block text-xs opacity-75 mt-0.5">Market Research</span>
            </button>
          </div>

          {method === 'top-down' ? (
            <InputField
              label="Total Industry Market Size"
              value={topDownTAM}
              onChange={setTopDownTAM}
              prefix="$"
              hint="Use data from industry reports like Gartner, IDC, Statista, or Grand View Research"
              step={1000000000}
            />
          ) : (
            <>
              <InputField
                label="Number of Potential Customers"
                value={numCustomers}
                onChange={setNumCustomers}
                hint="Total number of potential customers who could use your product globally"
                step={100000}
              />
              <InputField
                label="Average Annual Revenue per Customer"
                value={revenuePerCustomer}
                onChange={setRevenuePerCustomer}
                prefix="$"
                hint="Expected yearly spend per customer (ACV for B2B, annual spend for B2C)"
                step={100}
              />
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <strong>Bottom-Up TAM:</strong> {numCustomers.toLocaleString()} customers × {formatFullCurrency(revenuePerCustomer)} = {formatFullCurrency(calculations.tam)}
              </div>
            </>
          )}
        </div>

        {/* SAM Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="text-emerald-600" size={20} />
            <h2 className="text-lg font-semibold">2. Serviceable Available Market (SAM)</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">The portion of TAM you can realistically serve given constraints</p>
          
          <InputField
            label="Geographic Reach"
            value={geographicReach}
            onChange={setGeographicReach}
            suffix="%"
            hint="What percentage of the global market can you physically or digitally serve? (e.g., US only = ~25%)"
            max={100}
          />
          <InputField
            label="Target Segment Fit"
            value={targetSegmentFit}
            onChange={setTargetSegmentFit}
            suffix="%"
            hint="What percentage of your geographic market matches your ideal customer profile?"
            max={100}
          />
          <InputField
            label="Regulatory/Technical Accessibility"
            value={regulatoryAccess}
            onChange={setRegulatoryAccess}
            suffix="%"
            hint="Discount for regulatory barriers, technical requirements, or other access limitations"
            max={100}
          />
          
          <div className="bg-emerald-50 rounded-lg p-3 text-sm text-emerald-800">
            <strong>TAM → SAM Conversion:</strong> {geographicReach}% × {targetSegmentFit}% × {regulatoryAccess}% = {formatPercent(calculations.tamToSamRate)}
          </div>
        </div>

        {/* SOM Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="text-amber-600" size={20} />
            <h2 className="text-lg font-semibold">3. Serviceable Obtainable Market (SOM)</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">What you can realistically capture given competition and execution</p>
          
          <InputField
            label="Expected Market Share"
            value={marketShare}
            onChange={setMarketShare}
            suffix="%"
            hint="Be conservative — new entrants typically achieve 3-10% in competitive markets"
            max={100}
          />
          <InputField
            label="Time to Achieve"
            value={yearsToAchieve}
            onChange={setYearsToAchieve}
            suffix="years"
            hint="Timeline to reach your target market share (typically 3-5 years for seed/Series A)"
            max={20}
          />
          
          <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">
            <strong>Your SOM:</strong> {formatFullCurrency(calculations.sam)} × {marketShare}% = {formatFullCurrency(calculations.som)}
          </div>
        </div>

        {/* Growth Projections */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="text-purple-600" size={20} />
            <h2 className="text-lg font-semibold">4. Market Growth Projections</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">5-year forecast based on expected market growth</p>
          
          <InputField
            label="Annual Market Growth Rate (CAGR)"
            value={growthRate}
            onChange={setGrowthRate}
            suffix="%"
            hint="Expected yearly market growth rate — check industry reports for benchmarks"
            max={100}
          />

          <div className="overflow-x-auto mt-4 -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 rounded-l-lg">Year</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">TAM</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">SAM</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 rounded-r-lg">SOM</th>
                </tr>
              </thead>
              <tbody>
                {calculations.projections.map((row, idx) => (
                  <tr key={row.year} className={`border-t border-gray-100 ${idx === 5 ? 'bg-purple-50 font-semibold' : ''}`}>
                    <td className="px-4 py-3 font-medium">{row.year === 0 ? 'Today' : `Year ${row.year}`}</td>
                    <td className="px-4 py-3 text-right text-blue-600">{formatCurrency(row.tam)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600">{formatCurrency(row.sam)}</td>
                    <td className="px-4 py-3 text-right text-amber-600">{formatCurrency(row.som)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 bg-purple-50 rounded-lg p-3 text-sm text-purple-800">
            <strong>5-Year Growth:</strong> TAM grows from {formatCurrency(calculations.tam)} to {formatCurrency(calculations.projections[5].tam)} ({((calculations.projections[5].tam / calculations.tam - 1) * 100).toFixed(0)}% total growth)
          </div>
        </div>

        {/* Industry Benchmarks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <button
            onClick={() => setShowBenchmarks(!showBenchmarks)}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="text-gray-600" size={20} />
              <h2 className="text-lg font-semibold">Industry Benchmarks & Fundraising Guide</h2>
            </div>
            {showBenchmarks ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {showBenchmarks && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Typical Conversion Rates by Industry</h3>
                <div className="grid gap-2 text-sm">
                  {[
                    { industry: 'B2B SaaS', tamSam: '15%', samSom: '3%', note: 'Enterprise has smaller segments' },
                    { industry: 'B2C / Consumer', tamSam: '25%', samSom: '1-2%', note: 'Broad appeal, high competition' },
                    { industry: 'Marketplace / Platform', tamSam: '20%', samSom: '5-10%', note: 'Network effects help at scale' },
                    { industry: 'Healthcare / Pharma', tamSam: '10%', samSom: '2%', note: 'Regulatory constraints' },
                    { industry: 'Fintech', tamSam: '15%', samSom: '3%', note: 'Compliance requirements' },
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                      <div>
                        <span className="font-medium text-gray-900">{row.industry}</span>
                        <span className="text-gray-500 text-xs ml-2">({row.note})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-600">TAM→SAM: {row.tamSam}</span>
                        <span className="text-gray-300 mx-2">|</span>
                        <span className="text-amber-600">SAM→SOM: {row.samSom}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Fundraising Expectations by Stage</h3>
                <div className="grid gap-2 text-sm">
                  {[
                    { stage: 'Pre-Seed', tam: '$100M+', som: '$500K-$2M', time: '2-3 years' },
                    { stage: 'Seed', tam: '$500M+', som: '$1M-$10M', time: '3 years' },
                    { stage: 'Series A', tam: '$1B+', som: '$10M-$50M', time: '5 years' },
                    { stage: 'Series B', tam: '$5B+', som: '$50M-$200M', time: '5-7 years' },
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-900">{row.stage}</span>
                      <div className="text-right">
                        <span className="text-blue-600">TAM: {row.tam}</span>
                        <span className="text-gray-300 mx-2">|</span>
                        <span className="text-amber-600">SOM: {row.som}</span>
                        <span className="text-gray-300 mx-2">|</span>
                        <span className="text-gray-500">{row.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-red-50 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">Common Mistakes to Avoid</h3>
                <ul className="text-sm text-red-800 space-y-1.5">
                  <li>❌ Using global TAM for regional products (inflates by 70-80%)</li>
                  <li>❌ Projecting {">"} 30% market share in established markets</li>
                  <li>❌ Ignoring regulatory or technical barriers</li>
                  <li>❌ Using outdated market research (update annually)</li>
                  <li>❌ Confusing addressable market with total industry size</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calculator className="text-gray-600" size={20} />
              <h2 className="text-lg font-semibold">How to Use This Calculator</h2>
            </div>
            {showTips ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {showTips && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="mt-4 space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900">1. Choose Your TAM Method</h4>
                  <p><strong>Bottom-Up</strong> (recommended): More credible, based on your specific customer count and pricing. Best for new/niche markets.</p>
                  <p><strong>Top-Down:</strong> Uses existing market research. Best when reliable industry reports exist.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">2. Be Realistic with SAM</h4>
                  <p>Don't use global TAM unless you can truly serve globally from day one. Consider geographic, regulatory, and technical constraints.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">3. Stay Conservative on SOM</h4>
                  <p>New entrants rarely exceed 5-10% market share. VCs are skeptical of aggressive projections.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">4. Validate Both Ways</h4>
                  <p>If using top-down, sanity-check with bottom-up calculations. If they differ wildly, investigate why.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-8">
          <p>Built for founders, by founders. No data is stored or shared.</p>
          <p className="mt-2">
            <span className="text-blue-600">Blue inputs</span> are editable • Results update automatically
          </p>
        </footer>
      </div>
    </div>
  );
}
