import { useEffect, useState } from "react";
import Clock from "../clock/Clock";
import Tooltip from "../Tooltip";

type dataItem = {
  dateCreated: number;
  data: {
    app_temp: number;
    aqi: number;
    city_name: string;
    clouds: number;
    country_code: string;
    datetime: string;
    dewpt: number;
    dhi: number;
    dni: number;
    elev_angle: number;
    ghi: number;
    gust: number;
    h_angle: number;
    lat: number;
    lon: number;
    ob_time: string;
    pod: string;
    precip: number;
    pres: number;
    rh: number;
    slp: number;
    snow: number;
    solar_rad: number;
    sources: string[];
    state_code: string;
    station: string;
    sunrise: string;
    sunset: string;
    temp: number;
    timezone: string;
    ts: number;
    uv: number;
    vis: number;
    weather: {
      code: number;
      icon: string;
      description: string;
    };
    wind_cdir: string;
    wind_cdir_full: string;
    wind_dir: number;
    wind_spd: number;
  };
};

export type dataType = {
  count: number;
  data: dataItem[];
};
export default function WeatherApp() {
  const weatherFromLocalStorage = localStorage.getItem("dd-weather");
  const savedWeather = weatherFromLocalStorage
    ? JSON.parse(weatherFromLocalStorage)
    : null;
  const [weatherData, setWeatherData] = useState(savedWeather);

  useEffect(() => {
    function msPassedFromLastWeatherFetch() {
      const currentTime = Date.now();
      return currentTime - weatherData!.dateCreated;
    }

    if (weatherData === null || msPassedFromLastWeatherFetch() >= 7200000) {
      fetchWeatherData();
    }
  }, [weatherData]);

  async function fetchWeatherData() {
    const key = import.meta.env.VITE_REACT_APP_WEATHER_API_KEY;
    const apiUrl = `https://api.weatherbit.io/v2.0/current?lat=59.9342802&lon=30.3350986&key=${key}`;
    try {
      const response = await fetch(apiUrl);
      const parsedData = (await response.json()) as dataType;
      const modifiedData = {
        dateCreated: Date.now(),
        data: parsedData,
      };
      localStorage.setItem("dd-weather", JSON.stringify(modifiedData));
      setWeatherData(modifiedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
  if (weatherData) return <WeatherInfo data={weatherData.data.data[0]} />;
}
function WeatherInfo({ data }: { data: dataItem["data"] }) {
  if (data) {
    const wind = Math.round(data.gust);
    const windDir = data.wind_cdir;
    const humidity = data.rh;
    const pressure = data.pres;
    const clouds = data.clouds;
    return (
      <>
        <div className="heading-and-info">
          <div className="heading-and-clock">
            <div className="title-and-city">
              <h2>Weather</h2>
              <span className="title">in {data.city_name}</span>
            </div>
            <Clock darkMode="" />
          </div>
          <Tooltip
            text={
              "Dynamic weather report based on Weatherbit data and Fetch API"
            }
          />
        </div>
        <div className="stats">
          <div className="main-stats">
            <div className="temp-and-icon">
              <span className="temperature">
                {data.temp > 0 ? "+" : ""}
                {data.temp}℃
              </span>
              <img
                className="icon"
                src={`/img/${data.weather.icon}.png`}
                alt=""
              />
            </div>
            <div className="text">
              <span>{data.weather.description}</span>
              <div className="feels-like">
                <span className="text">Feels like </span>
                <span className="temp">
                  {data.app_temp > 0 ? "+" : ""}
                  {data.app_temp}℃
                </span>
              </div>
            </div>
          </div>
          <div className="secondary-stats">
            <WeatherStatsElement
              img="wind"
              mainDigit={wind}
              measure=" m/s,"
              additionalInfo={windDir}
            />
            <WeatherStatsElement
              img="humidity"
              mainDigit={humidity}
              measure="%"
              additionalInfo={""}
            />
            <WeatherStatsElement
              img="pressure"
              mainDigit={pressure}
              measure=" mb"
              additionalInfo={""}
            />
            <WeatherStatsElement
              img="clouds"
              mainDigit={clouds}
              measure="%"
              additionalInfo={""}
            />
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="heading-and-info">
        <div className="heading-and-clock">
          <div className="title-and-city">
            <h2>Weather</h2>
            <span className="title">in Saint-Petersburg</span>
          </div>
          <Clock darkMode="" />
        </div>
        <Tooltip
          text={"Dynamic weather report based on Weatherbit data and Fetch API"}
        />
      </div>
      <div className="loading">Loading...</div>
    </>
  );
}

type WeatherStatsElementProps = {
  img: string;
  mainDigit:
    | dataItem["data"]["gust"]
    | dataItem["data"]["rh"]
    | dataItem["data"]["pres"]
    | dataItem["data"]["clouds"];
  measure: string;
  additionalInfo: string;
};

function WeatherStatsElement({
  img,
  mainDigit,
  measure,
  additionalInfo,
}: WeatherStatsElementProps) {
  return (
    <div className="stat">
      <img src={`/img/stats-icons/${img}.svg`} alt={img} />
      <span>
        {mainDigit}
        {measure} {additionalInfo}
      </span>
    </div>
  );
}
