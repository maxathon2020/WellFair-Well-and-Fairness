import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useParams,
} from "react-router-dom";
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
} from "reactstrap";
import {
  IconButton,
  Icon,
  Form,
  Uploader,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  ButtonToolbar,
  Calendar,
  Whisper,
  Popover,
  Carousel,
  RadioGroup,
  FlexboxGrid,
  List,
  Radio,
  Divider,
  Tag,
  TagGroup,
  Panel,
  Loader,
  Table,
} from "rsuite";
import { ResponsivePie } from "@nivo/pie";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
const { Cell, HeaderCell, Column, TablePagination } = Table;
const thousands = (value) =>
  `${value}`.replace(/(?=(?!(\b))(\d{3})+$)/g, "$1,");

const NumberCell = ({ rowData, dataKey, ...props }) => (
  <Cell {...props}>{thousands(rowData[dataKey])}</Cell>
);

const HeaderSummary = ({ title, summary }) => (
  <div>
    <label>{title}</label>
    <div
      style={{
        fontSize: 18,
        color: "#2eabdf",
      }}
    >
      {thousands(summary)}
    </div>
  </div>
);

export default class PaginationTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fakeData: [
        {
          id: 1,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/justinrob/128.jpg",
          city: "New Amieshire",
          email: "Leora13@yahoo.com",
          firstName: "Ernest ",
          lastName: "Schuppe",
          street: "Ratke Port",
          zipCode: "17026-3154",
          date: "2016-09-23T07:57:40.195Z",
          bs: "global drive functionalities",
          catchPhrase: "Intuitive impactful software",
          companyName: "Lebsack - Nicolas",
          words: "saepe et omnis",
          sentence: "Quos aut sunt id nihil qui.",
          stars: 820,
          followers: 70,
        },
        {
          id: 2,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/thaisselenator_/128.jpg",
          city: "New Gust",
          email: "Mose_Gerhold51@yahoo.com",
          firstName: "Janis",
          lastName: "Vandervort",
          street: "Dickinson Keys",
          zipCode: "43767",
          date: "2017-03-06T09:59:12.551Z",
          bs: "e-business maximize bandwidth",
          catchPhrase: "De-engineered discrete secured line",
          companyName: "Glover - Hermiston",
          words: "deleniti dolor nihil",
          sentence: "Illo quidem libero corporis laborum.",
          stars: 1200,
          followers: 170,
        },
        {
          id: 3,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/arpitnj/128.jpg",
          city: "Lefflerstad",
          email: "Frieda.Sauer61@gmail.com",
          firstName: "Makenzie",
          lastName: "Bode",
          street: "Legros Divide",
          zipCode: "54812",
          date: "2016-12-08T13:44:26.557Z",
          bs: "plug-and-play e-enable content",
          catchPhrase: "Ergonomic 6th generation challenge",
          companyName: "Williamson - Kassulke",
          words: "quidem earum magnam",
          sentence: "Nam qui perferendis ut rem vitae saepe.",
          stars: 610,
          followers: 170,
        },
        {
          id: 4,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/brajeshwar/128.jpg",
          city: "East Catalina",
          email: "Eloisa.OHara@hotmail.com",
          firstName: "Ciara",
          lastName: "Towne",
          street: "Schimmel Ramp",
          zipCode: "76315-2246",
          date: "2016-07-19T12:54:30.994Z",
          bs: "extensible innovate e-business",
          catchPhrase: "Upgradable local model",
          companyName: "Hilpert, Eichmann and Brown",
          words: "exercitationem rerum sit",
          sentence: "Qui rerum ipsa atque qui.",
          stars: 5322,
          followers: 170,
        },
        {
          id: 5,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/dev_essentials/128.jpg",
          city: "Ritchieborough",
          email: "Brisa46@hotmail.com",
          firstName: "Suzanne",
          lastName: "Wolff",
          street: "Lemuel Radial",
          zipCode: "88870-3897",
          date: "2017-02-23T17:11:53.875Z",
          bs: "back-end orchestrate networks",
          catchPhrase: "Exclusive human-resource knowledge base",
          companyName: "Mayer - Considine",
          words: "voluptatum tempore at",
          sentence: "Enim quia deleniti molestiae aut.",
          stars: 852,
          followers: 770,
        },
        {
          id: 6,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/petrangr/128.jpg",
          city: "Lake Emery",
          email: "Cody.Schultz56@gmail.com",
          firstName: "Alessandra",
          lastName: "Feeney",
          street: "Mosciski Estate",
          zipCode: "81514",
          date: "2016-06-30T05:23:18.734Z",
          bs: "sexy evolve technologies",
          catchPhrase: "Virtual hybrid throughput",
          companyName: "Nikolaus and Sons",
          words: "alias minus repudiandae",
          sentence: "Sed qui eius excepturi sunt voluptates.",
          stars: 3209,
          followers: 2780,
        },
        {
          id: 7,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/knilob/128.jpg",
          city: "East Dejuan",
          email: "Enrico_Beer@yahoo.com",
          firstName: "Margret",
          lastName: "Heller",
          street: "Gunner Drive",
          zipCode: "17423-9317",
          date: "2017-03-13T21:09:47.253Z",
          bs: "wireless morph synergies",
          catchPhrase: "Profit-focused radical help-desk",
          companyName: "Corwin, Maggio and Wintheiser",
          words: "temporibus possimus neque",
          sentence: "Eum amet ea non natus qui assumenda illo officia qui.",
          stars: 9920,
          followers: 570,
        },
        {
          id: 8,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/tom_even/128.jpg",
          city: "Schummtown",
          email: "Mitchel.Herman@yahoo.com",
          firstName: "Emiliano",
          lastName: "Moore",
          street: "Maria Junctions",
          zipCode: "33930-7081",
          date: "2016-03-27T07:26:57.345Z",
          bs: "customized integrate e-tailers",
          catchPhrase: "Total system-worthy contingency",
          companyName: "Gulgowski - Botsford",
          words: "deleniti ipsa hic",
          sentence: "Ducimus id quaerat neque.",
          stars: 3820,
          followers: 880,
        },
        {
          id: 9,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/chandlervdw/128.jpg",
          city: "Gilberthaven",
          email: "Gaylord_Reichel16@yahoo.com",
          firstName: "Alessandra",
          lastName: "Smith",
          street: "Kali Spurs",
          zipCode: "01370",
          date: "2017-01-24T22:11:53.835Z",
          bs: "extensible repurpose action-items",
          catchPhrase: "Virtual dedicated definition",
          companyName: "Maggio LLC",
          words: "libero unde est",
          sentence: "Non adipisci hic laboriosam et qui laudantium aspernatur.",
          stars: 330,
          followers: 590,
        },
        {
          id: 10,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/mwarkentin/128.jpg",
          city: "Felicitychester",
          email: "Eileen48@gmail.com",
          firstName: "Eldridge",
          lastName: "Bins",
          street: "Casper Squares",
          zipCode: "80025-1552",
          date: "2016-07-20T05:59:45.630Z",
          bs: "cutting-edge expedite partnerships",
          catchPhrase: "Organic user-facing functionalities",
          companyName: "Leffler, Cummerata and Price",
          words: "sed exercitationem quas",
          sentence: "Voluptas dolorem quasi aspernatur.",
          stars: 923,
          followers: 704,
        },
        {
          id: 11,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/gipsy_raf/128.jpg",
          city: "Caleighhaven",
          email: "Rico_Nolan@hotmail.com",
          firstName: "Claude",
          lastName: "Hermiston",
          street: "Bode Pine",
          zipCode: "76773",
          date: "2017-03-13T08:02:41.211Z",
          bs: "back-end innovate infomediaries",
          catchPhrase: "Stand-alone global customer loyalty",
          companyName: "Heller, Rosenbaum and Lockman",
          words: "ut quia ut",
          sentence: "Eos consequatur magni incidunt.",
          stars: 421,
          followers: 403,
        },
        {
          id: 12,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/knilob/128.jpg",
          city: "Herzogmouth",
          email: "Dawn_Metz@yahoo.com",
          firstName: "Clarabelle",
          lastName: "Ankunding",
          street: "Nolan Summit",
          zipCode: "04355",
          date: "2016-07-09T09:07:34.744Z",
          bs: "granular deliver relationships",
          catchPhrase: "Multi-lateral zero defect analyzer",
          companyName: "Mante, Oberbrunner and Collins",
          words: "eos fuga repellat",
          sentence: "Cum corporis molestias quia.",
          stars: 8203,
          followers: 704,
        },
        {
          id: 13,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/kirangopal/128.jpg",
          city: "Eulaliabury",
          email: "Ron.Franecki@gmail.com",
          firstName: "Hubert",
          lastName: "Boehm",
          street: "Anastacio Springs",
          zipCode: "91444",
          date: "2016-04-22T16:37:24.331Z",
          bs: "one-to-one transition methodologies",
          catchPhrase: "Switchable asymmetric function",
          companyName: "Greenholt, Homenick and Considine",
          words: "sed incidunt quo",
          sentence: "Sed adipisci aliquam ut eius ut ipsa consequatur.",
          stars: 8209,
          followers: 909,
        },
        {
          id: 14,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/kerem/128.jpg",
          city: "East Alice",
          email: "Hayley52@yahoo.com",
          firstName: "Vladimir",
          lastName: "Breitenberg",
          street: "Lula Port",
          zipCode: "04635",
          date: "2016-09-26T01:25:23.057Z",
          bs: "virtual monetize communities",
          catchPhrase: "Mandatory user-facing methodology",
          companyName: "Kshlerin - Pfeffer",
          words: "eaque enim unde",
          sentence:
            "Sed voluptas fugiat nihil delectus architecto et voluptatibus quis voluptas.",
          stars: 8251,
          followers: 178,
        },
        {
          id: 15,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/layerssss/128.jpg",
          city: "East Frankie",
          email: "Duane.Rempel@hotmail.com",
          firstName: "Haylee",
          lastName: "Purdy",
          street: "Dena Walk",
          zipCode: "94111-0802",
          date: "2016-11-26T16:36:38.472Z",
          bs: "enterprise drive users",
          catchPhrase: "Customizable non-volatile paradigm",
          companyName: "Lemke, Mitchell and Harber",
          words: "dolores ipsum earum",
          sentence: "Nemo molestiae ad sit cupiditate neque.",
          stars: 3099,
          followers: 707,
        },
        {
          id: 16,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/dreizle/128.jpg",
          city: "New Kendall",
          email: "Eddie_Bartell@hotmail.com",
          firstName: "Herminia",
          lastName: "Altenwerth",
          street: "Kshlerin Cape",
          zipCode: "86614-9727",
          date: "2016-09-28T19:50:18.308Z",
          bs: "cutting-edge target models",
          catchPhrase: "Triple-buffered fault-tolerant concept",
          companyName: "Gislason - Nicolas",
          words: "perferendis magnam minima",
          sentence: "Fuga in dolorem vel eligendi deserunt voluptatem.",
          stars: 8491,
          followers: 463,
        },
        {
          id: 17,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/nessoila/128.jpg",
          city: "Port Whitney",
          email: "Josephine_Legros@yahoo.com",
          firstName: "Erick",
          lastName: "Klein",
          street: "Megane Cliffs",
          zipCode: "42168",
          date: "2016-04-02T05:03:42.377Z",
          bs: "user-centric leverage experiences",
          catchPhrase: "Centralized systematic parallelism",
          companyName: "Olson and Sons",
          words: "facere est in",
          sentence: "Ducimus aliquid ut.",
          stars: 9820,
          followers: 670,
        },
        {
          id: 18,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/mrebay007/128.jpg",
          city: "West Meda",
          email: "Jared.Hudson@hotmail.com",
          firstName: "Lisandro",
          lastName: "Barton",
          street: "Torrance Union",
          zipCode: "19477",
          date: "2016-08-01T14:24:45.209Z",
          bs: "open-source exploit markets",
          catchPhrase: "Open-source impactful framework",
          companyName: "Volkman and Sons",
          words: "a tempore hic",
          sentence: "Quod veniam nemo impedit mollitia.",
          stars: 1220,
          followers: 708,
        },
        {
          id: 19,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/brenton_clarke/128.jpg",
          city: "Darrenport",
          email: "Delpha.Tromp9@yahoo.com",
          firstName: "Ashton",
          lastName: "Daugherty",
          street: "Hermann Port",
          zipCode: "25133-9181",
          date: "2016-07-29T09:49:39.424Z",
          bs: "wireless optimize deliverables",
          catchPhrase: "Ergonomic human-resource algorithm",
          companyName: "Grady LLC",
          words: "libero ut repellat",
          sentence: "Vel quod ullam.",
          stars: 420,
          followers: 30,
        },
        {
          id: 20,
          avartar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/josep_martins/128.jpg",
          city: "Janiyahaven",
          email: "Ariel.Maggio9@yahoo.com",
          firstName: "Cassandra",
          lastName: "Schmitt",
          street: "Windler Lodge",
          zipCode: "87582-2944",
          date: "2017-01-21T12:35:27.741Z",
          bs: "holistic cultivate relationships",
          catchPhrase: "Enterprise-wide system-worthy data-warehouse",
          companyName: "Ankunding Group",
          words: "blanditiis voluptates repellat",
          sentence:
            "Non quis non dignissimos sit rerum voluptatem culpa quibusdam.",
          stars: 20,
          followers: 188,
        },
      ],
      displayLength: 8,
      loading: false,
      page: 1,
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeLength = this.handleChangeLength.bind(this);
  }
  handleChangePage(dataKey) {
    this.setState({
      page: dataKey,
    });
  }
  handleChangeLength(dataKey) {
    this.setState({
      page: 1,
      displayLength: dataKey,
    });
  }
  getData() {
    const { displayLength, page, fakeData } = this.state;

    return fakeData.filter((v, i) => {
      const start = displayLength * (page - 1);
      const end = start + displayLength;
      return i >= start && i < end;
    });
  }
  render() {
    const data = this.getData();
    const { loading, displayLength, page, fakeData } = this.state;

    const pie_data = [
      {
        id: "Schummtown",
        label: "Schummtown",
        value: 464,
        color: "hsl(114, 70%, 50%)",
      },
      {
        id: "Lefflerstad",
        label: "Lefflerstad",
        value: 528,
        color: "hsl(278, 70%, 50%)",
      },
      {
        id: "New Amieshire",
        label: "New Amieshire",
        value: 263,
        color: "hsl(220, 70%, 50%)",
      },
      {
        id: "New Gust",
        label: "New Gust",
        value: 40,
        color: "hsl(38, 70%, 50%)",
      },
      {
        id: "Eulaliabury",
        label: "Eulaliabury",
        value: 115,
        color: "hsl(42, 70%, 50%)",
      },
    ];

    const data2 = fakeData.filter((v, i) => i < 10);
    let stars = 0;
    let followers = 0;
    data2.forEach((item) => {
      stars += item.stars;
      followers += item.followers;
    });

    return (
      <div>
        <h4>User list</h4>
        <Table height={420} data={data} loading={loading}>
          <Column width={20} align="center">
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="id" />
          </Column>

          <Column width={100} flexGrow={1} resizable>
            <HeaderCell>Name</HeaderCell>
            <Cell dataKey="firstName" />
          </Column>

          <Column width={200} flexGrow={1} resizable>
            <HeaderCell>City</HeaderCell>
            <Cell dataKey="city" />
          </Column>

          <Column width={200} flexGrow={1} resizable>
            <HeaderCell>Current Balance</HeaderCell>
            <Cell dataKey="followers" />
          </Column>

          <Column width={120} flexGrow={1} fixed="right">
            <HeaderCell>Action</HeaderCell>

            <Cell>
              {(rowData) => {
                return (
                  <span>
                    <a
                      onClick={() => {
                        Swal.fire({
                          icon: "success",
                          title: "Wallet Frozen 🧊",
                          text: "User has been notified",
                        });
                      }}
                    >
                      {" "}
                      Freeze{" "}
                    </a>{" "}
                    |{" "}
                    <a
                      onClick={() => {
                        // Swal.fire({
                        //   icon: "success",
                        //   title: "Wallet Unfrozen 🔥",
                        //   text: "User has been notified",
                        // });

                        let timerInterval;
                        Swal.fire({
                          title: "Auto close alert!",
                          icon: "success",
                          title: "Wallet Unfrozen 🔥",
                          html:
                            "Whitelisting the Wallet address... <br/>this can take a while ",
                          timer: 3000,
                          timerProgressBar: true,
                          showCloseButton: false,
                          showCancelButton: false,
                          showConfirmButton: false,
                          allowOutsideClick: false,
                          willOpen: () => {
                            Swal.showLoading();
                            timerInterval = setInterval(() => {
                              const content = Swal.getContent();
                              if (content) {
                                const b = content.querySelector("b");
                                if (b) {
                                  b.textContent = Swal.getTimerLeft();
                                }
                              }
                            }, 100);
                          },
                          onClose: () => {
                            clearInterval(timerInterval);
                          },
                        }).then((result) => {
                          /* Read more about handling dismissals below */
                          if (result.dismiss === Swal.DismissReason.timer) {
                            console.log("I was closed by the timer");
                          }
                        });
                      }}
                    >
                      {" "}
                      Unfreeze{" "}
                    </a>
                  </span>
                );
              }}
            </Cell>
          </Column>
        </Table>
        <Table.Pagination
          lengthMenu={[
            {
              value: 5,
              label: 5,
            },
            {
              value: 8,
              label: 8,
            },
          ]}
          activePage={page}
          displayLength={displayLength}
          total={fakeData.length}
          onChangePage={this.handleChangePage}
          onChangeLength={this.handleChangeLength}
        />{" "}
        <hr />
        <div
          style={{
            minWidth: 0,
            height: "60vh",
          }}
        >
          <h4>User Location Statistics</h4>
          <ResponsivePie
            data={pie_data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={{ scheme: "nivo" }}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            radialLabelsSkipAngle={10}
            radialLabelsTextXOffset={6}
            radialLabelsTextColor="#333333"
            radialLabelsLinkOffset={0}
            radialLabelsLinkDiagonalLength={16}
            radialLabelsLinkHorizontalLength={24}
            radialLabelsLinkStrokeWidth={1}
            radialLabelsLinkColor={{ from: "color" }}
            slicesLabelsSkipAngle={10}
            slicesLabelsTextColor="#333333"
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            defs={[
              {
                id: "dots",
                type: "patternDots",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            fill={[
              {
                match: {
                  id: "ruby",
                },
                id: "dots",
              },
              {
                match: {
                  id: "c",
                },
                id: "dots",
              },
              {
                match: {
                  id: "go",
                },
                id: "dots",
              },
              {
                match: {
                  id: "python",
                },
                id: "dots",
              },
              {
                match: {
                  id: "scala",
                },
                id: "lines",
              },
              {
                match: {
                  id: "lisp",
                },
                id: "lines",
              },
              {
                match: {
                  id: "elixir",
                },
                id: "lines",
              },
              {
                match: {
                  id: "javascript",
                },
                id: "lines",
              },
            ]}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                translateY: 56,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: "#999",
                symbolSize: 18,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000",
                    },
                  },
                ],
              },
            ]}
          />
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}
