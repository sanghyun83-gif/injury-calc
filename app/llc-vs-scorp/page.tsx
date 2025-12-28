"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Home, Calculator, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import {
    SITE,
    SE_TAX_2025,
    TAX_BRACKETS_2025,
    calculateSETax,
    formatCurrency,
    parseFormattedNumber,
} from "../site-config";

const SCORP_MIN_SALARY_PERCENT = 0.40;
const SCORP_COMPLEXITY_COST = 3000;

function calculateFederalTax(taxableIncome: number): number {
    let federalTax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of TAX_BRACKETS_2025) {
        if (remainingIncome <= 0) break;
        const bracketWidth = bracket.max - bracket.min;
        const taxableInBracket = Math.min(remainingIncome, bracketWidth);
        federalTax += taxableInBracket * bracket.rate;
        remainingIncome -= taxableInBracket;
    }

    return federalTax;
}

function calculateLLCTax(income: number) {
    const result = calculateSETax(income);
    return {
        seTax: result.totalSETax,
        federalTax: result.federalTax,
        totalTax: result.totalTax,
        netIncome: income - result.totalTax,
    };
}

function calculateSCorpTax(income: number, salary: number) {
    const employeeFICA = salary * 0.0765;
    const employerFICA = salary * 0.0765;
    const totalFICA = employeeFICA + employerFICA;

    const distribution = income - salary - employerFICA;
    const taxableIncome = Math.max(0, salary + distribution - SE_TAX_2025.standardDeduction);
    const federalTax = calculateFederalTax(taxableIncome);

    const totalTax = totalFICA + federalTax + SCORP_COMPLEXITY_COST;
    const netIncome = income - totalTax;

    return {
        salary,
        distribution: Math.max(0, distribution),
        employeeFICA: Math.round(employeeFICA),
        employerFICA: Math.round(employerFICA),
        totalFICA: Math.round(totalFICA),
        federalTax: Math.round(federalTax),
        scorphCosts: SCORP_COMPLEXITY_COST,
        totalTax: Math.round(totalTax),
        netIncome: Math.round(netIncome),
    };
}

