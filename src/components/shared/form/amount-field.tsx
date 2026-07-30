"use client";

import { useMemo } from "react";
import { FieldValues, Path } from "react-hook-form";
import { NumericFormat } from "react-number-format";

import { ControlledField } from "@/components/shared/form/controlled-field";
import { BaseInput } from "@/components/shared/form/base-input";
import { InputGroupText } from "@/components/ui/input-group";
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from "@/lib/money";

interface AmountFieldProps<T extends FieldValues> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "label" | "defaultValue" | "type" | "value"
> {
  name: Path<T>;
  label?: string;
  currencyCode?: string;
  locale?: string;
  handleOnBlur?: () => void;
  handleOnFocus?: () => void;
}

export function AmountField<T extends FieldValues>({
  name,
  label,
  currencyCode = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE,
  handleOnBlur = () => {},
  handleOnFocus = () => {},
  ...props
}: AmountFieldProps<T>) {
  const { symbol, decimals, thousandSep, decimalSep } = useMemo(() => {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    });

    // 取得小數限制 (例如 JPY 是 0，EUR 是 2)
    const decimals = formatter.resolvedOptions().maximumFractionDigits ?? 0;

    // 故意丟一個有千分位又有小數的數字進去，讓 Intl 幫我們拆解格式
    const parts = formatter.formatToParts(1234.56);

    const groupPart = parts.find((p) => p.type === "group"); // 千分位
    const decimalPart = parts.find((p) => p.type === "decimal"); // 小數點
    const currencyPart = parts.find((p) => p.type === "currency"); // 幣別符號

    return {
      decimals,
      symbol: currencyPart ? currencyPart.value : "$",
      thousandSep: groupPart ? groupPart.value : ",",
      // 如果該幣別沒有小數 (如 JPY)，找不到 decimalPart 時退回預設 "."
      decimalSep: decimalPart ? decimalPart.value : ".",
    };
  }, [currencyCode, locale]);

  const CurrencyInput = useMemo(() => {
    function CurrencyInput(inputProps: React.ComponentProps<typeof BaseInput>) {
      return (
        <BaseInput
          {...inputProps}
          prefix={<InputGroupText>{symbol}</InputGroupText>}
        />
      );
    }
    CurrencyInput.displayName = "CurrencyInput";
    return CurrencyInput;
  }, [symbol]);

  return (
    <ControlledField name={name} label={label}>
      {({ value, onChange, onBlur }) => (
        <NumericFormat
          {...props}
          customInput={CurrencyInput}
          type="text"
          thousandSeparator={thousandSep}
          decimalSeparator={decimalSep}
          decimalScale={decimals}
          allowNegative={false}
          value={value ?? ""}
          onValueChange={(values) => {
            // values 會提供三種格式，例如輸入 "1,234.50" 時：
            // formattedValue: "1,234.50" (帶逗號的字串)
            // value: "1234.50" (不帶逗號的字串)
            // floatValue: 1234.5 (純數字 Number)

            // 直接把「純字串數字」存進表單，省去 parseNumber 的麻煩！
            // 存字串的好處是可以保留結尾的浮點小數點 (例如 "10.")，讓使用者順暢輸入
            onChange(values.value);
          }}
          onBlur={() => {
            onBlur();
            handleOnBlur();
          }}
          onFocus={handleOnFocus}
        />
      )}
    </ControlledField>
  );
}
