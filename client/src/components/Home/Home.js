import React, { useState,useEffect, useContext } from "react";
import axios from "axios";
import ListScrap from "../ListScrap/ListScrap";
import DetailPage from "../DetailsPage/DetailPage";
import { counterContext } from "../../context/context";
function Home() {
  const [sharedValue, setSharedValue] = useState('');
  const [company, setCompany] = useState();
  const [data, setData] = useState([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScrape = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/scrapData/scrape",
        { url }
      );
      console.log(response);
      console.log("Scrapeddddddddddddddddd", data, response.data);
      setData((prevData) => [...prevData, response.data]);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/scrapData"); 
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const resultData = await response.json();
        console.log("Fetched Data ", resultData)
        setData(resultData);
        setSharedValue("List")

      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();

  }, []);
  return (
    <counterContext.Provider value={{sharedValue,setSharedValue,error,setError,company,setCompany,data,setData}}>
      <div className="p-3.5">
      <div className="flex gap-5 items-center mb-2.5 p-2.5 flex-wrap">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Domain Name"
          className="p-2 border border-gray-300 rounded-lg  w-[400px]  bg-[#F9FAFB]"
        />
        <button
          onClick={handleScrape}
          className={`bg-[#EDE5FF]  px-4 py-2 rounded-[5px] text-[#6C2BD9] ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch & Save Details"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      {error && <p className="text-red-500 mt-4">{error.error}</p>}
      
      <div>
      {sharedValue === 'List' || sharedValue ==="" ? <ListScrap /> : <DetailPage />}
      </div>
      </div>
    </counterContext.Provider>
  );
}

export default Home;
