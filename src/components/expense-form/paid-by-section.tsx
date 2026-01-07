import {
  useFormContext,
  useController,
  Control,
  FieldValues,
  Path,
  useWatch,
} from "react-hook-form";
import { TabbedFormSection } from "@/components/shared/form/tabbed-form-section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import AllocationList from "@/components/expense-form/allocation-list";

const members = [
  { memberId: "aaa", name: "AAA", amount: 0 },
  { memberId: "bbb", name: "BBB", amount: 0 },
  { memberId: "ccc", name: "CCC", amount: 0 },
];

interface PaidBySectionProps<T extends FieldValues> {
  name: Path<T>;
  currentAmount: number;
}

export function PaidBySection<T extends FieldValues>({
  name,
  currentAmount,
}: PaidBySectionProps<T>) {
  const { control, setValue, getValues, watch } = useFormContext();

  console.log("currentAmount", currentAmount);

  const paidByMode = watch("paidByMode") || "single";

  const handleToggle = (newMode: string) => {
    setValue("paidByMode", newMode);
  };

  return (
    <TabbedFormSection
      label="Paid By"
      value={paidByMode}
      onValueChange={(val) => {
        handleToggle(val);
        setValue("paidBy", []);
      }}
      options={[
        {
          value: "single",
          label: "Single Payer",
          content: (
            <Select onValueChange={(val) => {}}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select Payer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="you">You</SelectItem>
                <SelectSeparator />
                {members.map((member) => (
                  <SelectItem key={member.memberId} value={member.memberId}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ),
        },
        {
          value: "multiple",
          label: "Multiple Payers",
          content: (
            <div className="p-4 border border-dashed rounded-lg bg-gray-50 text-center text-sm text-gray-500">
              <AllocationList amount={currentAmount} />
            </div>
          ),
        },
      ]}
    />
  );
}
