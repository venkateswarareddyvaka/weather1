import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CloudIcon from "../assets/icons/cloud.png";
import rainIcon from "../assets/icons/rain.jpeg";
import sunIcon from "../assets/icons/sun.jpeg";

const ForeCast = () => {
  const [foreCastData, setForCastData] = useState([]);
  const [loading, setLoading] = useState(true);

  // const [wIforeCastIcon, setWIforeCastIcon] = useState(sunIcon);

  const { cityName } = useParams();
  const APIKEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchForeCastData = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKEY}`
        );
        const dailyForecasts = res.data.list.filter(
          (item, index) => index % 8 === 0
        );
        setForCastData(dailyForecasts);
        setLoading(false);
        console.log(dailyForecasts);
      } catch (err) {
        console.log("Fetching error weather", err);
        setLoading(false);
      }
    };

    fetchForeCastData();
  }, [cityName]);

  {
    /* // for icons to show


  useEffect(() => {
    if (foreCastData && foreCastData.weather) {
      const weatherIcon = foreCastData.weather[0].main;
      if (weatherIcon === "Clouds") {
        setWIforeCastIcon(CloudIcon);
      } else if (weatherIcon === "Rain") {
        setWIforeCastIcon(rainIcon);
      } else if (weatherIcon === "Clear") {
        setWIforeCastIcon(sunIcon);
      }
    }

    {
      /*  const date = new Date();
    // console.log(date);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrDate(date.toLocaleDateString("en-Us", options));  
    
},  [foreCastData]);  */
  }

  return (
    <div className="p-2">
      <h1 className="text-center text-grey font-semibold">Forecast</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex xl:gap-5 flex-col xl:flex-row">
          {foreCastData.map((day, index) => {
            let weatherIcon;
            if (day.weather[0].main === "Clouds") {
              weatherIcon = CloudIcon;
            } else if (day.weather[0].main === "Rain") {
              weatherIcon = rainIcon;
            } else if (day.weather[0].main === "Clear") {
              weatherIcon = sunIcon;
            }

            //  extract date for next days

            const date = new Date(day.dt_txt);
            const foreCastDate = date.toLocaleDateString("en-Us", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <div
                key={index}
                className="flex flex-col xl:gap-2 items-center text-white p-5 xl:flex-row"
              >
                <p className="font-semibold">{foreCastDate}</p>
                <img src={weatherIcon} alt="cloud-image" className="w-[40px]" />

                <p className="font-normal">
                  Max Temp: {(day.main.temp_max - 273.15).toFixed(2)} °C
                </p>
                <p className="font-normal">
                  Min Temp: {(day.main.temp_min - 273.15).toFixed(2)} °C
                </p>
                <p className="font-normal">{day.weather[0].description}</p>
                <p className="font-normal">{(day.pop * 100).toFixed(2)}%</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ForeCast;
