"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlassInput } from "@/components/ui/glass";
import { ArrowRightLeft, Percent, DollarSign, Calculator, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Currency {
  code: string;
  symbol: string;
  rate: number; // Rate to IDR
  flag: string;
}

const currencies: Currency[] = [
  { code: "USD", symbol: "$", rate: 15500, flag: "🇺🇸" },
  { code: "EUR", symbol: "€", rate: 16800, flag: "🇪🇺" },
  { code: "JPY", symbol: "¥", rate: 105, flag: "🇯🇵" },
  { code: "KRW", symbol: "₩", rate: 11, flag: "🇰🇷" },
  { code: "SGD", symbol: "S$", rate: 11500, flag: "🇸🇬" },
  { code: "CNY", symbol: "¥", rate: 2150, flag: "🇨🇳" },
  { code: "GBP", symbol: "£", rate: 19500, flag: "🇬🇧" },
  { code: "AUD", symbol: "A$", rate: 10000, flag: "🇦🇺" },
];

interface PriceEstimatorProps {
  className?: string;
  defaultJastipFee?: number;
  defaultTax?: number;
}

export function PriceEstimator({ className, defaultJastipFee = 15, defaultTax = 10 }: PriceEstimatorProps) {
  const [amount, setAmount] = useState<string>("");
  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[0]);
  const [jastipFee, setJastipFee] = useState(defaultJastipFee);
  const [tax, setTax] = useState(defaultTax);
  const [isCalculating, setIsCalculating] = useState(false);

  const baseAmount = parseFloat(amount) || 0;
  const convertedAmount = baseAmount * fromCurrency.rate;
  const feeAmount = convertedAmount * (jastipFee / 100);
  const taxAmount = convertedAmount * (tax / 100);
  const totalAmount = convertedAmount + feeAmount + taxAmount;

  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => setIsCalculating(false), 300);
    return () => clearTimeout(timer);
  }, [amount, fromCurrency, jastipFee, tax]);

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatForeign = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: fromCurrency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      {/* Header */}
      <div className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Price Estimator</h3>
              <p className="text-sm text-muted-foreground">Calculate total cost including fees</p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Estimate includes product price, jastip fee, and import tax</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Fixed Total Display - Always Visible */}
      <div className="flex-shrink-0 mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/15 to-orange-500/15 border border-primary/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Estimated Total</span>
            <motion.span
              key={totalAmount}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent"
            >
              {formatIDR(totalAmount)}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left Column - Inputs */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 -mr-1">
          {/* Currency Input */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <GlassInput
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  icon={<DollarSign className="h-4 w-4" />}
                  label="Product Price"
                />
              </div>
              <div className="w-28">
                <label className="text-xs font-medium text-foreground mb-1.5 block">Currency</label>
                <select
                  value={fromCurrency.code}
                  onChange={(e) => setFromCurrency(currencies.find((c) => c.code === e.target.value) || currencies[0])}
                  className="w-full px-3 py-2.5 rounded-xl bg-card/60 backdrop-blur-xl border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer transition-all duration-300 text-sm"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Exchange Rate Display */}
            {amount && (
              <div className="p-2.5 rounded-xl bg-muted/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  Exchange Rate
                </span>
                <span className="font-medium">
                  1 {fromCurrency.code} = Rp {fromCurrency.rate.toLocaleString("id-ID")}
                </span>
              </div>
            )}
          </div>

          {/* Fee Sliders */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium flex items-center gap-1.5">
                  <Percent className="h-3.5 w-3.5 text-primary" />
                  Jastip Fee
                </label>
                <span className="text-xs font-bold text-primary">{jastipFee}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={jastipFee}
                onChange={(e) => setJastipFee(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium flex items-center gap-1.5">
                  <Percent className="h-3.5 w-3.5 text-orange-500" />
                  Import Tax
                </label>
                <span className="text-xs font-bold text-orange-500">{tax}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>

          {/* Original Amount */}
          {baseAmount > 0 && (
            <p className="text-center text-xs text-muted-foreground pt-1">
              Original: {formatForeign(baseAmount)}
            </p>
          )}
        </div>

        {/* Right Column - Cost Breakdown (Always Visible) */}
        <div className="w-44 flex-shrink-0">
          <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 h-full">
            <h4 className="text-xs font-semibold mb-2.5 pb-2 border-b">Cost Breakdown</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product Price</span>
                <span className="font-medium text-right">{formatIDR(convertedAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jastip Fee ({jastipFee}%)</span>
                <span className="font-medium text-right">{formatIDR(feeAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Import Tax ({tax}%)</span>
                <span className="font-medium text-right">{formatIDR(taxAmount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold text-xs">
                <span>Total</span>
                <span className="text-primary text-right">{formatIDR(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
