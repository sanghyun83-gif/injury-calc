"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, Calculator, Info } from "lucide-react";
import {
    SITE,
    SE_TAX_2025,
    TAX_BRACKETS_2025,
    formatCurrency,
    parseFormattedNumber,
} from "../site-config";

// Pay frequencies
const PAY_FREQUENCIES = [
    { id: "weekly", label: "Weekly", periods: 52 },
    { id: "biweekly", label: "Bi-weekly", periods: 26 },
    { id: "semimonthly", label: "Semi-monthly", periods: 24 },
    { id: "monthly", label: "Monthly", periods: 12 },
];

// W2 FICA rates (employee portion)
const W2_FICA = {
    socialSecurityRate: 0.062,
    medicareRate: 0.0145,
    additionalMedicareRate: 0.009,
    additionalMedicareThreshold: 200000,
};

function calculatePaycheck(annualSalary: number, payPeriods: number) {
    const grossPayPerPeriod = annualSalary / payPeriods;

    const annualSS = Math.min(annualSalary, SE_TAX_2025.socialSecurityLimit) * W2_FICA.socialSecurityRate;
    const annualMedicare = annualSalary * W2_FICA.medicareRate;
    const annualAdditionalMedicare = annualSalary > W2_FICA.additionalMedicareThreshold
        ? (annualSalary - W2_FICA.additionalMedicareThreshold) * W2_FICA.additionalMedicareRate
        : 0;
    const annualFICA = annualSS + annualMedicare + annualAdditionalMedicare;

    const ficaPerPeriod = annualFICA / payPeriods;
    const ssPerPeriod = annualSS / payPeriods;
    const medicarePerPeriod = (annualMedicare + annualAdditionalMedicare) / payPeriods;

    const taxableIncome = Math.max(0, annualSalary - SE_TAX_2025.standardDeduction);
    let annualFederalTax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of TAX_BRACKETS_2025) {
        if (remainingIncome <= 0) break;
        const bracketWidth = bracket.max - bracket.min;
        const taxableInBracket = Math.min(remainingIncome, bracketWidth);
        annualFederalTax += taxableInBracket * bracket.rate;
        remainingIncome -= taxableInBracket;
    }

    const federalTaxPerPeriod = annualFederalTax / payPeriods;
    const totalDeductions = ficaPerPeriod + federalTaxPerPeriod;
    const netPay = grossPayPerPeriod - totalDeductions;

    return {
        grossPay: Math.round(grossPayPerPeriod * 100) / 100,
        socialSecurity: Math.round(ssPerPeriod * 100) / 100,
        medicare: Math.round(medicarePerPeriod * 100) / 100,
        federalTax: Math.round(federalTaxPerPeriod * 100) / 100,
        totalDeductions: Math.round(totalDeductions * 100) / 100,
        netPay: Math.round(netPay * 100) / 100,
        annualGross: annualSalary,
        annualNet: Math.round(netPay * payPeriods),
        effectiveRate: ((annualFederalTax + annualFICA) / annualSalary * 100).toFixed(1),
    };
}

export default function PaycheckPage() {
    const [salary, setSalary] = useState("");
    const [frequency, setFrequency] = useState("biweekly");
    const [result, setResult] = useState<ReturnType<typeof calculatePaycheck> | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        if (raw === "") {
            setSalary("");
            return;
        }
        setSalary(parseInt(raw).toLocaleString("en-US"));
    };

    const handleCalculate = () => {
        const amount = parseFormattedNumber(salary);
        const freq = PAY_FREQUENCIES.find(f => f.id === frequency);
        if (amount > 0 && freq) {
            setResult(calculatePaycheck(amount, freq.periods));
        }
    };

    const selectedFrequency = PAY_FREQUENCIES.find(f => f.id === frequency);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-indigo-600" />
                        <span className="text-lg font-bold text-slate-900">Paycheck Calculator</span>
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
                        {SITE.year} Paycheck Calculator
                    </h1>
                    <p className="text-sm text-slate-500 mb-6">
                        Calculate your net pay after federal taxes and FICA
                    </p>

                    {/* Inputs */}
                    <div className="space-y-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Annual Salary
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                                <input
                                    type="text"
                                    value={salary}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                                    placeholder="75,000"
                                    className="w-full pl-8 pr-4 py-4 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Pay Frequency
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {PAY_FREQUENCIES.map((freq) => (
                                    <button
                                        key={freq.id}
                                        type="button"
                                        onClick={() => setFrequency(freq.id)}
                                        className={`py-3 px-4 rounded-lg border font-medium transition ${frequency === freq.id
                                                ? "bg-indigo-600 text-white border-indigo-600"
                                                : "bg-white text-slate-700 border-slate-300 hover:border-indigo-300"
                                            }`}
                                    >
                                        {freq.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                                {selectedFrequency?.periods} pay periods per year
                            </p>
                        </div>
                    </div>

                    {/* Calculate Button */}
                    <button
                        onClick={handleCalculate}
                        disabled={!salary}
                        className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        <Calculator className="w-5 h-5" />
                        Calculate Paycheck
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Summary Header */}
                        <div className="bg-indigo-600 text-white p-6">
                            <p className="text-sm text-indigo-200 mb-1">Your {selectedFrequency?.label} Take-Home Pay</p>
                            <p className="text-4xl font-bold">${result.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <p className="text-sm text-indigo-200 mt-2">
                                {result.effectiveRate}% effective tax rate • {formatCurrency(result.annualNet)}/year
                            </p>
                        </div>

                        {/* Net Pay Highlight */}
                        <div className="p-4 bg-emerald-50 border-b border-emerald-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-800">Annual Net Income</p>
                                    <p className="text-xs text-emerald-600">{selectedFrequency?.periods} paychecks × ${result.netPay.toFixed(2)}</p>
                                </div>
                                <p className="text-2xl font-bold text-emerald-700">{formatCurrency(result.annualNet)}</p>
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="p-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                Paycheck Breakdown
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between pb-3 border-b border-slate-100">
                                    <span className="text-slate-600">Gross Pay</span>
                                    <span className="font-medium text-slate-900">${result.grossPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between pb-3 border-b border-slate-100">
                                    <span className="text-slate-600">Social Security (6.2%)</span>
                                    <span className="text-red-600">-${result.socialSecurity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between pb-3 border-b border-slate-100">
                                    <span className="text-slate-600">Medicare (1.45%)</span>
                                    <span className="text-red-600">-${result.medicare.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between pb-3 border-b border-slate-100">
                                    <span className="text-slate-600">Federal Income Tax</span>
                                    <span className="text-red-600">-${result.federalTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between pt-2 font-bold text-lg">
                                    <span className="text-slate-900">Net Pay</span>
                                    <span className="text-emerald-600">${result.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
                                What taxes are taken out of my paycheck?
                            </h3>
                            <p className="text-slate-600">
                                Federal income tax, Social Security (6.2%), and Medicare (1.45%). State and local taxes vary by location.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                                Why is my actual paycheck different?
                            </h3>
                            <p className="text-slate-600">
                                This calculator estimates federal taxes only. Your actual paycheck may include state taxes, health insurance, 401(k) contributions, and other deductions.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                                What is the standard deduction for {SITE.year}?
                            </h3>
                            <p className="text-slate-600">
                                The {SITE.year} standard deduction for single filers is ${SE_TAX_2025.standardDeduction.toLocaleString()}.
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
                                name: "What taxes are taken out of my paycheck?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Federal income tax, Social Security (6.2%), and Medicare (1.45%). State and local taxes vary by location.",
                                },
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}
