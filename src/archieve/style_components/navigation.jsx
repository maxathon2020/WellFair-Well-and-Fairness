import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Collapse,
  Container,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Jumbotron,
  Button,
  ListGroup,
  ListGroupItem,
  Badge,
  Table,
} from "reactstrap";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

function Navbar() {
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <Link className="navbar-brand page-scroll" to="/">
            Well & Fair
          </Link>
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a
                onClick={() => {
                  console.log("----");
                  Swal.fire({
                    icon: "info",
                    title: "Well & Fair",
                    html:
                      "<h4>Fairway to use your well-earned crypto-coins!</h4>",
                  });
                }}
                className="page-scroll"
              >
                About
              </a>
            </li>
            <li>
              <Link className="page-scroll" to="/Admin">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
