import Link from "next/link";
import { ArrowLeft, Stethoscope, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import { SITE, INJURY_TYPES, formatCurrency, getSeverityColor } from "../site-config";

export default function InjuryTypesPage() {
    const injuryList = Object.entries(INJURY_TYPES);

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-emerald-500" />
                        <span className="text-lg font-bold text-white">Injury Value Guide</span>
                    </div>
                    <span className="ml-auto text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                        {SITE.year}
                    </span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        {SITE.year} Personal Injury Settlement Values by Type
                    </h1>
                    <p className="text-slate-400">
                        Average settlement amounts for common injury types
                    </p>
                </div>

                {/* Injury Cards */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {injuryList.map(([key, injury]) => (
                        <div
                            key={key}
                            className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-white">
                                    {injury.name}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded ${injury.severity === 'minor' ? 'bg-green-500/20 text-green-400' :
                                        injury.severity === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                                            injury.severity === 'severe' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-red-500/20 text-red-400'
                                    }`}>
                                    {injury.severity.charAt(0).toUpperCase() + injury.severity.slice(1)}
                                </span>
                            </div>

                            <p className="text-sm text-slate-400 mb-4">
                                {injury.description}
                            </p>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Avg Settlement</span>
                                    <span className="font-semibold text-emerald-400">
                                        {formatCurrency(injury.avgSettlement.min)} - {formatCurrency(injury.avgSettlement.max)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Recovery Time</span>
                                    <span className="text-slate-300">{injury.recoveryTime}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Table */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden mb-8">
                    <div className="p-4 border-b border-slate-700">
                        <h2 className="text-lg font-bold text-white">
                            Settlement Values Quick Reference
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-700/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Injury Type</th>
                                    <th className="px-4 py-3 text-center text-slate-300 font-medium">Severity</th>
                                    <th className="px-4 py-3 text-right text-slate-300 font-medium">Min Settlement</th>
                                    <th className="px-4 py-3 text-right text-slate-300 font-medium">Max Settlement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {injuryList.map(([key, injury]) => (
                                    <tr key={key} className="hover:bg-slate-700/30">
                                        <td className="px-4 py-3 text-white">{injury.name}</td>
                                        <td className={`px-4 py-3 text-center ${getSeverityColor(injury.severity)}`}>
                                            {injury.severity.charAt(0).toUpperCase() + injury.severity.slice(1)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-300">
                                            {formatCurrency(injury.avgSettlement.min)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-emerald-400 font-medium">
                                            {formatCurrency(injury.avgSettlement.max)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Factors Section */}
                <section className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
                    <h2 className="text-lg font-bold text-white mb-4">
                        Factors That Affect Your Settlement
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 mt-1" />
                                <div>
                                    <p className="text-white text-sm font-medium">Clear liability</p>
                                    <p className="text-slate-400 text-xs">Other party clearly at fault</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 mt-1" />
                                <div>
                                    <p className="text-white text-sm font-medium">Documented injuries</p>
                                    <p className="text-slate-400 text-xs">Medical records, imaging, reports</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 mt-1" />
                                <div>
                                    <p className="text-white text-sm font-medium">High insurance limits</p>
                                    <p className="text-slate-400 text-xs">More coverage = higher potential</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
                                <div>
                                    <p className="text-white text-sm font-medium">Shared fault</p>
                                    <p className="text-slate-400 text-xs">Reduces settlement proportionally</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
                                <div>
                                    <p className="text-white text-sm font-medium">Pre-existing conditions</p>
                                    <p className="text-slate-400 text-xs">May complicate claims</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
                                <div>
                                    <p className="text-white text-sm font-medium">Low policy limits</p>
                                    <p className="text-slate-400 text-xs">Caps maximum recovery</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ad Placeholder */}
                <div className="my-8 p-6 bg-slate-800 border border-slate-700 rounded-xl text-center">
                    <p className="text-sm text-slate-500">Advertisement</p>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href="/injury-settlement"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Calculate Your Settlement Value
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* Disclaimer */}
                <p className="mt-8 text-xs text-slate-500 text-center">
                    Settlement values are estimates based on {SITE.year} data.
                    Actual settlements vary based on case specifics, jurisdiction, and other factors.
                </p>
            </main>
        </div>
    );
}
