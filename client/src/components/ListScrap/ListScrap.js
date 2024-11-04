
import React, { useContext, useState } from "react";
import { counterContext } from "../../context/context";
import axios from "axios";
import { environment } from "../../environment"; 
function ListScrap() {
  const {  setSharedValue, setError, setCompany, data, setData } = useContext(counterContext);
  console.log("-------listScrap", data);

  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});

  const handleCheckboxChange = async (index) => {
    setSelectedItems((prevSelected) => ({
      ...prevSelected,
      [index]: !prevSelected[index],
    }));
  };

  const isAllSelected =
    data.length > 0 &&
    Object.keys(selectedItems).length === data.length &&
    Object.values(selectedItems).every(Boolean);

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    const newSelectedItems = {};
    data.forEach((_, index) => {
      newSelectedItems[index] = isChecked; 
    });
    setSelectedItems(newSelectedItems);
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    const idsToBeDeleted = data.map((item, index) => {
      if (selectedItems[index]) {
        return item._id; 
      }
      return null; 
    }).filter(Boolean); 

    setData(data.filter((_, index) => !selectedItems[index]));

    try {
      const response = await axios.post(`${environment.api}/api/scrapData/delete`, { idsToBeDeleted });
      console.log(response);
    } catch (err) {
      setError("Error While Deleting data");
    } finally {
      setLoading(false);
      setSelectedItems({});
    }
  };

  const handleExportToCSV = () => {
    const selectedData = data.filter((_, index) => selectedItems[index]);
    if (selectedData.length === 0) {
      alert("No items selected for export.");
      return;
    }

    const csvRows = [];
    const headers = Object.keys(selectedData[0]);
    csvRows.push(headers.join(",")); 

    selectedData.forEach((item) => {
      const values = headers.map((header) => item[header]);
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "export.csv");
    a.click();
  };

  const handleImageClick = (name,index) => {
    console.log("Show details of ", name);
    setCompany(index);
    setSharedValue(name)
    
  };
  return (
    <>
      <div className="p-8">
      <div className="w-100 flex items-center gap-40 mt-5 flex-wrap">
        <div className="flex items-center gap-2.5 mb-2.5">
          <button
            onClick={handleDelete}
            className={`bg-white text-[#A2A2A2] px-4 py-1.5 rounded border border-[#ECECEC] border-solid ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Delete"}
          </button>
          <button
            onClick={handleExportToCSV}
            className={`bg-white text-[#A2A2A2] px-4 py-1.5 rounded flex items-center gap-1  border border-[#ECECEC] border-solid ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.79167 9H2.125H7.79167Z" fill="#A2A2A2" />
              <path d="M7.79167 9H2.125" stroke="#A2A2A2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M11.3333 4.75H2.125" stroke="#A2A2A2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M11.3333 13.25H2.125" stroke="#A2A2A2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12.75 6.875V11.125" stroke="#A2A2A2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M14.875 9H10.625" stroke="#A2A2A2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            {loading ? "Loading..." : "Export as CSV"}
          </button>
        </div>
      </div>
  
      <div className="my-component">
        <table className="min-w-full border border-[#ECECEC] rounded-md  min-h-[500px]">
          <thead>
            <tr className="">
              <th className=" p-3.5 bg-[#F9FAFB] flex items-center">
                <input
                  type="checkbox"
                  checked={isAllSelected} 
                  onChange={handleSelectAllChange}
                />
              </th>
              <th className="p-3.5 bg-[#F9FAFB] uppercase">Company</th>
              <th className="p-3.5 bg-[#F9FAFB] uppercase">Social Profile</th>
              <th className="p-3.5 bg-[#F9FAFB] uppercase">Description</th>
              <th className="p-3.5 bg-[#F9FAFB]  uppercase">Address</th>
              <th className="p-3.5 bg-[#F9FAFB] uppercase">Phone No</th>
              <th className="p-3.5 bg-[#F9FAFB] uppercase">Email</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3.5 flex items-center">
                  <input
                    type="checkbox"
                    checked={!!selectedItems[index]} 
                    onChange={() => handleCheckboxChange(index)} 
                  />
                </td>
                <td className="p-3.5 flex items-center gap-2.5 text-[#6C2BD9]">
                  {item.cmpLogo && (
                    <img
                      src={item.cmpLogo}
                      alt={`${item.name} logo`}
                      onClick={() => handleImageClick(item.name,index)}
                      className="w-6 h-6 object-contain ml-2"
                    />
                  )}
                  {item.name}
                </td>
                <td className="p-3.5 flex items-center gap-2.5">
                  <a
                    href={item.fbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i
                      className={`fa fa-facebook ${item.fbUrl ? "" : "disabled-link"
                        }`} 
                      style={{
                        fontSize: "15px",
                        color: item.fbUrl ? "#0077B5" : "gray",
                      }}
                    ></i>
                  </a>
                  <a
                    href={item.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i
                      className={`fa fa-twitter ${item.twitterUrl ? "" : "disabled-link"
                        }`} 
                      style={{
                        fontSize: "15px",
                        color: item.twitterUrl ? "#0077B5" : "gray",
                      }} 
                    ></i>
                  </a>
                  <a
                    href={item.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    el="noopener noreferrer"
                  >
                    <i
                      className={`fa fa-linkedin ${item.linkedInUrl ? "" : "disabled-link"
                        }`} 
                      style={{
                        fontSize: "15px",
                        color: item.linkedInUrl ? "#0077B5" : "gray",
                      }} 
                    ></i>
                  </a>
                </td>
                <td className="p-3.5">
                  {item.description}
                </td>
                <td className="p-3.5">{item.address ? item.address : "---"}</td>
                <td className="p-3.5 text-[#6C2BD9]">{item.phnNumber ? item.phnNumber : "---"}</td>
                <td className="p-3.5 text-[#6C2BD9]">{item.email ? item.email : "---"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      <div class="pagination flex items-center pt-4 ">
        <p>Showing <span>1-10</span> of <span>1000</span></p>
        <ul className="border border-solid border-[#D1D5DB] rounded flex items-center">
          <li class="arrow border-e border-solid border-[#D1D5DB] flex items-center">
            <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.70703 0.793031C5.8945 0.980558 5.99982 1.23487 5.99982 1.50003C5.99982 1.76519 5.8945 2.0195 5.70703 2.20703L2.41403 5.50003L5.70703 8.79303C5.88919 8.98163 5.98998 9.23423 5.9877 9.49643C5.98543 9.75863 5.88026 10.0094 5.69485 10.1948C5.50944 10.3803 5.25863 10.4854 4.99643 10.4877C4.73423 10.49 4.48163 10.3892 4.29303 10.207L0.293031 6.20703C0.10556 6.0195 0.000244141 5.76519 0.000244141 5.50003C0.000244141 5.23487 0.10556 4.98056 0.293031 4.79303L4.29303 0.793031C4.48056 0.60556 4.73487 0.500244 5.00003 0.500244C5.26519 0.500244 5.5195 0.60556 5.70703 0.793031Z" fill="#6B7280" />
            </svg>
          </li>
          <li class="page active border-e border-solid border-[#D1D5DB] flex items-center">1</li>
          <li class="page border-e border-solid border-[#D1D5DB] flex items-center ">2</li>
          <li class="page border-e border-solid border-[#D1D5DB] flex items-center">3</li>
          <li class="dots border-e border-solid border-[#D1D5DB] flex items-center">...</li>
          <li class="page border-e border-solid border-[#D1D5DB] flex items-center">100</li>
          <li class="arrow flex items-center">
            <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.293031 10.207C0.10556 10.0195 0.000244141 9.76514 0.000244141 9.49998C0.000244141 9.23482 0.10556 8.98051 0.293031 8.79298L3.58603 5.49998L0.293031 2.20698C0.110873 2.01838 0.0100779 1.76578 0.0123563 1.50358C0.0146347 1.24138 0.119804 0.99057 0.305212 0.805162C0.49062 0.619753 0.741433 0.514584 1.00363 0.512306C1.26583 0.510027 1.51843 0.610822 1.70703 0.79298L5.70703 4.79298C5.8945 4.98051 5.99982 5.23482 5.99982 5.49998C5.99982 5.76514 5.8945 6.01945 5.70703 6.20698L1.70703 10.207C1.5195 10.3945 1.26519 10.4998 1.00003 10.4998C0.734866 10.4998 0.480558 10.3945 0.293031 10.207Z" fill="#6B7280" />
            </svg>
          </li>
        </ul>
      </div>
    </>
  );
}

export default ListScrap;
