"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Calculator, Info, Car } from "lucide-react";
import { SITE, formatCurrency, parseFormattedNumber } from "../site-config";

interface ClaimResult {
    vehicleDamage: number;
    medicalExpenses: number;
    lostWages: number;
    painSuffering: number;
    totalClaim: number;
    policyLimit: number;
    expectedPayout: number;
}

function calculateClaim(
    vehicleDamage: number,
    medicalExpenses: number,
    lostWages: number,
    policyLimit: number
): ClaimResult {
    // Pain & suffering estimate (2x medical for moderate injuries)
    const painSuffering = Math.round(medicalExpenses * 2);

    // Total claim value
    const totalClaim = vehicleDamage + medicalExpenses + lostWages + painSuffering;

    // Expected payout (capped by policy limit)
    const expectedPayout = Math.min(totalClaim, policyLimit);

    return {
        vehicleDamage,
        medicalExpenses,
        lostWages,
        painSuffering,
        totalClaim,
        policyLimit,
        expectedPayout,
    };
}

export default function InsuranceClaimPage() {
    const [vehicleDamage, setVehicleDamage] = useState("");
    const [medicalExpenses, setMedicalExpenses] = useState("");
    const [lostWages, setLostWages] = useState("");
    const [policyLimit, setPolicyLimit] = useState("100,000");
    const [result, setResult] = useState<ClaimResult | null>(null);

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
        const vehicle = parseFormattedNumber(vehicleDamage) || 0;
        const medical = parseFormattedNumber(medicalExpenses) || 0;
        const wages = parseFormattedNumber(lostWages) || 0;
        const limit = parseFormattedNumber(policyLimit) || 100000;

        setResult(calculateClaim(vehicle, medical, wages, limit));
    };

    const policyOptions = [
        { value: "25,000", label: "$25K" },
        { value: "50,000", label: "$50K" },
        { value: "100,000", label: "$100K" },
        { value: "250,000", label: "$250K" },
        { value: "500,000", label: "$500K" },
    ];

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <span className="text-lg font-bold text-white">Insurance Claim Calculator</span>
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
                        {SITE.year} Insurance Claim Calculator
                    </h1>
                    <p className="text-sm text-slate-400 mb-6">
                        Estimate your insurance claim value for car accidents and injuries
                    </p>

                    {/* Inputs */}
                    <div className="space-y-4 mb-6">
                        {/* Vehicle Damage */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                <Car className="w-4 h-4 inline mr-1" />
                                Vehicle Damage / Property Damage
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
                                Medical Expenses (Bodily Injury)
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

                        {/* Policy Limit */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                At-Fault Driver&apos;s Policy Limit
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {policyOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setPolicyLimit(opt.value)}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${policyLimit === opt.value
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-slate-700 text-slate-300 border-slate-600 hover:border-blue-500"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Calculate Button */}
                    <button
                        onClick={handleCalculate}
                        className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Calculator className="w-5 h-5" />
                        Calculate Claim Value
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div className="mt-6 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                        {/* Summary Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                            <p className="text-sm text-blue-100 mb-1">Expected Insurance Payout</p>
                            <p className="text-4xl font-bold">{formatCurrency(result.expectedPayout)}</p>
                            {result.totalClaim > result.policyLimit && (
                                <p className="text-sm text-amber-300 mt-2">
                                    ⚠️ Claim exceeds policy limit by {formatCurrency(result.totalClaim - result.policyLimit)}
                                </p>
                            )}
                        </div>

                        {/* Breakdown */}
                        <div className="p-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                Claim Breakdown
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-slate-700">
                                    <span className="text-slate-300">Vehicle/Property Damage</span>
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
                                    <span className="text-slate-300">Pain & Suffering (2x medical)</span>
                                    <span className="font-medium text-blue-400">+{formatCurrency(result.painSuffering)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-700">
                                    <span className="text-white font-medium">Total Claim Value</span>
                                    <span className="font-bold text-white">{formatCurrency(result.totalClaim)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-700">
                                    <span className="text-slate-300">Policy Limit</span>
                                    <span className="font-medium text-slate-400">{formatCurrency(result.policyLimit)}</span>
                                </div>
                                <div className="flex justify-between pt-4 text-lg">
                                    <span className="text-white font-bold">Expected Payout</span>
                                    <span className="font-bold text-blue-400">{formatCurrency(result.expectedPayout)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 bg-blue-900/30 border-t border-blue-700/50">
                            <div className="flex items-start gap-2 text-sm">
                                <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                                <p className="text-blue-200">
                                    If your damages exceed the policy limit, you may need to pursue the at-fault driver personally or use your own underinsured motorist coverage.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

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
                        Try Full Settlement Calculator →
                    </Link>
                </div>

                {/* Disclaimer */}
                <p className="mt-8 text-xs text-slate-500 text-center">
                    This calculator provides estimates. Actual insurance payouts depend on policy terms,
                    liability determination, and negotiation. Consult with an attorney for complex claims.
                </p>
            </main>
        </div>
    );
}
