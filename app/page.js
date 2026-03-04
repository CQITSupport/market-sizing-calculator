'use client';

import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Target, DollarSign, Info, ChevronDown, ChevronUp, Plus, Trash2, Share2, Download } from 'lucide-react';

export default function MarketSizingCalculator() {
  const [segments, setSegments] = useState([
    { id: 1, name: 'Segment 1', customers: 1000000, revenuePerCustomer: 1200, samPercent: 60 },
  ]);
  const [geographicReach, setGeographicReach] = useState(25);
  const [geographicNotes, setGeographicNotes] = useState('');
  const [regulatoryAccess, setRegulatoryAccess] = useState(100);
  const [marketShare, setMarketShare] = useState(5);
  const [yearsToAchieve, setYearsToAchieve] = useState(5);
  const [growthRate, setGrowthRate] = useState(12);
  const [showBenchmarks, setShowBenchmarks] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const addSegment = () => {
    const newId = Math.max(...segments.map(s => s.id), 0) + 1;
    setSegments([...segments, { 
      id: newId, 
      name: `Segment ${newId}`, 
      customers: 100000, 
      revenuePerCustomer: 1000,
      samPercent: 50
    }]);
  };

  const removeSegment = (id) => {
    if (segments.length > 1) {
      setSegments(segments.filter(s => s.id !== id));
    }
  };

  const updateSegment = (id, field, value) => {
    setSegments(segments.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const calculations = useMemo(() => {
    // TAM: Sum of all segments
    const segmentTAMs = segments.map(s => ({
      ...s,
      tam: s.customers * s.revenuePerCustomer
    }));
    const tam = segmentTAMs.reduce((sum, s) => sum + s.tam, 0);
    
    // SAM: Apply geographic reach, then per-segment target fit, then regulatory
    const segmentSAMs = segmentTAMs.map(s => ({
      ...s,
      samBeforeRegulatory: s.tam * (geographicReach / 100) * (s.samPercent / 100),
      sam: s.tam * (geographicReach / 100) * (s.samPercent / 100) * (regulatoryAccess / 100)
    }));
    const sam = segmentSAMs.reduce((sum, s) => sum + s.sam, 0);
    
    const tamToSamRate = tam > 0 ? sam / tam : 0;
    
    // SOM
    const som = sam * (marketShare / 100);

    // Projections
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

    return { tam, sam, som, tamToSamRate, projections, segmentTAMs, segmentSAMs };
  }, [segments, geographicReach, regulatoryAccess, marketShare, growthRate]);

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
    const segmentDetails = segments.map(s => {
      const segData = calculations.segmentTAMs.find(st => st.id === s.id);
      return `  - ${s.name}: ${s.customers.toLocaleString()} customers × ${formatFullCurrency(s.revenuePerCustomer)} = ${formatFullCurrency(segData?.tam || 0)}`;
    }).join('\n');

    const samSegmentDetails = calculations.segmentSAMs.map(s => {
      return `  - ${s.name}: ${s.samPercent}% target fit → ${formatFullCurrency(s.sam)}`;
    }).join('\n');

    const text = `Market Sizing Analysis
━━━━━━━━━━━━━━━━━━━━━━
TAM: ${formatFullCurrency(calculations.tam)}
SAM: ${formatFullCurrency(calculations.sam)} (${formatPercent(calculations.tamToSamRate)} of TAM)
SOM: ${formatFullCurrency(calculations.som)} (${marketShare}% market share)

TAM by Segment:
${segmentDetails}

SAM by Segment:
${samSegmentDetails}

Geographic Reach: ${geographicReach}%
${geographicNotes ? `Geographic Notes: ${geographicNotes}` : ''}

5-Year Projection (${growthRate}% CAGR):
TAM: ${formatFullCurrency(calculations.projections[5].tam)}
SOM: ${formatFullCurrency(calculations.projections[5].som)}`;
    
    navigator.clipboard.writeText(text);
    alert('Results copied to clipboard!');
  };

  const generatePDF = async () => {
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;
    
    // Load and add logo
    try {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
        logoImg.src = '/logo.png';
      });
      
      // Calculate logo dimensions (maintain aspect ratio, max height 20)
      const maxHeight = 20;
      const ratio = logoImg.width / logoImg.height;
      const logoHeight = maxHeight;
      const logoWidth = logoHeight * ratio;
      
      doc.addImage(logoImg, 'PNG', (pageWidth - logoWidth) / 2, y, logoWidth, logoHeight);
      y += logoHeight + 10;
    } catch (e) {
      console.log('Logo not loaded, continuing without it');
    }
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(30, 58, 95);
    doc.text('Market Sizing Analysis', pageWidth / 2, y, { align: 'center' });
    y += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: 'center' });
    y += 15;
    
    // Summary boxes
    doc.setFillColor(239, 246, 255);
    doc.rect(14, y, 55, 25, 'F');
    doc.setFillColor(236, 253, 245);
    doc.rect(77, y, 55, 25, 'F');
    doc.setFillColor(255, 251, 235);
    doc.rect(140, y, 55, 25, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('TAM', 41, y + 7, { align: 'center' });
    doc.text('SAM', 104, y + 7, { align: 'center' });
    doc.text('SOM', 167, y + 7, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 95);
    doc.text(formatCurrency(calculations.tam), 41, y + 18, { align: 'center' });
    doc.setTextColor(5, 150, 105);
    doc.text(formatCurrency(calculations.sam), 104, y + 18, { align: 'center' });
    doc.setTextColor(217, 119, 6);
    doc.text(formatCurrency(calculations.som), 167, y + 18, { align: 'center' });
    
    y += 35;
    
    // TAM by Segment
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 95);
    doc.text('TAM by Segment', 14, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    calculations.segmentTAMs.forEach(s => {
      const percentage = ((s.tam / calculations.tam) * 100).toFixed(1);
      doc.text(`${s.name}: ${s.customers.toLocaleString()} customers × ${formatFullCurrency(s.revenuePerCustomer)} = ${formatCurrency(s.tam)} (${percentage}%)`, 14, y);
      y += 6;
    });
    
    y += 5;
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 95);
    doc.text(`Total TAM: ${formatFullCurrency(calculations.tam)}`, 14, y);
    y += 12;
    
    // SAM Details
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 95);
    doc.text('SAM Calculation', 14, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    doc.text(`Geographic Reach: ${geographicReach}%`, 14, y);
    y += 6;
    
    if (geographicNotes) {
      const splitNotes = doc.splitTextToSize(`Geographic Notes: ${geographicNotes}`, pageWidth - 28);
      doc.text(splitNotes, 14, y);
      y += splitNotes.length * 5 + 3;
    }
    
    doc.text(`Constraints: ${regulatoryAccess}% (${100 - regulatoryAccess}% of market inaccessible)`, 14, y);
    y += 8;
    
    doc.text('Target Segment Fit:', 14, y);
    y += 6;
    calculations.segmentSAMs.forEach(s => {
      doc.text(`  ${s.name}: ${s.samPercent}% fit → ${formatCurrency(s.sam)}`, 14, y);
      y += 6;
    });
    
    y += 3;
    doc.setFontSize(11);
    doc.setTextColor(5, 150, 105);
    doc.text(`Total SAM: ${formatFullCurrency(calculations.sam)} (${formatPercent(calculations.tamToSamRate)} of TAM)`, 14, y);
    y += 12;
    
    // SOM
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 95);
    doc.text('SOM Calculation', 14, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    doc.text(`Expected Market Share: ${marketShare}%`, 14, y);
    y += 6;
    doc.text(`Time to Achieve: ${yearsToAchieve} years`, 14, y);
    y += 6;
    
    doc.setFontSize(11);
    doc.setTextColor(217, 119, 6);
    doc.text(`Total SOM: ${formatFullCurrency(calculations.som)}`, 14, y);
    y += 15;
    
    // Growth Projections
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 95);
    doc.text(`5-Year Growth Projections (${growthRate}% CAGR)`, 14, y);
    y += 8;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Year', 20, y);
    doc.text('TAM', 60, y);
    doc.text('SAM', 110, y);
    doc.text('SOM', 160, y);
    y += 2;
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, y, pageWidth - 14, y);
    y += 5;
    
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    calculations.projections.forEach(row => {
      const yearLabel = row.year === 0 ? 'Today' : `Year ${row.year}`;
      doc.text(yearLabel, 20, y);
      doc.text(formatCurrency(row.tam), 60, y);
      doc.text(formatCurrency(row.sam), 110, y);
      doc.text(formatCurrency(row.som), 160, y);
      y += 6;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by CQuence Health Market Sizing Tool', pageWidth / 2, 285, { align: 'center' });
    
    doc.save('market-sizing-analysis.pdf');
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
          <img 
            src="/logo.png" 
            alt="CQuence Health" 
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-[#065399] to-[#0da4dd] bg-clip-text text-transparent">
              Market Sizing Tool
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#0da4dd]"></div>
            <span className="text-[#065399] text-sm font-medium">TAM • SAM • SOM</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#0da4dd]"></div>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Build your market sizing, segment by segment.
          </p>
        </div>

        {/* Results Summary */}
        <div className="grid gap-4 mb-6">
          <ResultCard 
            title="Total Addressable Market (TAM)" 
            value={calculations.tam} 
            subtitle={`${segments.length} segment${segments.length > 1 ? 's' : ''} combined`}
            color="bg-blue-50 border-blue-200"
            icon={Target}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard 
              title="Serviceable Available Market (SAM)" 
              value={calculations.sam} 
              subtitle={`${formatPercent(calculations.tamToSamRate)} of TAM`} 
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
            onClick={generatePDF}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            Download PDF
          </button>
          <button
            onClick={copyToClipboard}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <Share2 size={16} />
            Copy Results
          </button>
        </div>

        {/* TAM Section - Segments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Target className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold">1. Total Addressable Market (TAM)</h2>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">Build your TAM by defining customer segments (e.g., hospitals, specialty clinics, retail pharmacies)</p>
          
          {/* Segments */}
          <div className="space-y-4">
            {segments.map((segment, index) => {
              const segmentTAM = calculations.segmentTAMs.find(s => s.id === segment.id);
              return (
                <div key={segment.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      value={segment.name}
                      onChange={(e) => updateSegment(segment.id, 'name', e.target.value)}
                      className="font-medium text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                      placeholder="Segment name"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-blue-600">
                        {formatCurrency(segmentTAM?.tam || 0)}
                      </span>
                      {segments.length > 1 && (
                        <button
                          onClick={() => removeSegment(segment.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Potential Customers</label>
                      <input
                        type="number"
                        value={segment.customers}
                        onChange={(e) => updateSegment(segment.id, 'customers', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min={0}
                        step={1000}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Avg Revenue per Customer</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={segment.revenuePerCustomer}
                          onChange={(e) => updateSegment(segment.id, 'revenuePerCustomer', Number(e.target.value))}
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min={0}
                          step={100}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={addSegment}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <Plus size={20} />
            Add Segment
          </button>

          {/* TAM Summary */}
          <div className="mt-4 bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Total TAM</span>
              <span className="text-xl font-bold text-blue-600">{formatCurrency(calculations.tam)}</span>
            </div>
            <div className="space-y-1">
              {calculations.segmentTAMs.map(s => (
                <div key={s.id} className="flex justify-between text-sm text-gray-600">
                  <span>{s.name}</span>
                  <span>{formatCurrency(s.tam)} ({((s.tam / calculations.tam) * 100).toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SAM Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="text-emerald-600" size={20} />
            <h2 className="text-lg font-semibold">2. Serviceable Available Market (SAM)</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Filter your TAM to what you can realistically serve</p>
          
          {/* Geographic Reach */}
          <div className="mb-6">
            <InputField
              label="Geographic Reach"
              value={geographicReach}
              onChange={setGeographicReach}
              suffix="%"
              hint="What percentage of the global market can you physically or digitally serve?"
              max={100}
            />
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geographic Reach Notes
                <span className="font-normal text-gray-500 ml-1">(Describe your specific geographic scope)</span>
              </label>
              <textarea
                value={geographicNotes}
                onChange={(e) => setGeographicNotes(e.target.value)}
                placeholder="Example: Initially targeting US market only - focusing on Northeast and West Coast regions. Key states: CA, NY, MA, WA, TX. Expansion to Canada and UK planned for Year 3..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Per-Segment Target Fit */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target Segment Fit
              <span className="font-normal text-gray-500 ml-1">(What % of each segment can you serve?)</span>
            </label>
            <div className="space-y-3">
              {segments.map(segment => {
                const segmentSAM = calculations.segmentSAMs.find(s => s.id === segment.id);
                return (
                  <div key={segment.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{segment.name}</span>
                      <span className="text-sm text-emerald-600 font-medium">
                        SAM: {formatCurrency(segmentSAM?.sam || 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={segment.samPercent}
                        onChange={(e) => updateSegment(segment.id, 'samPercent', Number(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <div className="relative w-20">
                        <input
                          type="number"
                          value={segment.samPercent}
                          onChange={(e) => updateSegment(segment.id, 'samPercent', Math.min(100, Math.max(0, Number(e.target.value))))}
                          className="w-full px-2 py-1 text-right border border-gray-300 rounded-lg text-sm"
                          min={0}
                          max={100}
                        />
                        <span className="absolute right-2 top-1 text-gray-400 text-sm">%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatCurrency(segmentSAM?.tam || 0)} TAM × {geographicReach}% geo × {segment.samPercent}% fit × {regulatoryAccess}% constraints
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Constraints</label>
            <p className="text-xs text-gray-500 mb-2">
              This percentage represents additional limitations that reduce your serviceable market — such as regulatory requirements, technical integrations, compliance certifications, or other barriers. 100% means no constraints; 80% means 20% of your market is inaccessible due to these factors.
            </p>
            <div className="relative">
              <input
                type="number"
                value={regulatoryAccess}
                onChange={(e) => setRegulatoryAccess(Number(e.target.value))}
                min={0}
                max={100}
                step={1}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12"
              />
              <span className="absolute right-3 top-2.5 text-gray-500 text-sm">%</span>
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Total SAM</span>
              <span className="text-xl font-bold text-emerald-600">{formatCurrency(calculations.sam)}</span>
            </div>
            <p className="text-sm text-gray-600">
              {formatPercent(calculations.tamToSamRate)} of TAM ({formatCurrency(calculations.tam)})
            </p>
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
                  <li>❌ Not validating segment sizes with bottom-up calculations</li>
                  <li>❌ Underestimating the impact of a customer "doing nothing" with regards to adopting a (new) solution</li>
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
                  <h4 className="font-semibold text-gray-900">1. Build Your TAM by Segment</h4>
                  <p>Think about distinct customer groups who would use your product differently. For healthcare: hospitals, specialty clinics, retail pharmacies. For B2B SaaS: enterprise, mid-market, SMB. Each segment has different customer counts and willingness to pay.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">2. Be Specific About Geographic Reach</h4>
                  <p>Don't just enter a percentage — document exactly which regions, countries, or states you're targeting and why. This forces realistic thinking and helps communicate your strategy to investors.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">3. Set Target Fit Per Segment</h4>
                  <p>You may have strong fit with hospitals (80%) but weaker fit with retail pharmacies (30%). Be honest about where your product truly solves a problem vs. where it's a stretch.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">4. Stay Conservative on SOM</h4>
                  <p>New entrants rarely exceed 5-10% market share. Investors are skeptical of aggressive projections — it often can lead to overconfidence in adoption within a complex business system.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-8">
          <p>© CQuence Health. No data is stored or shared.</p>
          <p className="mt-2">
            Results update automatically as you edit
          </p>
        </footer>
      </div>
    </div>
  );
}
