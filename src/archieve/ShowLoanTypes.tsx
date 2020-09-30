import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Collapse,
  Container,
  Navbar,
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
import { IconButton, Icon } from "rsuite";
import { ResponsiveLine } from "@nivo/line";
import moment from "moment";

// Display the Loan Types and real time chart
function ShowLoanTypes() {
  //   === useState ===
  const [chartData, setChartData] = useState([
    {
      id: "MXW",
      data: [{ x: 0, y: 100 }],
    },
  ]);
  const [fetched, setFetched] = useState(false);
  //   === useState ===

  //   === useEffect ===
  useEffect(() => {
    var dateNow = moment().unix();
    var weekAgo = moment().subtract("days", 1).unix();
    console.log(moment.unix(dateNow).format("MM/DD/YYYY"));
    console.log(moment.unix(weekAgo).format("MM/DD/YYYY"));

    // Coin IDs: maxonrow, bitcoin, ethereum
    getDataFor("maxonrow", "1");
  }, []);
  //   === useEffect ===

  async function getDataFor(coinName: string, days: string) {
    // https://api.coingecko.com/api/v3/coins/maxonrow/market_chart?vs_currency=usd&days=1
    var result = await fetch(
      "https://api.coingecko.com/api/v3/coins/" +
        coinName +
        "/market_chart?vs_currency=usd&days=" +
        days
    );
    var result_json = await result.json();
    var result_price = result_json.prices;
    var temp_data: any = [];
    result_price.map((element: any) => {
      console.log(element[0]);
      console.log(moment.utc(element[0], "X"));
      temp_data.push({ x: element[0], y: element[1] });
    });

    console.log("this is the data: ", temp_data);

    // Set the Fetched to True
    setChartData([
      {
        id: "MXW",
        data: temp_data,
      },
    ]);
    setFetched(true);
  }

  // Wait until the data have been fetched
  if (!fetched) {
    return <h1>Wait</h1>;
  }

  function clientDateTime() {
    var date_time = new Date();
    var curr_hour_ = date_time.getHours();
    var curr_hour = curr_hour_.toString();
    if (curr_hour_ <= 9) var curr_hour = "0" + curr_hour;
    var curr_min = date_time.getMinutes();
    var curr_sec = date_time.getSeconds();
    var curr_time = curr_hour + ":" + curr_min + ":" + curr_sec;
    return curr_time;
  }

  return (
    <div id="about">
      <Jumbotron>
        <h1 className="lead">Welcome back Duks!</h1>
        <h1 className="display-8">Current MXW : 500</h1>
        <hr />
        <h1 className="display-8">Pending MXW : 1500</h1>
        <hr />
        <p>** There might be 1 ~ 2 days of delay due to processing errors **</p>
        <p className="lead">
          Are you a business owner? You can apply to receive payments via mxw.
          <br />
          <Button color="primary">Apply for business account</Button>
        </p>

        <div
          style={{
            minWidth: 0,
            height: 400,
          }}
        >
          <ResponsiveLine
            data={chartData}
            margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "transportation",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "count",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            colors={{ scheme: "nivo" }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabel="y"
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "top-left",
                direction: "column",
                justify: false,
                translateX: 0,
                translateY: 0,
                itemsSpacing: 4,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 30,
                itemOpacity: 0.75,
                symbolSize: 31,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </Jumbotron>

      <br />

      <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Grant Amount</th>
            <th>Approve Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>30 mxw</td>
            <td>Pending...</td>
            <td>
              <IconButton
                color="yellow"
                icon={<Icon icon="spinner" spin />}
                onClick={() => console.log("hey")}
                placement="right"
              >
                Pending
              </IconButton>
            </td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>60 mxw</td>
            <td>Approved</td>
            <td>
              <IconButton
                color="cyan"
                icon={<Icon icon="check" />}
                onClick={() => console.log("hey")}
                placement="right"
              >
                Approved
              </IconButton>
            </td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>90 mxw</td>
            <td>Declined</td>
            <td>
              <IconButton
                color="red"
                icon={<Icon icon="close" />}
                onClick={() => console.log("hey")}
                placement="right"
              >
                Declined
              </IconButton>
            </td>
          </tr>
          <tr>
            <th scope="row">4</th>
            <td>120 mxw</td>
            <td>Apply</td>
            <td>
              <IconButton
                color="green"
                icon={<Icon icon="money" />}
                onClick={() => console.log("hey")}
                placement="right"
              >
                Apply
              </IconButton>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
export default ShowLoanTypes;
