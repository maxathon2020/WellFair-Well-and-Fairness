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

export default class GrantTable extends React.Component {
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
          action:
            '<IconButton color="yellow" icon={<Icon icon="spinner" spin />} onClick={() => console.log("hey")} placement="right" > Pending </IconButton>',
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
          action:
            '<IconButton color="yellow" icon={<Icon icon="spinner" spin />} onClick={() => console.log("hey")} placement="right" > Pending </IconButton>',
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
          action:
            '<IconButton color="yellow" icon={<Icon icon="spinner" spin />} onClick={() => console.log("hey")} placement="right" > Pending </IconButton>',
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
          action:
            '<IconButton color="yellow" icon={<Icon icon="spinner" spin />} onClick={() => console.log("hey")} placement="right" > Pending </IconButton>',
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
    const data2 = fakeData.filter((v, i) => i < 10);
    let stars = 0;
    let followers = 0;
    data2.forEach((item) => {
      stars += item.stars;
      followers += item.followers;
    });

    return (
      <div>
        <Table height={300} data={data} loading={loading}>
          <Column width={100} flexGrow={1} resizable>
            <HeaderCell>Name</HeaderCell>
            <Cell dataKey="firstName" />
          </Column>

          <Column width={200} flexGrow={1} resizable>
            <HeaderCell>Amount</HeaderCell>
            <Cell dataKey="city" />
          </Column>

          <Column width={120} flexGrow={1} resizable>
            <HeaderCell>Action</HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <>
                    <IconButton
                      color="yellow"
                      icon={<Icon icon="spinner" spin />}
                      onClick={() => console.log("hey")}
                      placement="right"
                    >
                      Pending
                    </IconButton>
                    <br />
                    <br />
                  </>
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
      </div>
    );
  }
}
