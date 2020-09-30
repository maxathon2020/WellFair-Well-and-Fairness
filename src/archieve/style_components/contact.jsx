import React, { Component } from "react";

function Contact() {
  return (
    <>
      <div className="col-md-12 footer">
        <div className="row">
          <div className="social">
            <i className="fab fa-facebook fa-2x"></i>&nbsp;&nbsp;
            <i className="fab fa-twitter fa-2x"></i>&nbsp;&nbsp;
            <i className="fab fa-youtube fa-2x"></i>
          </div>
          <p>&copy; 2020 Well & Fair</p>
          <button
            onClick={() => {
              window.location.reload();
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    </>
  );
}

export default Contact;
