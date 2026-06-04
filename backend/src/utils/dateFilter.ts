export interface DateRange {
  start: Date;
  end: Date;
}

const getDateRange = (range: string): DateRange => {
  const now = new Date();
  let start: Date;

  switch (range) {
    case "daily":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "weekly": {
      const firstDayOfWeek = now.getDate() - now.getDay();
      start = new Date(now.setDate(firstDayOfWeek));
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "yearly":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1); // fallback to monthly
  }

  // Set default hours for range start
  start.setHours(0, 0, 0, 0);

  return { start, end: new Date() };
};

export default getDateRange;
