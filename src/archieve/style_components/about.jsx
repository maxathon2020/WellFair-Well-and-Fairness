import React, { Component } from "react";

function about() {
  return (
    <div id="about">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <img src="img/about.jpg" className="img-responsive" alt="" />{" "}
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="about-text">
              <h2>About Us</h2>
              <p>This is about us</p>
              <h3>Why Choose Us?</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default about;
