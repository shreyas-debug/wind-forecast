// src/api/elexon.js

const BASE_URL = 'https://data.elexon.co.uk/bmrs/api/v1/datasets';

/**
 * Validates if a date is on or after January 1st, 2025.
 * @param {string} dateString ISO datetime string
 * @returns {boolean}
 */
const isAfterJan2025 = (dateString) => {
  const jan2025 = new Date('2025-01-01T00:00:00Z').getTime();
  const targetDate = new Date(dateString).getTime();
  return targetDate >= jan2025;
};

/**
 * Fetches actual wind generation from the FUELHH dataset.
 * Filters exclusively for 'fuelType' === 'WIND'.
 * Returns array of { targetTime, actualGeneration }
 * @param {string} start ISO datetime string
 * @param {string} end ISO datetime string
 */
export async function fetchActualWindGeneration(start, end) {
  try {
    const url = `${BASE_URL}/FUELHH/stream?publishTimeFrom=${start}&publishTimeTo=${end}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    return data
      .filter(item => item.fuelType === 'WIND' && isAfterJan2025(item.startTime))
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
 * Fetches wind generation forecasts from the WINDFOR dataset.
 * Returns array of { targetTime, publishTime, forecastedGeneration }
 * @param {string} start ISO datetime string
 * @param {string} end ISO datetime string
 */
export async function fetchForecastWindGeneration(start, end) {
  try {
    // WINDFOR uses 'startTimeFrom' or 'publishTimeFrom'. Since we want forecasts whose target times
    // (startTime) are within the window, we query by startTime.
    const url = `${BASE_URL}/WINDFOR/stream?startTimeFrom=${start}&startTimeTo=${end}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    return data
      .filter(item => isAfterJan2025(item.startTime))
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
