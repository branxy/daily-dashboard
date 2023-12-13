import { useEffect, useState } from "react";
import { getWeatherData, startFetchingInterval } from "./weatherAPI";
import Clock from "../clock/Clock";
import Tooltip from "../Tooltip";

type dataItem = {
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

export type dataType = {
  count: number;
  data: dataItem[];
};

export default function WeatherApp() {
  const [details, setDetails] = useState<dataItem | null>(null);

  useEffect(() => {
    getWeatherData()
      .then((data) => {
        setDetails(data.data[0]);
      })
      .catch((error) => console.error("Error fetching initial data:", error));

    startFetchingInterval();
  }, []);

  if (details) {
    const wind = Math.round(details.gust);
    const windDir = details.wind_cdir;
    const humidity = details.rh;
    const pressure = details.pres;
    const clouds = details.clouds;
    return (
      <>
        {details && (
          <>
            <div className="heading-and-info">
              <div className="heading-and-clock">
                <div className="title-and-city">
                  <h2>Weather</h2>
                  <span className="title">in {details.city_name}</span>
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
                    {details.temp > 0 ? "+" : "-"}
                    {details.temp}℃
                  </span>
                  <img
                    className="icon"
                    src={`/img/${details.weather.icon}.png`}
                    alt=""
                  />
                </div>
                <div className="text">
                  <span>{details.weather.description}</span>
                  <div className="feels-like">
                    <span className="text">Feels like </span>
                    <span className="temp">
                      {details.app_temp > 0 ? "+" : "-"}
                      {details.app_temp}℃
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
        )}
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
    | dataItem["gust"]
    | dataItem["rh"]
    | dataItem["pres"]
    | dataItem["clouds"];
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
