import axios from "axios";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [searchCity, searchSetCity] = useState("");
  const [filterCities, setFilterCities] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currPage, setCurrPage] = useState(1);

  useEffect(() => {
    getCitiesData();
  }, []);

  const getCitiesData = () => {
    setTimeout(async () => {
      try {
        const res = await axios.get(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=${
            (currPage - 1) * 10
          }`
        );
        const newCities = res.data.results;
        setCities((prevCities) => [...prevCities, ...newCities]);

        // check if there is more data to load
        setCurrPage((prevPage) => prevPage + 1);
        if (newCities.length === 0) {
          setHasMore(false);
        }
      } catch (err) {
        console.log("Error found", err);
      }
    }, 1000);
  };

  const handleSearchCity = (e) => {
    searchSetCity(e.target.value);
  };
  // console.log("city name", searchCity);

  // console.log("state", cities);

  useEffect(() => {
    const filterCity = cities.filter((city) =>
      city.name.toLowerCase().includes(searchCity.toLowerCase())
    );

    setFilterCities(filterCity);
  }, [cities, searchCity]);

  console.log("filter state", filterCities);

  const handleRightClick = (e, cityName) => {
    if (e.button == 2) {
      window.open(`/weather/${cityName}`, "_blank");
    }
  };

  return (
    <>
      <div
        className="container mx-auto mt-20"
        style={{
          backgroundColor: "#ecd9df",
          border: " 1.5px solid black",
          borderRadius: "5px",
        }}
      >
        <h2 className="text-center text-3xl font-bold mb-6 mt-4">
          Cities Table
        </h2>
        <input
          className="border-2 border-black px-3 py-3 rounded-lg w-[50%] mb-5 ml-5"
          placeholder="Search City...."
          onChange={handleSearchCity}
          value={searchCity}
        />
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <InfiniteScroll
                  dataLength={cities.length}
                  next={getCitiesData}
                  hasMore={hasMore}
                  loader={
                    <h4 className="text-center font-bold pt-5">Loading...</h4>
                  }
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>No more data to load</b>
                    </p>
                  }
                >
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-lg font-semibold text-gray-500 uppercase dark:text-neutral-500"
                        >
                          City
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-lg font-semibold text-gray-500 uppercase dark:text-neutral-500"
                        >
                          Country
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-lg font-semibold text-gray-500 uppercase dark:text-neutral-500"
                        >
                          Timezone
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {filterCities.map((city, i) => (
                        <tr
                          className="hover:bg-gray-100 dark:hover:bg-neutral-700"
                          key={i}
                        >
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 cursor-pointer"
                            onContextMenu={(e) =>
                              handleRightClick(e, city.name)
                            }
                          >
                            <Link to={`/weather/${city.name}`}>
                              {city.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                            {city.cou_name_en}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                            {city.timezone}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default CitiesTable;
