// ============================================
// INJURY-CALC SITE CONFIGURATION
// Personal Injury Settlement Calculator
// 2025 data - easy yearly updates
// ============================================

import { Scale, FileText, Shield, Calculator, Stethoscope, Car } from 'lucide-react';

// ============================================
// SITE METADATA
// ============================================
export const SITE = {
    name: "Injury Settlement Calculator",
    tagline: "Free Settlement Estimator",
    description: "Calculate the value of your personal injury settlement. Free 2025 calculator for car accidents, slip and fall, medical malpractice, and more.",
    year: 2025,
    baseUrl: "https://injury-calc.vercel.app",
};

// ============================================
// 2025 INJURY SETTLEMENT CONSTANTS
// Sources: Insurance industry data, Legal databases, Settlement reports
// ============================================
export const INJURY_CONSTANTS_2025 = {
    // Pain & Suffering Multipliers by Injury Severity
    multipliers: {
        minor: { min: 1.5, max: 3, avg: 2 },      // Soft tissue, bruises, minor whiplash
        moderate: { min: 3, max: 5, avg: 4 },     // Fractures, moderate injuries
        severe: { min: 5, max: 10, avg: 7 },      // Surgery required, long recovery
        catastrophic: { min: 10, max: 25, avg: 15 }, // Permanent disability, TBI, paralysis
    },

    // Average Medical Costs by Injury Type (2025)
    avgMedicalCosts: {
        whiplash: { min: 2500, max: 10000 },
        brokenBone: { min: 5000, max: 50000 },
        backInjury: { min: 10000, max: 150000 },
        tbi: { min: 50000, max: 500000 },
        spinalCord: { min: 100000, max: 1000000 },
        softTissue: { min: 1000, max: 5000 },
    },

    // Average Settlements by Case Type (2025)
    avgSettlements: {
        carAccident: { min: 15000, max: 75000, avg: 35000 },
        slipAndFall: { min: 10000, max: 50000, avg: 25000 },
        medicalMalpractice: { min: 50000, max: 500000, avg: 150000 },
        workplaceInjury: { min: 20000, max: 100000, avg: 45000 },
        productLiability: { min: 25000, max: 250000, avg: 75000 },
        dogBite: { min: 15000, max: 50000, avg: 30000 },
    },

    // Attorney Fees (Contingency)
    attorneyFees: {
        preSettlement: 0.33,  // 33% if settled before trial
        postTrial: 0.40,      // 40% if goes to trial
    },

    // Average Daily Wage (US)
    avgDailyWage: 220,

    // Medical Lien (typical percentage)
    medicalLienPercent: 0.30,  // 30% of settlement for medical liens
} as const;

// ============================================
// INJURY TYPES DATA
// ============================================
export const INJURY_TYPES = {
    whiplash: {
        name: "Whiplash",
        severity: "minor",
        avgSettlement: { min: 10000, max: 30000 },
        recoveryTime: "2-6 weeks",
        description: "Neck strain from sudden movement, common in rear-end collisions",
    },
    brokenBone: {
        name: "Broken Bone / Fracture",
        severity: "moderate",
        avgSettlement: { min: 25000, max: 100000 },
        recoveryTime: "6-12 weeks",
        description: "Bone fracture requiring cast, splint, or surgery",
    },
    backInjury: {
        name: "Back / Spine Injury",
        severity: "severe",
        avgSettlement: { min: 50000, max: 250000 },
        recoveryTime: "3-12 months",
        description: "Herniated disc, spinal damage, or chronic back pain",
    },
    tbi: {
        name: "Traumatic Brain Injury (TBI)",
        severity: "catastrophic",
        avgSettlement: { min: 100000, max: 1000000 },
        recoveryTime: "Months to permanent",
        description: "Concussion, brain damage, cognitive impairment",
    },
    spinalCord: {
        name: "Spinal Cord Injury",
        severity: "catastrophic",
        avgSettlement: { min: 500000, max: 5000000 },
        recoveryTime: "Permanent",
        description: "Paralysis, loss of motor function",
    },
    softTissue: {
        name: "Soft Tissue Injury",
        severity: "minor",
        avgSettlement: { min: 5000, max: 20000 },
        recoveryTime: "1-4 weeks",
        description: "Bruises, sprains, strains, minor cuts",
    },
    burns: {
        name: "Burns",
        severity: "severe",
        avgSettlement: { min: 30000, max: 200000 },
        recoveryTime: "Weeks to months",
        description: "First, second, or third-degree burns",
    },
    internalInjury: {
        name: "Internal Injuries",
        severity: "severe",
        avgSettlement: { min: 75000, max: 300000 },
        recoveryTime: "1-6 months",
        description: "Organ damage, internal bleeding",
    },
} as const;

