export async function fetchWeatherData() {
  // console.log("fetching data");
  const key = import.meta.env.VITE_REACT_APP_WEATHER_API_KEY;
  const apiUrl = `https://api.weatherbit.io/v2.0/current?lat=59.9342802&lon=30.3350986&key=${key}`;
  try {
    const response = await fetch(apiUrl);
    const parsedData = await response.json();
    localStorage.setItem(
      "dd-weather",
      JSON.stringify({
        dateCreated: Date.now(),
        data: parsedData,
      })
    );
    return parsedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
