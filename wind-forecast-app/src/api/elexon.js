/**
 * BMRS dataset clients for the wind forecast challenge.
 * Docs: bmrs.elexon.co.uk → FUELHH (actuals), WINDFOR (forecasts).
 */
const BASE_URL = 'https://data.elexon.co.uk/bmrs/api/v1/datasets';

function toDateStr(date) {
  return date.toISOString().split('T')[0];
}

const isAfterJan2025 = (dateString) =>
  new Date(dateString).getTime() >= new Date('2025-01-01T00:00:00Z').getTime();

/** FUELHH / WIND: settlementDate range + client filter to [start, end], Jan 2025+ targets. */
export async function fetchActualWindGeneration(start, end) {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const settlementFrom = toDateStr(startDate);
    const settlementTo = toDateStr(endDate);

    const url = `${BASE_URL}/FUELHH/stream?settlementDateFrom=${settlementFrom}&settlementDateTo=${settlementTo}&fuelType=WIND`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();

    return data
      .filter(item => {
        if (item.fuelType !== 'WIND') return false;
        if (!isAfterJan2025(item.startTime)) return false;
        const t = new Date(item.startTime).getTime();
        return t >= startMs && t <= endMs;
      })
      .map(item => ({
        targetTime: item.startTime,
        actualGeneration: item.generation
      }));
  } catch (error) {
    console.error("Error fetching actual generation:", error);
    return [];
  }
}

/**
 * WINDFOR: filters to [start,end] targets, Jan 2025+, lead time 0–48h.
 * Public stream typically returns recent batches—historical replay may need a scripting token.
 */
export async function fetchForecastWindGeneration(start, end) {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // The endpoint ignores any date params, always returning the latest batch.
    // We still pass publishTime params in case future API updates honor them.
    const publishFrom = new Date(startDate.getTime() - 48 * 60 * 60 * 1000).toISOString();
    const publishTo = endDate.toISOString();

    const url = `${BASE_URL}/WINDFOR/stream?publishTimeFrom=${publishFrom}&publishTimeTo=${publishTo}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();

    return data
      .filter(item => {
        if (!isAfterJan2025(item.startTime)) return false;
        const t = new Date(item.startTime).getTime();
        const p = new Date(item.publishTime).getTime();
        if (t < startMs || t > endMs) return false;
        // Challenge: only use forecasts with lead time (target − publish) in [0, 48] hours
        const leadHours = (t - p) / (1000 * 60 * 60);
        return leadHours >= 0 && leadHours <= 48;
      })
      .map(item => ({
        targetTime: item.startTime,
        publishTime: item.publishTime,
        forecastedGeneration: item.generation
      }));
  } catch (error) {
    console.error("Error fetching forecast generation:", error);
    return [];
  }
}
