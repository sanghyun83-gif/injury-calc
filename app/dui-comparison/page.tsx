"use client";

import Link from "next/link";
import { ArrowLeft, FileWarning, Info, CheckCircle2, XCircle } from "lucide-react";
import { SITE, STATE_DATA, DUI_COSTS_2025, formatCurrency, getStateCodes } from "../site-config";

export default function DUIComparisonPage() {
    const stateCodes = getStateCodes();
    const insuranceIncrease = DUI_COSTS_2025.averageAnnualPremium * (DUI_COSTS_2025.insuranceIncreasePercent / 100);

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <FileWarning className="w-5 h-5 text-red-500" />
                        <span className="text-lg font-bold text-white">DUI Laws by State</span>
                    </div>
                    <span className="ml-auto text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                        {SITE.year}
                    </span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Title */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {SITE.year} DUI Laws Comparison by State
                    </h1>
                    <p className="text-slate-400">
                        Compare DUI fines, license suspension, and penalties across US states
                    </p>
                </div>

                {/* Main Comparison Table */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden mb-8">
                    <div className="p-4 bg-red-900/30 border-b border-slate-700">
                        <h2 className="text-lg font-semibold text-white">DUI Fines & Penalties (1st Offense)</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-700/50 text-slate-300">
                                    <th className="text-left px-4 py-3 font-medium">State</th>
                                    <th className="text-right px-4 py-3 font-medium">1st Fine</th>
                                    <th className="text-right px-4 py-3 font-medium">2nd Fine</th>
                                    <th className="text-center px-4 py-3 font-medium">License</th>
                                    <th className="text-center px-4 py-3 font-medium">Jail</th>
                                    <th className="text-center px-4 py-3 font-medium">IID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stateCodes.map((code, i) => {
                                    const state = STATE_DATA[code];
                                    return (
                                        <tr key={code} className={`border-b border-slate-700 ${i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}`}>
                                            <td className="px-4 py-3 text-white font-medium">{state.name}</td>
                                            <td className="px-4 py-3 text-right text-red-400">{formatCurrency(state.fineFirst)}</td>
                                            <td className="px-4 py-3 text-right text-red-400">{formatCurrency(state.fineSecond)}</td>
                                            <td className="px-4 py-3 text-center text-slate-300">{state.licenseFirst}</td>
                                            <td className="px-4 py-3 text-center">
                                                {state.mandatoryJail ? (
                                                    <CheckCircle2 className="w-4 h-4 text-red-400 mx-auto" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {state.iidRequired ? (
                                                    <CheckCircle2 className="w-4 h-4 text-amber-400 mx-auto" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Insurance Impact Table */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden mb-8">
                    <div className="p-4 bg-amber-900/30 border-b border-slate-700">
                        <h2 className="text-lg font-semibold text-white">Insurance Impact After DUI</h2>
                    </div>

                    <div className="p-6">
                        <div className="grid md:grid-cols-3 gap-4 text-center mb-6">
                            <div className="bg-slate-700/50 rounded-lg p-4">
                                <p className="text-slate-400 text-sm">Average Increase</p>
                                <p className="text-2xl font-bold text-amber-400">+{DUI_COSTS_2025.insuranceIncreasePercent}%</p>
                            </div>
                            <div className="bg-slate-700/50 rounded-lg p-4">
                                <p className="text-slate-400 text-sm">Annual Extra Cost</p>
                                <p className="text-2xl font-bold text-red-400">{formatCurrency(insuranceIncrease)}/yr</p>
                            </div>
                            <div className="bg-slate-700/50 rounded-lg p-4">
                                <p className="text-slate-400 text-sm">3-Year Total</p>
                                <p className="text-2xl font-bold text-red-400">{formatCurrency(insuranceIncrease * 3)}</p>
                            </div>
                        </div>

                        <p className="text-slate-400 text-sm text-center">
                            Most states require SR-22 insurance for 3 years after a DUI conviction
                        </p>
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 mb-8">
                    <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-red-400" />
                            <span className="text-slate-300">Jail = Mandatory jail time possible</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-amber-400" />
                            <span className="text-slate-300">IID = Ignition Interlock Device required</span>
                        </div>
                    </div>
                </div>

                {/* Ad Placeholder */}
                <div className="my-8 p-6 bg-slate-800 border border-slate-700 rounded-xl text-center">
                    <p className="text-sm text-slate-500">Advertisement</p>
                </div>

                {/* FAQ Section */}
                <section className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-red-500" />
                        About DUI Laws
                    </h2>

                    <div className="space-y-4 text-sm">
                        <div>
                            <h3 className="font-semibold text-white mb-1">
                                Do DUI laws vary by state?
                            </h3>
                            <p className="text-slate-400">
                                Yes, every state has different DUI penalties, fines, and requirements. Some states have mandatory jail time even for first offenses, while others focus on fines and license suspension.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">
                                What is an Ignition Interlock Device (IID)?
                            </h3>
                            <p className="text-slate-400">
                                An IID is a breathalyzer installed in your vehicle that prevents the car from starting if alcohol is detected. Most states now require IIDs for DUI offenders.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">
                                How much does car insurance increase after a DUI?
                            </h3>
                            <p className="text-slate-400">
                                On average, car insurance increases by 80% after a DUI. This can mean an extra $1,400-$2,500 per year for 3-5 years.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="mt-8 text-center">
                    <Link
                        href="/dui-cost"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Calculate Your DUI Cost →
                    </Link>
                </div>

                {/* Disclaimer */}
                <p className="mt-8 text-xs text-slate-500 text-center">
                    This information is for general reference only. DUI laws change frequently.
                    Consult a qualified DUI attorney for advice specific to your state and case.
                </p>
            </main>

            {/* Schema.org */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: [
                            {
                                "@type": "Question",
                                name: "Do DUI laws vary by state?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Yes, every state has different DUI penalties, fines, and requirements.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "How much does car insurance increase after a DUI?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "On average, car insurance increases by 80% after a DUI, about $1,400-$2,500 per year for 3-5 years.",
                                },
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}
