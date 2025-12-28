"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Info } from "lucide-react";
import {
    SITE,
    SE_TAX_2025,
    TAX_BRACKETS_2025,
    formatCurrency,
    parseFormattedNumber,
} from "../site-config";

// W2 FICA rates (employee portion only)
const W2_FICA = {
    socialSecurityRate: 0.062, // 6.2% employee portion
    medicareRate: 0.0145, // 1.45% employee portion
    additionalMedicareRate: 0.009,
    additionalMedicareThreshold: 200000,
};

function calculateW2Tax(salary: number) {
    const ssTax = Math.min(salary, SE_TAX_2025.socialSecurityLimit) * W2_FICA.socialSecurityRate;
    const medicareTax = salary * W2_FICA.medicareRate;
    const additionalMedicare = salary > W2_FICA.additionalMedicareThreshold
        ? (salary - W2_FICA.additionalMedicareThreshold) * W2_FICA.additionalMedicareRate
        : 0;
    const totalFICA = ssTax + medicareTax + additionalMedicare;

    const taxableIncome = Math.max(0, salary - SE_TAX_2025.standardDeduction);
    let federalTax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of TAX_BRACKETS_2025) {
        if (remainingIncome <= 0) break;
        const bracketWidth = bracket.max - bracket.min;
        const taxableInBracket = Math.min(remainingIncome, bracketWidth);
        federalTax += taxableInBracket * bracket.rate;
        remainingIncome -= taxableInBracket;
    }

    const totalTax = totalFICA + federalTax;
    const netPay = salary - totalTax;

    return {
        grossIncome: salary,
        fica: Math.round(totalFICA),
        federalTax: Math.round(federalTax),
        totalTax: Math.round(totalTax),
        netPay: Math.round(netPay),
        effectiveRate: ((totalTax / salary) * 100).toFixed(1),
    };
}

function calculate1099Tax(income: number) {
    const { socialSecurityRate, socialSecurityLimit, medicareRate, additionalMedicareRate, additionalMedicareThreshold, netEarningsMultiplier, deductionRate, standardDeduction } = SE_TAX_2025;

    const netEarnings = income * netEarningsMultiplier;
    const ssTax = Math.min(netEarnings, socialSecurityLimit) * socialSecurityRate;
    const medicareTax = netEarnings * medicareRate;
    const additionalMedicare = netEarnings > additionalMedicareThreshold
        ? (netEarnings - additionalMedicareThreshold) * additionalMedicareRate
        : 0;
    const totalSETax = ssTax + medicareTax + additionalMedicare;
    const seDeduction = totalSETax * deductionRate;

    const taxableIncome = Math.max(0, income - seDeduction - standardDeduction);
    let federalTax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of TAX_BRACKETS_2025) {
        if (remainingIncome <= 0) break;
        const bracketWidth = bracket.max - bracket.min;
        const taxableInBracket = Math.min(remainingIncome, bracketWidth);
        federalTax += taxableInBracket * bracket.rate;
        remainingIncome -= taxableInBracket;
    }

    const totalTax = totalSETax + federalTax;
    const netPay = income - totalTax;

    return {
        grossIncome: income,
        seTax: Math.round(totalSETax),
        federalTax: Math.round(federalTax),
        totalTax: Math.round(totalTax),
        netPay: Math.round(netPay),
        effectiveRate: ((totalTax / income) * 100).toFixed(1),
    };
}

