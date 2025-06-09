"use client";

import { Advocate } from "../types";

import { useEffect, useState } from "react";
import { PhoneNumber } from "./components/PhoneNumber";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [advocates, setAdvocates] = useState<Advocate[]>([]);

  const fetchAdvocates = () => {
    // No-op on the empty string, rather than
    // clearing search results. I could see a case
    // for clearing results here but this feels more intuitive
    if (searchTerm.length === 0) {
      return;
    }
    fetch(
      "/api/advocates/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: searchTerm
        })
      }
    ).then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.advocates);
      });
    });
  }

  useEffect(() => {
    fetchAdvocates();
  }, []);

  // I'm a little ambivalent about these tiny utility functions
  // rather than just using lambdas. When there's only a few I think this is 
  // more readable, but if the page grows in complexity it gets ugly
  const onSearchClick = (e) => {
    fetchAdvocates();
  };

  const onSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onSearchTermKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchAdvocates();
    }
  }

  return (
    <main>
      <h1 className="title">Solace Advocates</h1>
      <div className="search-section">
        <p>Search for an advocate</p>
        <input 
          className="search-box"
          onChange={onSearchTermChange} 
          onKeyDown={onSearchTermKeyDown} />
        <button className="search-button" onClick={onSearchClick}>Search</button>
      </div>
      <table className="results-table">
        <thead>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
        </thead>
        <tbody>
          {advocates.map((advocate) => {
            return (
              <tr>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td><PhoneNumber phoneNumber={advocate.phoneNumber} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 
      I will freely admit the design here is not 
       */}
      <style jsx>{`
        .title {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2.5rem;
        }

        .search-section {
          text-align: center;
        }

        .search-section p {
          margin-bottom: 1rem;
        }

        .search-box {
          padding: .75rem;
          margin-right: 0.75rem;
          border: 1px solid black;
          width: 350px;
          font-size: 1rem;
        }

        .search-input:focus {
          border-color: blue
        }

        .search-button {
          background: green;
          padding: 0.75rem;
          color: white;
          border: none;
          border-radius: 6px;
        }

        .search-button:hover {
          background: blue;
        }

        .results-table {
          width: 100%;
          margin-top: 1rem;
          background: white;
        }

        .results-table th, 
        .results-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid whitesmoke;
        }

        .results-table th {
          background:whitesmoke;
          font-weight: 600;
          color:black;
        }

        .results-table tr:last-child td {
          border-bottom: none;
        }
      `}</style>
    </main>
  );
}
