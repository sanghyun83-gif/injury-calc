"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Car, Calculator, Info, AlertTriangle, DollarSign } from "lucide-react";
import {
    SITE,
    INJURY_CONSTANTS_2025,
    formatCurrency,
    parseFormattedNumber
} from "../site-config";

interface AccidentResult {
    vehicleDamage: number;
    medicalExpenses: number;
    lostWages: number;
    faultPercent: number;
    painSuffering: number;
    totalBeforeFault: number;
    adjustedTotal: number;
    attorneyFees: number;
    netSettlement: number;
    settlementRange: { min: number; max: number };
}

function calculateCarAccident(
    vehicleDamage: number,
    medicalExpenses: number,
    lostWages: number,
    faultPercent: number,
    severity: 'minor' | 'moderate' | 'severe',
    hasAttorney: boolean
): AccidentResult {
    const multipliers = INJURY_CONSTANTS_2025.multipliers[severity];

    // Pain & suffering
    const painSuffering = Math.round(medicalExpenses * multipliers.avg);

    // Total before fault adjustment
    const totalBeforeFault = vehicleDamage + medicalExpenses + lostWages + painSuffering;

    // Adjust for comparative fault
    const yourFaultReduction = totalBeforeFault * (faultPercent / 100);
    const adjustedTotal = Math.round(totalBeforeFault - yourFaultReduction);

    // Attorney fees
    const attorneyFees = hasAttorney
        ? Math.round(adjustedTotal * INJURY_CONSTANTS_2025.attorneyFees.preSettlement)
        : 0;

    // Net settlement
    const netSettlement = adjustedTotal - attorneyFees;

    // Settlement range
    const minPain = medicalExpenses * multipliers.min;
    const maxPain = medicalExpenses * multipliers.max;
    const minTotal = (vehicleDamage + medicalExpenses + lostWages + minPain) * (1 - faultPercent / 100);
    const maxTotal = (vehicleDamage + medicalExpenses + lostWages + maxPain) * (1 - faultPercent / 100);

    return {
        vehicleDamage,
        medicalExpenses,
        lostWages,
        faultPercent,
        painSuffering,
        totalBeforeFault,
        adjustedTotal,
        attorneyFees,
        netSettlement,
        settlementRange: {
            min: Math.round(hasAttorney ? minTotal * 0.67 : minTotal),
            max: Math.round(hasAttorney ? maxTotal * 0.67 : maxTotal),
        },
    };
}

