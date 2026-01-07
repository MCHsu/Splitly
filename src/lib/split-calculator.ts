export type SplitMethod = "EQUAL" | "PERCENTAGE" | "SHARES" | "EXACT";

export interface SplitResult {
  amounts: number[];
  remainder: number;
}

/**
 * Calculate split amounts based on the method.
 * @param method - The split method ("EQUAL", "PERCENTAGE", "SHARES").
 * @param amount - The total amount to split.
 * @param values - Additional values (e.g., percentages or shares).
 * @returns SplitResult containing amounts and remainder.
 */
export const calculateSplit = (
  method: SplitMethod,
  amount: number,
  values: number[]
): SplitResult => {
  if (amount <= 0 || values.length === 0) {
    return { amounts: [], remainder: 0 };
  }

  const totalAmount = Math.round(amount * 100); // Convert to cents for precision

  switch (method) {
    // case "EQUAL": {
    //   const numberOfPeople = values.length;
    //   const equalAmount = Math.floor(totalAmount / numberOfPeople);
    //   const remainder = totalAmount - equalAmount * (numberOfPeople - 1);

    //   return {
    //     amounts: equalAmount / 100,
    //     remainder: remainder / 100,
    //   };
    // }

    case "PERCENTAGE": {
      const totalPercentage = values.reduce((sum, p) => sum + p, 0);
      const amounts = values.map(
        (p) => Math.round((totalAmount * p) / totalPercentage) / 100
      );
      const distributed = amounts.reduce((sum, a) => sum + a, 0);
      const remainder = amount - distributed;

      return { amounts, remainder };
    }

    case "EQUAL":
    case "SHARES": {
      const totalShares = values.reduce((sum, s) => sum + s, 0);
      const amounts = values.map(
        (s) => Math.round((totalAmount * s) / totalShares) / 100
      );
      const distributed = amounts.reduce((sum, a) => sum + a, 0);
      const remainder = amount - distributed;

      return { amounts, remainder };
    }

    default:
      return { amounts: [], remainder: 0 };
  }
};

// interface SplitResult {
//     equalAmount: number;
//     remainder: number;
//   }

//   const getEqualSplitAmount = (
//     amount: number,
//     numberOfPeople: number
//   ): SplitResult => {
//     if (numberOfPeople <= 0) return { equalAmount: 0, remainder: 0 };

//     const totalAmount = Math.round(amount * 100);
//     const equalAmount = Math.floor(totalAmount / numberOfPeople);
//     const remainder = totalAmount - equalAmount * (numberOfPeople - 1);

//     return {
//       equalAmount: equalAmount / 100,
//       remainder: remainder / 100,
//     };
//   };
