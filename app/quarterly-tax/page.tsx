"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Info, AlertCircle } from "lucide-react";
import {
    SITE,
    calculateSETax,
    formatCurrency,
    parseFormattedNumber,
} from "../site-config";

// 2025 Quarterly Tax Deadlines
const QUARTERLY_DEADLINES = [
    { quarter: "Q1", period: "Jan 1 - Mar 31", deadline: "April 15, 2025", date: new Date(2025, 3, 15) },
    { quarter: "Q2", period: "Apr 1 - May 31", deadline: "June 16, 2025", date: new Date(2025, 5, 16) },
    { quarter: "Q3", period: "Jun 1 - Aug 31", deadline: "September 15, 2025", date: new Date(2025, 8, 15) },
    { quarter: "Q4", period: "Sep 1 - Dec 31", deadline: "January 15, 2026", date: new Date(2026, 0, 15) },
];

function getCurrentQuarter(): number {
    const now = new Date();
    const month = now.getMonth();
    if (month < 3) return 1;
    if (month < 6) return 2;
    if (month < 9) return 3;
    return 4;
}

function getRemainingQuarters(): number {
    return 5 - getCurrentQuarter();
}

export default function QuarterlyTaxPage() {
    const [income, setIncome] = useState("");
    const [alreadyPaid, setAlreadyPaid] = useState("");
    const [result, setResult] = useState<{
        totalTax: number;
        quarterlyPayment: number;
        remainingPayment: number;
        paymentsLeft: number;
    } | null>(null);

    const currentQuarter = getCurrentQuarter();
    const remainingQuarters = getRemainingQuarters();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        if (raw === "") {
            setter("");
            return;
        }
        setter(parseInt(raw).toLocaleString("en-US"));
    };

    const handleCalculate = () => {
        const amount = parseFormattedNumber(income);
        const paid = parseFormattedNumber(alreadyPaid);
        if (amount > 0) {
            const taxResult = calculateSETax(amount);
            const remainingTax = Math.max(0, taxResult.totalTax - paid);
            const paymentPerQuarter = Math.ceil(remainingTax / remainingQuarters);

            setResult({
                totalTax: taxResult.totalTax,
                quarterlyPayment: taxResult.quarterlyPayment,
                remainingPayment: paymentPerQuarter,
                paymentsLeft: remainingQuarters,
            });
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
                        <Calculator className="w-5 h-5 text-indigo-600" />
                        <span className="text-lg font-bold text-slate-900">Quarterly Tax Calculator</span>
                    </div>
                    <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        {SITE.year}
                    </span>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Current Quarter Alert */}
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                        <p className="text-sm text-amber-800">
                            <strong>Current: Q{currentQuarter}</strong> • Next deadline: {QUARTERLY_DEADLINES[currentQuarter - 1]?.deadline}
                        </p>
                    </div>
                </div>

                {/* Calculator Card */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h1 className="text-xl font-bold text-slate-900 mb-2">
                        {SITE.year} Quarterly Estimated Tax Calculator
                    </h1>
                    <p className="text-sm text-slate-500 mb-6">
                        Calculate your quarterly estimated tax payments (Form 1040-ES)
                    </p>

                    {/* Inputs */}
                    <div className="space-y-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Expected Annual Income ({SITE.year})
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                                <input
                                    type="text"
                                    value={income}
                                    onChange={(e) => handleInputChange(e, setIncome)}
                                    onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                                    placeholder="100,000"
                                    className="w-full pl-8 pr-4 py-4 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Already Paid This Year (optional)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                                <input
                                    type="text"
                                    value={alreadyPaid}
                                    onChange={(e) => handleInputChange(e, setAlreadyPaid)}
                                    placeholder="0"
                                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
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
                        Calculate Quarterly Payments
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Summary Header */}
                        <div className="bg-indigo-600 text-white p-6">
                            <p className="text-sm text-indigo-200 mb-1">Recommended Quarterly Payment</p>
                            <p className="text-4xl font-bold">{formatCurrency(result.remainingPayment)}</p>
                            <p className="text-sm text-indigo-200 mt-2">
                                {result.paymentsLeft} payment(s) remaining • Total tax: {formatCurrency(result.totalTax)}
                            </p>
                        </div>

                        {/* Payment Schedule */}
                        <div className="p-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                {SITE.year} Payment Schedule
                            </h3>

                            <div className="space-y-3">
                                {QUARTERLY_DEADLINES.map((q, i) => {
                                    const isPast = i + 1 < currentQuarter;
                                    const isCurrent = i + 1 === currentQuarter;
                                    return (
                                        <div key={q.quarter} className={`flex items-center justify-between p-3 rounded-lg ${isCurrent ? 'bg-indigo-50 border border-indigo-200' : isPast ? 'bg-slate-50 opacity-60' : 'bg-slate-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isCurrent ? 'bg-indigo-600 text-white' : isPast ? 'bg-slate-300 text-slate-600' : 'bg-slate-200 text-slate-600'}`}>
                                                    {q.quarter}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{q.deadline}</div>
                                                    <div className="text-xs text-slate-500">{q.period}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {isPast ? (
                                                    <span className="text-slate-400 text-sm">Past</span>
                                                ) : (
                                                    <span className="font-semibold text-slate-900">{formatCurrency(result.remainingPayment)}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
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
                                Who needs to pay quarterly estimated taxes?
                            </h3>
                            <p className="text-slate-600">
                                Self-employed individuals, freelancers, and anyone who expects to owe $1,000 or more in taxes should pay quarterly estimated taxes.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                                What happens if I miss a payment?
                            </h3>
                            <p className="text-slate-600">
                                The IRS may charge an underpayment penalty. However, you can avoid penalties by paying at least 90% of this year's tax or 100% of last year's tax.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                                How do I pay quarterly taxes?
                            </h3>
                            <p className="text-slate-600">
                                You can pay online at IRS.gov/payments, by phone, or by mail using Form 1040-ES vouchers.
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
                                name: "Who needs to pay quarterly estimated taxes?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Self-employed individuals, freelancers, and anyone who expects to owe $1,000 or more in taxes should pay quarterly estimated taxes.",
                                },
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}
