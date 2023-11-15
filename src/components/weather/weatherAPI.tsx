import { dataType } from "./WeatherApp";

let weatherData: Promise<dataType>;

async function fetchData() {
  const key = import.meta.env.VITE_REACT_APP_WEATHER_API_KEY;
  const apiUrl = `https://api.weatherbit.io/v2.0/current?lat=59.9342802&lon=30.3350986&key=${key}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getWeatherData() {
  if (!weatherData) {
    weatherData = fetchData();
  }
  return weatherData;
}

export function startFetchingInterval() {
  setInterval(async () => {
    try {
      const newData = await fetchData();
      weatherData = newData;
    } catch (error) {
      console.error("Error fetching data from startFetchingInterval", error);
    }
  }, 5 * 60 * 60 * 1000);
}
