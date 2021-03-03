import React from "react";
import "./actorDetails.css";

export default ({ actor }) => {
  return (
    <>
    <ul className="list-group list-group-horizontal">
    <li key="ruh" className="list-group-item list-group-item-dark">
      Name:
    </li>
    <li key="rut" className="list-group-item ">
      {actor.name}
    </li>
    </ul>
      <ul className="list-group list-group-horizontal">
        <li key="ruh" className="list-group-item list-group-item-dark">
          Birthday:
        </li>
        <li key="rut" className="list-group-item ">
          {actor.birthday}
        </li>
        <li key="rdh" className="list-group-item list-group-item-dark">
          Gender:
        </li>
        <li key="rdv" className="list-group-item ">
          {actor.gender===1?("Female"):("Male")}
        </li>
      </ul>

      <ul className="list-group list-group-horizontal">
        <li key="gh" className="list-group-item list-group-item-dark">
          Popularity
        </li>
        <li key="rdv" className="list-group-item ">
          {actor.popularity}
        </li>
      </ul>
      <ul className="list-group list-group-horizontal">
      <li key="ruh" className="list-group-item list-group-item-dark">
          Known_for_department:
        </li>
        <li key="rut" className="list-group-item ">
          {actor.known_for_department}
        </li>
        </ul>
      <ul className="list-group list-group-horizontal">
      <li key="gh" className="list-group-item list-group-item-dark">
          Biography
        </li>
        <li key="rdv" className="list-group-item ">
          {actor.biography?actor.biography:("There is no Biography")}
        </li>
        </ul>
      {/* <ul className="list-group list-group-horizontal">
        <li key="slh" className="list-group-item list-group-item-dark">
          Spoken Languages
        </li>
        {actor.spoken_languages.map(lang => (
          <li key={lang.name} className="list-group-item">
            {lang.name}
          </li>
        ))}
      </ul>
      <ul className="list-group list-group-horizontal">
        <li key="pch" className="list-group-item list-group-item-dark">
          Production Companies
        </li>
        {actor.production_companies.map(pc => (
          <li key={pc.name} className="list-group-item">
            {pc.name}
          </li>
        ))}
      </ul>
      <ul className="list-group list-group-horizontal">
        <li key="pch" className="list-group-item list-group-item-dark">
          Production Countries
        </li>
      {actor.production_countries.map(pc => (
          <li key={pc.name} className="list-group-item">
            {pc.name}
          </li>
        ))}
      </ul> */}
    </>
  );
};