export default function W2vs1099Page() {
    const [income, setIncome] = useState("");
    const [w2Result, setW2Result] = useState<ReturnType<typeof calculateW2Tax> | null>(null);
    const [result1099, setResult1099] = useState<ReturnType<typeof calculate1099Tax> | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        if (raw === "") {
            setIncome("");
            return;
        }
        setIncome(parseInt(raw).toLocaleString("en-US"));
    };

    const handleCalculate = () => {
        const amount = parseFormattedNumber(income);
        if (amount > 0) {
            setW2Result(calculateW2Tax(amount));
            setResult1099(calculate1099Tax(amount));
        }
    };

    const difference = w2Result && result1099 ? w2Result.netPay - result1099.netPay : 0;
    const breakEvenRate = w2Result && result1099 && result1099.grossIncome > 0
        ? ((result1099.grossIncome + difference) / result1099.grossIncome * 100).toFixed(0)
        : "0";

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-indigo-600" />
                        <span className="text-lg font-bold text-slate-900">W2 vs 1099 Calculator</span>
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
                        W2 Employee vs 1099 Contractor
                    </h1>
                    <p className="text-sm text-slate-500 mb-6">
                        Compare your take-home pay as a W2 employee vs 1099 contractor
                    </p>

                    {/* Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Annual Income
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                            <input
                                type="text"
                                value={income}
                                onChange={handleInputChange}
                                onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                                placeholder="100,000"
                                className="w-full pl-8 pr-4 py-4 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            Enter the same amount for both scenarios to compare
                        </p>
                    </div>

                    {/* Calculate Button */}
                    <button
                        onClick={handleCalculate}
                        disabled={!income}
                        className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        <Calculator className="w-5 h-5" />
                        Compare Tax Scenarios
                    </button>
                </div>

                {/* Results */}
                {w2Result && result1099 && (
                    <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Summary Header */}
                        <div className="bg-indigo-600 text-white p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-indigo-200 mb-1">W2 Take-Home</p>
                                    <p className="text-2xl font-bold">{formatCurrency(w2Result.netPay)}</p>
                                    <p className="text-xs text-indigo-200">{w2Result.effectiveRate}% effective</p>
                                </div>
                                <div>
                                    <p className="text-sm text-indigo-200 mb-1">1099 Take-Home</p>
                                    <p className="text-2xl font-bold">{formatCurrency(result1099.netPay)}</p>
                                    <p className="text-xs text-indigo-200">{result1099.effectiveRate}% effective</p>
                                </div>
                            </div>
                        </div>

                        {/* Difference Highlight */}
                        <div className="p-4 bg-emerald-50 border-b border-emerald-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-800">
                                        {difference > 0 ? 'W2 Advantage' : '1099 Advantage'}
                                    </p>
                                    <p className="text-xs text-emerald-600">
                                        Break-even: 1099 needs {breakEvenRate}% of W2 salary
                                    </p>
                                </div>
                                <p className="text-2xl font-bold text-emerald-700">
                                    {formatCurrency(Math.abs(difference))}
                                </p>
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="p-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                Tax Breakdown
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="grid grid-cols-3 gap-4 pb-3 border-b border-slate-100">
                                    <span className="text-slate-600">Gross Income</span>
                                    <span className="text-right font-medium text-slate-900">{formatCurrency(w2Result.grossIncome)}</span>
                                    <span className="text-right font-medium text-slate-900">{formatCurrency(result1099.grossIncome)}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pb-3 border-b border-slate-100">
                                    <span className="text-slate-600">FICA / SE Tax</span>
                                    <span className="text-right text-red-600">-{formatCurrency(w2Result.fica)}</span>
                                    <span className="text-right text-red-600">-{formatCurrency(result1099.seTax)}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pb-3 border-b border-slate-100">
                                    <span className="text-slate-600">Federal Tax</span>
                                    <span className="text-right text-red-600">-{formatCurrency(w2Result.federalTax)}</span>
                                    <span className="text-right text-red-600">-{formatCurrency(result1099.federalTax)}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pt-2 font-bold">
                                    <span className="text-slate-900">Net Pay</span>
                                    <span className="text-right text-slate-900">{formatCurrency(w2Result.netPay)}</span>
                                    <span className="text-right text-slate-900">{formatCurrency(result1099.netPay)}</span>
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
                                Why do 1099 contractors pay more in taxes?
                            </h3>
                            <p className="text-slate-600">
                                1099 contractors pay both the employer and employee portions of Social Security and Medicare taxes (15.3% vs 7.65%). This is called self-employment tax.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                                What rate should I charge as a 1099 contractor?
                            </h3>
                            <p className="text-slate-600">
                                To match W2 take-home pay, most contractors need to charge 25-40% more than an equivalent W2 salary. This covers the extra taxes and lack of benefits.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                                Does this include benefits?
                            </h3>
                            <p className="text-slate-600">
                                No. This calculator only compares taxes. W2 employees often receive health insurance, 401(k) matching, and other benefits worth 20-30% of salary.
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
                                name: "Why do 1099 contractors pay more in taxes?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "1099 contractors pay both the employer and employee portions of Social Security and Medicare taxes (15.3% vs 7.65%).",
                                },
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}
