import React from "react";

const Header = ({ name, numActors }) => {
  return (
    <div className="row">
      <div className="col-md-6 offset-4">
        <h2>
          {`${name}  `}
          <span className="badge badge-pill badge-success">{numActors}</span>
        </h2>
      </div>
    </div>
  );
};

export default Header;