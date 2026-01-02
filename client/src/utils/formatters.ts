
export const getInitials = (name: string): string => {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "CN"
  );
};

export const getTimeAgo = (dateString: string): string => {
  if (!dateString) return "Recent";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getString = (val: unknown): string | undefined =>
  typeof val === "string" ? val : undefined;

export const getNumber = (val: unknown): number | undefined =>
  typeof val === "number" ? val : undefined;

export const getStringArray = (val: unknown): string[] | undefined =>
  Array.isArray(val) && val.every((v) => typeof v === "string")
    ? (val as string[])
    : undefined;

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch {
    return dateString;
  }
};

export const formatPeriod = (startDate: string, endDate?: string, isCurrent?: boolean): string => {
  const start = formatDate(startDate);
  if (isCurrent) {
    return `${start} - Present`;
  }
  if (endDate) {
    const end = formatDate(endDate);
    return `${start} - ${end}`;
  }
  return start;
};
