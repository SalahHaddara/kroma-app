import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

const AnalysisSection = ({ title, items, icon, baseColor, isDark }) => {
    if (!items || items.length === 0) return null;

    return (
        <Card className={`p-6 mb-6 transition-colors duration-300 ${
            isDark
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-white/50 border-slate-200'
        }`}>
            <div className="flex items-center gap-2 mb-4">
                {icon}
                <h2 className={`text-xl font-semibold transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-slate-900'
                }`}>{title}</h2>
                <span className="text-sm px-2 py-1 rounded-full bg-opacity-20"
                      style={{ backgroundColor: `${baseColor}20`, color: baseColor }}>
          {items.length}
        </span>
            </div>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg transition-all hover:scale-[1.01] ${
                            isDark
                                ? 'hover:bg-slate-700/50'
                                : 'hover:bg-slate-50'
                        }`}
                        style={{
                            backgroundColor: isDark
                                ? `${item.colorCode}15`
                                : `${item.colorCode}10`,
                            borderLeft: `4px solid ${item.colorCode}`
                        }}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <h3 className={`font-semibold text-lg mb-2 transition-colors duration-300 ${
                                    isDark ? 'text-white' : 'text-slate-900'
                                }`}>{item.title}</h3>
                                <div className={`text-sm space-y-2 transition-colors duration-300 ${
                                    isDark ? 'text-slate-300' : 'text-slate-600'
                                }`}>
                                    {item.description.split('-').filter(Boolean).map((point, idx) => (
                                        <p key={idx} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.colorCode }}/>
                                            {point.trim()}
                                        </p>
                                    ))}
                                </div>
                                <div className="mt-3">
                  <span
                      className="text-xs px-2 py-1 rounded-full transition-all duration-300"
                      style={{
                          backgroundColor: isDark
                              ? `${item.colorCode}25`
                              : `${item.colorCode}15`,
                          color: item.colorCode
                      }}
                  >
                    {item.category}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const StructuredAnalysisDisplay = ({ analysis, isDark }) => {
    const { critical = [], moderate = [], suggestions = [] } = analysis || {};

    return (
        <div className={`p-6 rounded-xl transition-colors duration-300 ${
            isDark
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 text-slate-900'
        }`}>
            <AnalysisSection
                title="Critical Issues"
                items={critical}
                icon={<AlertCircle size={24} className="text-red-500" />}
                baseColor="#EF4444"
                isDark={isDark}
            />

            <AnalysisSection
                title="Improvements Needed"
                items={moderate}
                icon={<AlertTriangle size={24} className="text-orange-500" />}
                baseColor="#F97316"
                isDark={isDark}
            />

            <AnalysisSection
                title="Suggestions"
                items={suggestions}
                icon={<Info size={24} className="text-yellow-500" />}
                baseColor="#EAB308"
                isDark={isDark}
            />

            {critical.length === 0 && moderate.length === 0 && suggestions.length === 0 && (
                <div className="text-center py-8">
                    <p className={`transition-colors duration-300 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        No analysis results available
                    </p>
                </div>
            )}
        </div>
    );
};

export default StructuredAnalysisDisplay;