import React, { useState, useEffect, useContext } from "react";
import { counterContext } from "../../context/context";
import axios from "axios";
import { environment } from "../../environment";
function DetailPage() {
  const {
    sharedValue,
    setSharedValue,
    error,
    setError,
    company,
    setCompany,
    data,
    setData,
  } = useContext(counterContext);

  let { cmpLogo, name, description, email, fbUrl, linkedInUrl, twitterUrl, instaUrl, address, phnNumber, url, screenshot } = data[company] || {};
  (async () => {
    try {
      const response = await axios.get(`${environment.api}/api/scrapData/screenshots/screenshot-1730743166773.png   `, {
        responseType: 'blob' 
    });
    screenshot = URL.createObjectURL(response.data);

    } catch (error) {
      setError(error.message);
    }
  })()
  const backFunction=()=>{
    setSharedValue("List")
  }
  return (
    <>
    <div className="p-8w-100 flex items-center gap-40 mt-5 flex-wrap">
   <button class="bg-white text-[#A2A2A2] px-4 py-1.5 rounded flex items-center gap-1 border border-[#ECECEC] border-solid ml-4" onClick={backFunction}> Back </button>
      <div className="container">
        <div className="logo">
          <img src={cmpLogo} alt="Logo" />
        </div>
        <div className="details">
          
          <div className="description">
            <h2>Description</h2> <p> {description} </p>
          </div>
          <div className="contact">
            
            <div className="phone">
              
              <i className="fa fa-phone"></i>
              <span>{phnNumber}</span>
            </div>
            <div className="email">
              <i className="fa fa-envelope"></i>
              <span>{email}</span>
            </div>
          </div>
        </div>
        <div className="company-details">
          <h2>Company Details</h2>
          <div className="website">
            <i className="fa fa-globe"></i> <span>{name}</span>
          </div>
          <div className="description">
            <h2>Description</h2> <p> {description} </p>
          </div>
          <div className="email">
            <i className="fa fa-envelope"></i>
            <span>{email}</span>
          </div>
          <div className="facebook">
            <i className="fa fa-facebook"></i>
            <span>{fbUrl}</span>
          </div>
          <div className="instagram">
            <i className="fa fa-instagram"></i>
            <span>{instaUrl}</span>
          </div>
          <div className="twitter">
            <i className="fa fa-twitter"></i>
            <span>{twitterUrl}</span>
          </div>
        </div>
        <div className="logo">
          <img src={screenshot} alt="screenshot" />
        </div>
      </div>
      </div>
    </>
  );
}

export default DetailPage;
