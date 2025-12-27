import { CreditCard } from "lucide-react";
import Input from "../Input";
import Button from "../Button";
import { nominalTopUp } from "../../utils/constant";
import clsx from "clsx";
import { formatCurrency, maskBalance } from "../../utils";

const InputNominal = ({
  nominal,
  onChange,
  onSubmit,
  withSuggestion = false,
  readOnly,
  buttonText = "Top Up",
}: {
  nominal?: number;
  onChange?: (e: number) => void;
  onSubmit?: () => void;
  withSuggestion?: boolean;
  readOnly?: boolean;
  buttonText?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replaceAll(".", ""));
    onChange?.(value);
  };
  return (
    <div className="flex flex-wrap gap-5 justify-between mx-auto">
      <div className="flex flex-col gap-2 grow shrink">
        <Input
          value={nominal ? formatCurrency(nominal) : ""}
          onChange={handleChange}
          placeholder="Masukan Nominal Top Up"
          prefix={<CreditCard height={15} width={15} />}
          readOnly={readOnly}
        />
        <Button variant="danger" disabled={!nominal} onClick={onSubmit}>
          {buttonText}
        </Button>
      </div>
      {withSuggestion && (
        <div className="grow shrink max-md:w-full">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2">
            {nominalTopUp.map((amount) => {
              return (
                <div
                  className={clsx(
                    "flex flex-col gap-2 text-center min-w-20 w-full items-center",
                    "hover:bg-gray-100 duration-300 transition-all cursor-pointer p-2.5",
                    "border border-gray-200 rounded-lg min-h-[42px]"
                  )}
                  key={amount}
                  onClick={() => {
                    onChange?.(amount);
                  }}
                >
                  <p className="text-xs font-semibold text-gray-600 wrap-anywhere">
                    Rp {maskBalance(amount, true)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputNominal;