export default function CarAccidentPage() {
    const [vehicleDamage, setVehicleDamage] = useState("");
    const [medicalExpenses, setMedicalExpenses] = useState("");
    const [lostWages, setLostWages] = useState("");
    const [faultPercent, setFaultPercent] = useState(0);
    const [severity, setSeverity] = useState<"minor" | "moderate" | "severe">("moderate");
    const [hasAttorney, setHasAttorney] = useState(true);
    const [result, setResult] = useState<AccidentResult | null>(null);

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            if (raw === "") {
                setter("");
                return;
            }
            setter(parseInt(raw).toLocaleString("en-US"));
        };

    const handleCalculate = () => {
        const vehicle = parseFormattedNumber(vehicleDamage) || 5000;
        const medical = parseFormattedNumber(medicalExpenses) || 10000;
        const wages = parseFormattedNumber(lostWages) || 0;
        setResult(calculateCarAccident(vehicle, medical, wages, faultPercent, severity, hasAttorney));
    };

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-blue-500" />
                        <span className="text-lg font-bold text-white">Car Accident Calculator</span>
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
                        {SITE.year} Car Accident Settlement Calculator
                    </h1>
                    <p className="text-sm text-slate-400 mb-6">
                        Estimate your car accident settlement based on damages, injuries, and fault
                    </p>

                    {/* Inputs */}
                    <div className="space-y-4 mb-6">
                        {/* Vehicle Damage */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Vehicle Damage
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input
                                    type="text"
                                    value={vehicleDamage}
                                    onChange={handleInputChange(setVehicleDamage)}
                                    placeholder="5,000"
                                    className="w-full pl-8 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Medical Expenses */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Medical Expenses
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input
                                    type="text"
                                    value={medicalExpenses}
                                    onChange={handleInputChange(setMedicalExpenses)}
                                    placeholder="10,000"
                                    className="w-full pl-8 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Lost Wages */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Lost Wages
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input
                                    type="text"
                                    value={lostWages}
                                    onChange={handleInputChange(setLostWages)}
                                    placeholder="0"
                                    className="w-full pl-8 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Your Fault Percentage */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Your Fault Percentage: {faultPercent}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={faultPercent}
                                onChange={(e) => setFaultPercent(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>0% (Not your fault)</span>
                                <span>100% (All your fault)</span>
                            </div>
                        </div>

                        {/* Injury Severity */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Injury Severity
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: "minor", label: "Minor", desc: "Whiplash, bruises" },
                                    { value: "moderate", label: "Moderate", desc: "Fractures" },
                                    { value: "severe", label: "Severe", desc: "Surgery needed" },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setSeverity(opt.value as typeof severity)}
                                        className={`py-3 px-2 rounded-lg border font-medium transition text-center ${severity === opt.value
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-slate-700 text-slate-300 border-slate-600 hover:border-blue-500"
                                            }`}
                                    >
                                        <div className="text-sm">{opt.label}</div>
                                        <div className="text-xs opacity-75">{opt.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Attorney Toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-white">Using an Attorney?</p>
                                <p className="text-xs text-slate-400">Fees: 33% of settlement</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setHasAttorney(!hasAttorney)}
                                className={`w-14 h-8 rounded-full transition-colors ${hasAttorney ? "bg-blue-600" : "bg-slate-600"
                                    }`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full transition-transform mx-1 ${hasAttorney ? "translate-x-6" : "translate-x-0"
                                    }`} />
                            </button>
                        </div>
                    </div>

                    {/* Calculate Button */}
                    <button
                        onClick={handleCalculate}
                        className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Calculator className="w-5 h-5" />
                        Calculate Settlement
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div className="mt-6 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                        {/* Summary Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
                            <p className="text-sm text-blue-100 mb-1">Estimated Car Accident Settlement</p>
                            <p className="text-4xl font-bold">{formatCurrency(result.netSettlement)}</p>
                            <p className="text-sm text-blue-100 mt-2">
                                Range: {formatCurrency(result.settlementRange.min)} - {formatCurrency(result.settlementRange.max)}
                            </p>
                        </div>

                        {/* Breakdown */}
                        <div className="p-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                Settlement Breakdown
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-slate-700">
                                    <span className="text-slate-300">Vehicle Damage</span>
                                    <span className="font-medium text-white">{formatCurrency(result.vehicleDamage)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-700">
                                    <span className="text-slate-300">Medical Expenses</span>
                                    <span className="font-medium text-white">{formatCurrency(result.medicalExpenses)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-700">
                                    <span className="text-slate-300">Lost Wages</span>
                                    <span className="font-medium text-white">{formatCurrency(result.lostWages)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-700">
                                    <span className="text-slate-300">Pain & Suffering</span>
                                    <span className="font-medium text-blue-400">+{formatCurrency(result.painSuffering)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-700">
                                    <span className="text-white font-medium">Subtotal</span>
                                    <span className="font-bold text-white">{formatCurrency(result.totalBeforeFault)}</span>
                                </div>
                                {result.faultPercent > 0 && (
                                    <div className="flex justify-between py-2 border-b border-slate-700">
                                        <span className="text-slate-300">Comparative Fault ({result.faultPercent}%)</span>
                                        <span className="font-medium text-red-400">
                                            -{formatCurrency(result.totalBeforeFault - result.adjustedTotal)}
                                        </span>
                                    </div>
                                )}
                                {result.attorneyFees > 0 && (
                                    <div className="flex justify-between py-2 border-b border-slate-700">
                                        <span className="text-slate-300">Attorney Fees (33%)</span>
                                        <span className="font-medium text-red-400">-{formatCurrency(result.attorneyFees)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-4 text-lg">
                                    <span className="text-white font-bold">Your Net Settlement</span>
                                    <span className="font-bold text-blue-400">{formatCurrency(result.netSettlement)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        {result.faultPercent > 0 && (
                            <div className="p-4 bg-amber-900/30 border-t border-amber-700/50">
                                <div className="flex items-start gap-2 text-sm">
                                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                                    <p className="text-amber-200">
                                        Your {result.faultPercent}% fault reduces your settlement. Some states bar recovery if you&apos;re 50%+ at fault.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Ad Placeholder */}
                <div className="my-8 p-6 bg-slate-800 border border-slate-700 rounded-xl text-center">
                    <p className="text-sm text-slate-500">Advertisement</p>
                </div>

                {/* FAQ */}
                <section className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-500" />
                        Car Accident Settlement FAQ
                    </h2>

                    <div className="space-y-4 text-sm">
                        <div>
                            <h3 className="font-semibold text-white mb-1">
                                What is the average car accident settlement?
                            </h3>
                            <p className="text-slate-400">
                                The average car accident settlement ranges from $15,000 to $75,000 depending on injuries. Minor injuries settle for $10,000-$25,000, while severe injuries can exceed $100,000.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">
                                How does fault affect my settlement?
                            </h3>
                            <p className="text-slate-400">
                                In comparative fault states, your settlement is reduced by your fault percentage. If you&apos;re 20% at fault, you receive 80% of the total damages.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">
                                Should I get a lawyer for a car accident?
                            </h3>
                            <p className="text-slate-400">
                                Studies show accident victims with attorneys receive 3.5x higher settlements on average. For injuries over $10,000 in medical bills, legal representation typically pays for itself.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="mt-8 text-center">
                    <Link
                        href="/injury-settlement"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Try Full Injury Calculator →
                    </Link>
                </div>

                {/* Disclaimer */}
                <p className="mt-8 text-xs text-slate-500 text-center">
                    This calculator provides estimates based on {SITE.year} data.
                    Actual settlements vary by state, insurance, and case specifics.
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
                                name: "What is the average car accident settlement?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "The average car accident settlement ranges from $15,000 to $75,000 depending on injuries.",
                                },
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}
