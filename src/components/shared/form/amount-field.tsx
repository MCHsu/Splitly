"use client";

import { useMemo } from "react";
import { FieldValues, Path } from "react-hook-form";
import { NumericFormat } from "react-number-format";

import { ControlledField } from "@/components/shared/form/controlled-field";
import { BaseInput } from "@/components/shared/form/base-input";
import { InputGroupText } from "@/components/ui/input-group";
import {
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  MONEY_DECIMAL_PLACES,
} from "@/lib/money";

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
  const { symbol, thousandSep, decimalSep } = useMemo(() => {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    });

    // Intentional: format a number with group + fraction so Intl yields separators
    const parts = formatter.formatToParts(1234.56);

    const groupPart = parts.find((p) => p.type === "group");
    const decimalPart = parts.find((p) => p.type === "decimal");
    const currencyPart = parts.find((p) => p.type === "currency");

    return {
      symbol: currencyPart ? currencyPart.value : "$",
      thousandSep: groupPart ? groupPart.value : ",",
      // Currencies without a fraction part (e.g. JPY) may omit decimal; default "."
      decimalSep: decimalPart ? decimalPart.value : ".",
    };
  }, [currencyCode, locale]);

  const CurrencyInput = useMemo(() => {
    function CurrencyInput(inputProps: React.ComponentProps<typeof BaseInput>) {
      return (
        <BaseInput
          {...inputProps}
          className="tabular-nums"
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
          decimalScale={MONEY_DECIMAL_PLACES}
          allowNegative={false}
          value={value ?? ""}
          onValueChange={(values) => {
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
