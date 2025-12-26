export const formatCurrency = (value: number | string): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("id-ID").format(num);
};

export const maskBalance = (
  value: number | string,
  isVisible: boolean,
  maskAmount?: number
): string => {
  if (isVisible) return formatCurrency(value);

  const dot = "●";
  if (maskAmount !== undefined) {
    return dot.repeat(maskAmount);
  }

  const formattedStr = formatCurrency(value);
  return dot.repeat(formattedStr.length);
};

export const convertDate = (date: string): string => {
  const currentDate = new Date(date);
  const localTime = currentDate.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "long",
    timeStyle: "short",
  });
  return localTime.replace("pukul ", "");
};
