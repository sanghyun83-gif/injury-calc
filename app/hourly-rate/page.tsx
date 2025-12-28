"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Calculator, Info } from "lucide-react";
import {
    SITE,
    calculateSETax,
    formatCurrency,
    parseFormattedNumber,
} from "../site-config";

const DEFAULT_WEEKS = 48;
const DEFAULT_HOURS = 40;
const DEFAULT_EXPENSES_RATE = 0.10;

function calculateHourlyRate(targetIncome: number, weeksPerYear: number, hoursPerWeek: number, expenseRate: number) {
    const taxResult = calculateSETax(targetIncome);
    const totalTax = taxResult.totalTax;
    const effectiveTaxRate = totalTax / targetIncome;

    const billableHours = weeksPerYear * hoursPerWeek;
    const utilizationRate = 0.75;
    const actualBillableHours = billableHours * utilizationRate;

    const grossNeeded = targetIncome / (1 - effectiveTaxRate - expenseRate);
    const minHourlyRate = grossNeeded / actualBillableHours;
    const breakEvenRate = targetIncome / actualBillableHours;
    const recommendedRate = minHourlyRate * 1.2;

    return {
        targetIncome,
        totalTax,
        effectiveTaxRate: (effectiveTaxRate * 100).toFixed(1),
        billableHours: Math.round(actualBillableHours),
        grossNeeded: Math.round(grossNeeded),
        breakEvenRate: Math.round(breakEvenRate),
        minHourlyRate: Math.round(minHourlyRate),
        recommendedRate: Math.round(recommendedRate),
        annualAtRecommended: Math.round(recommendedRate * actualBillableHours),
    };
}

export default function HourlyRatePage() {
    const [income, setIncome] = useState("");
    const [weeks, setWeeks] = useState(DEFAULT_WEEKS.toString());
    const [hours, setHours] = useState(DEFAULT_HOURS.toString());
    const [result, setResult] = useState<ReturnType<typeof calculateHourlyRate> | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        if (raw === "") {
            setIncome("");
            return;
        }
        setIncome(parseInt(raw).toLocaleString("en-US"));
    };

    const handleCalculate = () => {
        const targetIncome = parseFormattedNumber(income);
        const weeksNum = parseInt(weeks) || DEFAULT_WEEKS;
        const hoursNum = parseInt(hours) || DEFAULT_HOURS;

        if (targetIncome > 0) {
            setResult(calculateHourlyRate(targetIncome, weeksNum, hoursNum, DEFAULT_EXPENSES_RATE));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        <span className="text-lg font-bold text-slate-900">Hourly Rate Calculator</span>
                    </div>
                    <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        {SITE.year}
                    </span>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Calculator Card */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h1 className="text-xl font-bold text-slate-900 mb-2">
                        Freelance Hourly Rate Calculator
                    </h1>
                    <p className="text-sm text-slate-500 mb-6">
                        Calculate the hourly rate you need to meet your income goals
                    </p>

                    {/* Inputs */}
                    <div className="space-y-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Target Annual Take-Home Income
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                                <input
                                    type="text"
                                    value={income}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                                    placeholder="80,000"
                                    className="w-full pl-8 pr-4 py-4 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">How much you want to take home after taxes</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Weeks per Year
                                </label>
                                <input
                                    type="number"
                                    value={weeks}
                                    onChange={(e) => setWeeks(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="48"
                                />
                                <p className="text-xs text-slate-400 mt-1">Account for vacation</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Hours per Week
                                </label>
                                <input
                                    type="number"
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="40"
                                />
                                <p className="text-xs text-slate-400 mt-1">Total work hours</p>
                            </div>
                        </div>
                    </div>

                    {/* Calculate Button */}
                    <button
                        onClick={handleCalculate}
                        disabled={!income}
                        className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        <Calculator className="w-5 h-5" />
                        Calculate Hourly Rate
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Summary Header */}
                        <div className="bg-indigo-600 text-white p-6">
                            <p className="text-sm text-indigo-200 mb-1">Minimum Hourly Rate</p>
                            <p className="text-4xl font-bold">${result.minHourlyRate}/hr</p>
                            <p className="text-sm text-indigo-200 mt-2">
                                Covers taxes + expenses • Recommended: ${result.recommendedRate}/hr
                            </p>
                        </div>

                        {/* Recommended Rate Highlight */}
                        <div className="p-4 bg-emerald-50 border-b border-emerald-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-800">Recommended Rate (+20% buffer)</p>
                                    <p className="text-xs text-emerald-600">Annual: {formatCurrency(result.annualAtRecommended)}</p>
                                </div>
                                <p className="text-2xl font-bold text-emerald-700">${result.recommendedRate}/hr</p>
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="p-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                Calculation Breakdown
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between pb-3 border-b border-slate-100">
                                    <span className="text-slate-600">Target Take-Home</span>
                                    <span className="font-medium text-slate-900">{formatCurrency(result.targetIncome)}</span>
                                </div>
                                <div className="flex justify-between pb-3 border-b border-slate-100">
                                    <span className="text-slate-600">Estimated Taxes ({result.effectiveTaxRate}%)</span>
                                    <span className="text-red-600">+{formatCurrency(result.totalTax)}</span>
                                </div>
                                <div className="flex justify-between pb-3 border-b border-slate-100">
                                    <span className="text-slate-600">Business Expenses (10%)</span>
                                    <span className="text-red-600">+{formatCurrency(Math.round(result.grossNeeded * 0.1))}</span>
                                </div>
                                <div className="flex justify-between pb-3 border-b border-slate-100">
                                    <span className="font-medium text-slate-900">Gross Revenue Needed</span>
                                    <span className="font-medium text-slate-900">{formatCurrency(result.grossNeeded)}</span>
                                </div>
                                <div className="flex justify-between pb-3 border-b border-slate-100">
                                    <span className="text-slate-600">Billable Hours (75% utilization)</span>
                                    <span className="font-medium text-slate-900">{result.billableHours} hrs/year</span>
                                </div>
                                <div className="flex justify-between pt-2 font-bold text-lg">
                                    <span className="text-slate-900">Minimum Hourly Rate</span>
                                    <span className="text-indigo-600">${result.minHourlyRate}/hr</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ad Placeholder */}
                <div className="my-8 p-6 bg-white border border-slate-200 rounded-xl text-center">
                    <p className="text-sm text-slate-400">Advertisement</p>
                </div>

                {/* FAQ Section */}
                <section className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-indigo-600" />
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4 text-sm">
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                                Why is my hourly rate so high?
                            </h3>
                            <p className="text-slate-600">
                                As a freelancer, you pay both employer and employee portions of taxes (15.3% SE tax), plus you have business expenses. You also can't bill 100% of your time.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                                What is utilization rate?
                            </h3>
                            <p className="text-slate-600">
                                Utilization rate is the percentage of your work time that's actually billable. Industry average is 60-80%. Non-billable time includes admin, marketing, and learning.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                                Should I charge more than the minimum?
                            </h3>
                            <p className="text-slate-600">
                                Yes! The minimum rate is the break-even point. Add a buffer for slow months, retirement savings, and profit margin. We recommend at least 20% above minimum.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Disclaimer */}
                <p className="mt-8 text-xs text-slate-400 text-center">
                    This calculator provides estimates for informational purposes only.
                    Consult a qualified tax professional for personalized advice.
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
                                name: "How do I calculate my freelance hourly rate?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Divide your target annual income (plus taxes and expenses) by your expected billable hours. Account for time spent on non-billable work like marketing and admin.",
                                },
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}