export default function LLCvsSCorpPage() {
    const [income, setIncome] = useState("");
    const [salary, setSalary] = useState("");
    const [llcResult, setLLCResult] = useState<ReturnType<typeof calculateLLCTax> | null>(null);
    const [scorpResult, setSCorpResult] = useState<ReturnType<typeof calculateSCorpTax> | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        if (raw === "") {
            setter("");
            return;
        }
        setter(parseInt(raw).toLocaleString("en-US"));
    };

    const handleCalculate = () => {
        const totalIncome = parseFormattedNumber(income);
        let reasonableSalary = parseFormattedNumber(salary);

        if (!reasonableSalary && totalIncome > 0) {
            reasonableSalary = Math.round(totalIncome * SCORP_MIN_SALARY_PERCENT);
            setSalary(reasonableSalary.toLocaleString("en-US"));
        }

        if (totalIncome > 0 && reasonableSalary > 0) {
            setLLCResult(calculateLLCTax(totalIncome));
            setSCorpResult(calculateSCorpTax(totalIncome, reasonableSalary));
        }
    };

    const savings = llcResult && scorpResult ? llcResult.totalTax - scorpResult.totalTax : 0;
    const scorpWorthIt = savings > SCORP_COMPLEXITY_COST;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Home className="w-5 h-5 text-indigo-600" />
                        <span className="text-lg font-bold text-slate-900">LLC vs S-Corp Calculator</span>
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
                        LLC vs S-Corp Tax Comparison
                    </h1>
                    <p className="text-sm text-slate-500 mb-6">
                        See how much you could save by electing S-Corp status
                    </p>

                    {/* Inputs */}
                    <div className="space-y-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Total Business Income (after expenses)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                                <input
                                    type="text"
                                    value={income}
                                    onChange={(e) => handleInputChange(e, setIncome)}
                                    onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                                    placeholder="150,000"
                                    className="w-full pl-8 pr-4 py-4 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Reasonable Salary (S-Corp)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                                <input
                                    type="text"
                                    value={salary}
                                    onChange={(e) => handleInputChange(e, setSalary)}
                                    placeholder="60,000"
                                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                IRS requires a "reasonable salary" (typically 40-60% of net income)
                            </p>
                        </div>
                    </div>

                    {/* Calculate Button */}
                    <button
                        onClick={handleCalculate}
                        disabled={!income}
                        className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        <Calculator className="w-5 h-5" />
                        Compare Tax Structures
                    </button>
                </div>

                {/* Results */}
                {llcResult && scorpResult && (
                    <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Summary Header */}
                        <div className="bg-indigo-600 text-white p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-indigo-200 mb-1">LLC Total Tax</p>
                                    <p className="text-2xl font-bold">{formatCurrency(llcResult.totalTax)}</p>
                                    <p className="text-xs text-indigo-200">Net: {formatCurrency(llcResult.netIncome)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-indigo-200 mb-1">S-Corp Total Tax</p>
                                    <p className="text-2xl font-bold">{formatCurrency(scorpResult.totalTax)}</p>
                                    <p className="text-xs text-indigo-200">Net: {formatCurrency(scorpResult.netIncome)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Savings Highlight */}
                        <div className={`p-4 border-b ${scorpWorthIt ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {scorpWorthIt ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    ) : (
                                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                                    )}
                                    <div>
                                        <p className={`text-sm font-medium ${scorpWorthIt ? 'text-emerald-800' : 'text-amber-800'}`}>
                                            {savings > 0 ? 'S-Corp Saves' : 'LLC is Better'}
                                        </p>
                                        <p className={`text-xs ${scorpWorthIt ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {scorpWorthIt ? 'Worth the extra complexity' : 'Savings don\'t justify costs'}
                                        </p>
                                    </div>
                                </div>
                                <p className={`text-2xl font-bold ${scorpWorthIt ? 'text-emerald-700' : 'text-amber-700'}`}>
                                    {formatCurrency(Math.abs(savings))}
                                </p>
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="p-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                Tax Breakdown
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="grid grid-cols-3 gap-4 pb-3 border-b border-slate-100 text-xs font-medium text-slate-400">
                                    <span></span>
                                    <span className="text-right">LLC</span>
                                    <span className="text-right">S-Corp</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pb-3 border-b border-slate-100">
                                    <span className="text-slate-600">SE Tax / FICA</span>
                                    <span className="text-right text-red-600">-{formatCurrency(llcResult.seTax)}</span>
                                    <span className="text-right text-red-600">-{formatCurrency(scorpResult.totalFICA)}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pb-3 border-b border-slate-100">
                                    <span className="text-slate-600">Federal Tax</span>
                                    <span className="text-right text-red-600">-{formatCurrency(llcResult.federalTax)}</span>
                                    <span className="text-right text-red-600">-{formatCurrency(scorpResult.federalTax)}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pb-3 border-b border-slate-100">
                                    <span className="text-slate-600">Admin Costs</span>
                                    <span className="text-right text-slate-400">—</span>
                                    <span className="text-right text-red-600">-{formatCurrency(SCORP_COMPLEXITY_COST)}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pt-2 font-bold">
                                    <span className="text-slate-900">Net Income</span>
                                    <span className="text-right text-slate-900">{formatCurrency(llcResult.netIncome)}</span>
                                    <span className="text-right text-slate-900">{formatCurrency(scorpResult.netIncome)}</span>
                                </div>
                            </div>
                        </div>

                        {/* S-Corp Details */}
                        <div className="mx-6 mb-6 p-4 bg-slate-50 rounded-lg">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">S-Corp Structure</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-600">Salary:</span>
                                    <span className="font-medium text-slate-900 ml-2">{formatCurrency(scorpResult.salary)}</span>
                                </div>
                                <div>
                                    <span className="text-slate-600">Distribution:</span>
                                    <span className="font-medium text-slate-900 ml-2">{formatCurrency(scorpResult.distribution)}</span>
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
                                When does S-Corp election make sense?
                            </h3>
                            <p className="text-slate-600">
                                Generally, S-Corp becomes beneficial when net income exceeds $60,000-$80,000 annually. Below this threshold, the admin costs often outweigh tax savings.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                                What is a "reasonable salary"?
                            </h3>
                            <p className="text-slate-600">
                                The IRS requires S-Corp owner-employees to pay themselves a reasonable salary for the work they perform. This is typically 40-60% of net business income.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                                What are the S-Corp admin costs?
                            </h3>
                            <p className="text-slate-600">
                                S-Corps require separate payroll, quarterly filings, and more complex tax returns. Budget $2,000-$5,000/year for accounting and compliance.
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
                                name: "When does S-Corp election make sense?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Generally, S-Corp becomes beneficial when net income exceeds $60,000-$80,000 annually.",
                                },
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}
