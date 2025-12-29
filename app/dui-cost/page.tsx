"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Scale, Calculator, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
    SITE,
    STATE_DATA,
    calculateDUICost,
    formatCurrency,
    getStateCodes,
    DUICalculationResult,
} from "../site-config";

export default function DUICostPage() {
    const [state, setState] = useState("");
    const [offense, setOffense] = useState<"first" | "second" | "third">("first");
    const [bac, setBAC] = useState("0.08");
    const [accident, setAccident] = useState(false);
    const [result, setResult] = useState<DUICalculationResult | null>(null);

    const handleCalculate = () => {
        if (state) {
            const bacValue = parseFloat(bac) || 0.08;
            setResult(calculateDUICost(state, offense, bacValue, accident));
        }
    };

    const stateCodes = getStateCodes();

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-red-500" />
                        <span className="text-lg font-bold text-white">DUI Cost Calculator</span>
                    </div>
                    <span className="ml-auto text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                        {SITE.year}
                    </span>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Calculator Card */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <h1 className="text-xl font-bold text-white mb-2">
                        Free {SITE.year} DUI Cost Calculator
                    </h1>
                    <p className="text-sm text-slate-400 mb-6">
                        Calculate the total cost of a DUI charge in your state
                    </p>

                    {/* Inputs */}
                    <div className="space-y-4 mb-6">
                        {/* State Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Select Your State
                            </label>
                            <select
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="">-- Select State --</option>
                                {stateCodes.map((code) => (
                                    <option key={code} value={code}>
                                        {STATE_DATA[code].name}
                                    </option>
                                ))}
                                <option value="OTHER">Other State</option>
                            </select>
                        </div>

                        {/* Offense Type */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Offense Type
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: "first", label: "1st Offense" },
                                    { value: "second", label: "2nd Offense" },
                                    { value: "third", label: "3rd+ Offense" },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setOffense(opt.value as "first" | "second" | "third")}
                                        className={`py-3 px-4 rounded-lg border font-medium transition ${offense === opt.value
                                                ? "bg-red-600 text-white border-red-600"
                                                : "bg-slate-700 text-slate-300 border-slate-600 hover:border-red-500"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* BAC Level */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Blood Alcohol Content (BAC)
                            </label>
                            <select
                                value={bac}
                                onChange={(e) => setBAC(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                            >
                                <option value="0.08">0.08 - 0.09 (Standard DUI)</option>
                                <option value="0.10">0.10 - 0.14 (Higher BAC)</option>
                                <option value="0.15">0.15+ (Aggravated DUI)</option>
                            </select>
                            <p className="text-xs text-slate-500 mt-1">
                                Higher BAC = harsher penalties and higher costs
                            </p>
                        </div>

                        {/* Accident Toggle */}
                        <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg">
                            <input
                                type="checkbox"
                                id="accident"
                                checked={accident}
                                onChange={(e) => setAccident(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-500 text-red-600 focus:ring-red-500 bg-slate-600"
                            />
                            <label htmlFor="accident" className="text-slate-300">
                                Accident or property damage involved
                            </label>
                        </div>
                    </div>

                    {/* Calculate Button */}
                    <button
                        onClick={handleCalculate}
                        disabled={!state}
                        className="w-full py-4 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        <Calculator className="w-5 h-5" />
                        Calculate DUI Cost
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div className="mt-6 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                        {/* Summary Header */}
                        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6">
                            <p className="text-sm text-red-200 mb-1">Estimated Total DUI Cost</p>
                            <p className="text-4xl font-bold">{formatCurrency(result.totalAverage)}</p>
                            <p className="text-sm text-red-200 mt-2">
                                Range: {formatCurrency(result.totalMinimum)} - {formatCurrency(result.totalMaximum)}
                            </p>
                        </div>

                        {/* Key Info */}
                        <div className="p-4 bg-amber-900/30 border-b border-amber-700/50">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                <div className="text-sm">
                                    <span className="text-amber-200 font-medium">License Suspension: </span>
                                    <span className="text-amber-300">{result.licenseSuspension}</span>
                                    {result.mandatoryJail && (
                                        <span className="ml-3 text-red-400">• Jail time possible</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="p-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                Cost Breakdown
                            </h3>

                            <div className="space-y-3 text-sm">
                                {[
                                    { label: "Lawyer Fees", value: result.lawyerFees, desc: "Defense attorney" },
                                    { label: "Court Fines", value: result.fines, desc: "State penalties" },
                                    { label: "Insurance Increase", value: result.insuranceIncrease, desc: "3-year impact" },
                                    { label: "DUI Programs", value: result.duiPrograms, desc: "Classes & treatment" },
                                    { label: "Ignition Interlock", value: result.iidCosts, desc: "Device & monthly fees" },
                                    { label: "License & DMV", value: result.licenseRelated, desc: "Reinstatement & SR-22" },
                                    { label: "Court Fees", value: result.courtFees, desc: "Filing & processing" },
                                    { label: "Towing & Impound", value: result.towingImpound, desc: "Vehicle storage" },
                                    { label: "Lost Wages", value: result.lostWages, desc: "Court dates & classes" },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-700">
                                        <div>
                                            <span className="text-slate-300">{item.label}</span>
                                            <span className="text-xs text-slate-500 ml-2">({item.desc})</span>
                                        </div>
                                        <span className="font-medium text-red-400">{formatCurrency(item.value)}</span>
                                    </div>
                                ))}

                                <div className="flex justify-between items-center pt-4 text-lg font-bold">
                                    <span className="text-white">Total Estimated Cost</span>
                                    <span className="text-red-400">{formatCurrency(result.totalAverage)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 bg-slate-700/50 border-t border-slate-700">
                            <div className="flex items-center gap-2 text-emerald-400 text-sm">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Get a free consultation from a DUI attorney to reduce costs</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ad Placeholder */}
                <div className="my-8 p-6 bg-slate-800 border border-slate-700 rounded-xl text-center">
                    <p className="text-sm text-slate-500">Advertisement</p>
                </div>

                {/* FAQ Section */}
                <section className="mt-8 bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-red-500" />
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4 text-sm">
                        <div>
                            <h3 className="font-semibold text-white mb-1">
                                How much does a DUI really cost?
                            </h3>
                            <p className="text-slate-400">
                                The average first-time DUI costs between $10,000 and $25,000 when you include fines, lawyer fees, insurance increases, and other expenses. Second and third offenses can cost $25,000 to $50,000+.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">
                                How long does a DUI affect insurance?
                            </h3>
                            <p className="text-slate-400">
                                A DUI typically affects your insurance rates for 3-5 years. Most states require SR-22 insurance for 3 years, which can increase your premiums by 50-100%.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">
                                Do I need a lawyer for a DUI?
                            </h3>
                            <p className="text-slate-400">
                                While not legally required, a DUI lawyer can often reduce charges, minimize penalties, and potentially save you money in the long run by avoiding conviction.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">
                                What is an ignition interlock device?
                            </h3>
                            <p className="text-slate-400">
                                An ignition interlock device (IID) is a breathalyzer installed in your car that prevents the engine from starting if alcohol is detected. Most states require this for DUI offenders.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Disclaimer */}
                <p className="mt-8 text-xs text-slate-500 text-center">
                    This calculator provides estimates for informational purposes only.
                    Consult a qualified DUI attorney for advice specific to your case.
                </p>
            </main>

            {/* Schema.org FAQPage */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: [
                            {
                                "@type": "Question",
                                name: "How much does a DUI really cost?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "The average first-time DUI costs between $10,000 and $25,000 when you include fines, lawyer fees, insurance increases, and other expenses.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "How long does a DUI affect insurance?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "A DUI typically affects your insurance rates for 3-5 years. Most states require SR-22 insurance for 3 years.",
                                },
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}