// ============================================
// CALCULATOR DEFINITIONS
// ============================================
export const CALCULATORS = [
    {
        id: "injury-settlement",
        name: "Settlement Calculator",
        shortName: "Settlement",
        description: "Calculate your personal injury settlement value",
        longDescription: "Free 2025 personal injury settlement calculator. Estimate your compensation based on medical bills, lost wages, and pain & suffering.",
        icon: Calculator,
        category: "legal",
        keywords: ["personal injury calculator", "settlement calculator", "injury compensation", "car accident settlement"],
        featured: true,
    },
    {
        id: "injury-types",
        name: "Injury Value Guide",
        shortName: "Injury Guide",
        description: "Average settlements by injury type",
        longDescription: "See average settlement values for different injury types including whiplash, broken bones, TBI, and more.",
        icon: Stethoscope,
        category: "legal",
        keywords: ["injury settlement amounts", "whiplash settlement", "broken bone settlement", "TBI settlement"],
        featured: true,
    },
    {
        id: "insurance-claim",
        name: "Insurance Claim Calculator",
        shortName: "Claim Value",
        description: "Calculate your insurance claim value",
        longDescription: "Estimate the value of your insurance claim for car accidents, property damage, and bodily injury.",
        icon: Shield,
        category: "insurance",
        keywords: ["insurance claim calculator", "car accident claim", "bodily injury claim", "property damage claim"],
        featured: false,
    },
    {
        id: "car-accident",
        name: "Car Accident Calculator",
        shortName: "Car Accident",
        description: "Calculate your car accident settlement value",
        longDescription: "Free 2025 car accident settlement calculator. Estimate compensation for vehicle damage, injuries, and pain & suffering.",
        icon: Car,
        category: "legal",
        keywords: ["car accident calculator", "auto accident settlement", "car crash compensation", "vehicle accident claim"],
        featured: true,
    },
] as const;

// ============================================
// SETTLEMENT CALCULATION FUNCTION
// ============================================
export interface SettlementResult {
    medicalExpenses: number;
    lostWages: number;
    painSufferingMultiplier: number;
    painSufferingAmount: number;
    totalBeforeFees: number;
    attorneyFees: number;
    netSettlement: number;
    settlementRange: { min: number; max: number };
}

export function calculateSettlement(
    medicalExpenses: number,
    lostWages: number,
    severity: 'minor' | 'moderate' | 'severe' | 'catastrophic',
    hasAttorney: boolean = true
): SettlementResult {
    const multipliers = INJURY_CONSTANTS_2025.multipliers[severity];

    // Economic damages
    const economicDamages = medicalExpenses + lostWages;

    // Pain & suffering (using average multiplier)
    const painSufferingMultiplier = multipliers.avg;
    const painSufferingAmount = Math.round(medicalExpenses * painSufferingMultiplier);

    // Total before fees
    const totalBeforeFees = economicDamages + painSufferingAmount;

    // Attorney fees (if applicable)
    const attorneyFees = hasAttorney
        ? Math.round(totalBeforeFees * INJURY_CONSTANTS_2025.attorneyFees.preSettlement)
        : 0;

    // Net settlement
    const netSettlement = totalBeforeFees - attorneyFees;

    // Calculate range using min/max multipliers
    const minTotal = economicDamages + (medicalExpenses * multipliers.min);
    const maxTotal = economicDamages + (medicalExpenses * multipliers.max);

    return {
        medicalExpenses,
        lostWages,
        painSufferingMultiplier,
        painSufferingAmount,
        totalBeforeFees,
        attorneyFees,
        netSettlement,
        settlementRange: {
            min: Math.round(hasAttorney ? minTotal * 0.67 : minTotal),
            max: Math.round(hasAttorney ? maxTotal * 0.67 : maxTotal),
        },
    };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function parseFormattedNumber(value: string): number {
    return parseInt(value.replace(/[^0-9]/g, '')) || 0;
}

export function getSeverityLabel(severity: string): string {
    const labels: Record<string, string> = {
        minor: "Minor Injury",
        moderate: "Moderate Injury",
        severe: "Severe Injury",
        catastrophic: "Catastrophic Injury",
    };
    return labels[severity] || severity;
}

export function getSeverityColor(severity: string): string {
    const colors: Record<string, string> = {
        minor: "text-green-400",
        moderate: "text-yellow-400",
        severe: "text-orange-400",
        catastrophic: "text-red-400",
    };
    return colors[severity] || "text-slate-400";
}
