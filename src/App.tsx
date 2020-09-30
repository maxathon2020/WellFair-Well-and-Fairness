import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useParams,
} from "react-router-dom";

// === UI/UX ===
import { Twemoji } from "react-emoji-render";
import { ResponsiveLine } from "@nivo/line";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import moment from "moment";
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
  Cascader,
} from "rsuite";
import { Table as Table2 } from "rsuite";

// ======= MXW Imports =======
import { mxw, token, nonFungibleToken } from "mxw-sdk-js";
import { FungibleTokenActions } from "mxw-sdk-js/dist/token";
import {
  bigNumberify,
  hexlify,
  randomBytes,
  BigNumber,
} from "mxw-sdk-js/dist/utils";
import {
  NonFungibleToken,
  NonFungibleTokenActions,
} from "mxw-sdk-js/dist/non-fungible-token";
import { NonFungibleTokenItem } from "mxw-sdk-js/dist/non-fungible-token-item";
// ======= MXW Imports =======

// ======= Tutorial Imports =======
import { nodeProvider } from "./node/node";
import KycData from "./archieve/kyc/data";
import KycProvider from "./archieve/kyc/provider";
import KycIssuer from "./archieve/kyc/issuer";
import KycValidator from "./archieve/kyc/validator";
import KycWhitelistor from "./archieve/kyc/whitelistor";
import Creator from "./archieve/ft/creator";
import Query from "./archieve/ft/query";
import Authorize from "./archieve/ft/authorize";
import Minter from "./archieve/ft/minter";
import Wallet from "./archieve/ft/wallet";
import Logger from "./archieve/ft/logger";
// ======= Tutorial Imports =======
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Component
import Navbar from "./archieve/style_components/navigation";
import Contact from "./archieve/style_components/contact";
import PaginationTable from "./PaginationTable";
import MarketPlace from "./Market";
import QrReader from "react-qr-reader";
import GrantTable from "./GrantTable";
var QRCode = require("qrcode.react");
var Carousel_ = require("react-responsive-carousel").Carousel;

// === GOV Wallet ===
let silentRpc = nodeProvider.trace.silentRpc;
let providerConnection = new mxw.providers.JsonRpcProvider(
  nodeProvider.connection,
  nodeProvider
)
  .on("rpc", function (args) {
    if ("response" == args.action) {
      if (silentRpc) {
        console.log("request", JSON.stringify(args.request));
        console.log("response", JSON.stringify(args.response));
      }
    }
  })
  .on("responseLog", function (args) {
    if (silentRpc) {
      console.log(
        "responseLog",
        JSON.stringify({ info: args.info, response: args.response })
      );
    }
  });

// ============= KYC ===============
let kyc_provider = mxw.Wallet.fromMnemonic(nodeProvider.kyc.provider).connect(
  providerConnection
);
let kyc_issuer = mxw.Wallet.fromMnemonic(nodeProvider.kyc.issuer).connect(
  providerConnection
);
let kyc_middleware = mxw.Wallet.fromMnemonic(
  nodeProvider.kyc.middleware
).connect(providerConnection);
// ============= KYC ===============

// ============= NFT ===============
let nft_provider = mxw.Wallet.fromMnemonic(
  nodeProvider.nonFungibleToken.provider
).connect(providerConnection);
let nft_issuer = mxw.Wallet.fromMnemonic(
  nodeProvider.nonFungibleToken.issuer
).connect(providerConnection);
let nft_middleware = mxw.Wallet.fromMnemonic(
  nodeProvider.nonFungibleToken.middleware
).connect(providerConnection);
// ============= NFT ===============

// Custom Wallet for the User
let myWallet = mxw.Wallet.fromMnemonic(
  "amount hover come trust shell ahead permit sweet false battle merit isolate"
).connect(providerConnection);

// ======= ONLINE COURSE ENROL =======
export default function App() {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [createWalletS, setCreateWalletS] = useState(false);
  const [userWalletM, setUserWalletM] = useState("");

  useEffect(() => {}, []);

  const fullWalkThrough = async () => {
    // 1. ask for personal details
    var personalDetails = prompt("What is your name? And take a selfie");

    // 2. Create the wallet
    let wallet = mxw.Wallet.createRandom().connect(providerConnection);
    var testing = await wallet.getBalance();
    console.log("Balance: ", testing.toString());

    // === 3. KYC Process ===
    const kycData: mxw.KycData = await new KycData(wallet).signKycAddress();
    // Provider Sign KYC Data
    const partialSignedTrx: mxw.KycTransaction = await new KycProvider(
      kyc_provider,
      kycData
    ).signTransaction();
    // Issuer Sign KYC Data
    const allSignedTrx: mxw.KycTransaction = await new KycIssuer(
      kyc_issuer,
      partialSignedTrx
    ).signTransaction();
    // Verify Transaction Signature
    const isValidSignature: Boolean = await new KycValidator(
      allSignedTrx
    ).isValidSignature();
    //  Whitelist a Wallet Address
    const whitelistReceipt: mxw.providers.TransactionReceipt = await new KycWhitelistor(
      kyc_middleware,
      allSignedTrx
    ).whitelist();
    // === 3. KYC Process ===

    // 4. Set the user data - show the user and output
    console.log("Wallet Address", "-", wallet.address);
    console.log("Wallet Mnemonic", "-", wallet.mnemonic);
    console.log("Wallet White Listed", "-", wallet.isWhitelisted());
    console.log("Receipt Hash", "-", whitelistReceipt.hash);
    const green = "\x1b[32m";
    const red = "\x1b[31m";
    let result: String = (await (isValidSignature && wallet.isWhitelisted()))
      ? `${green}wallet number  creation & whitelist success!`
      : `${red}wallet number  creation & whitelist failed!`;
    console.log(result);
    setUserWalletM(wallet.mnemonic);

    // 5. Send some mxw to user - this has to be after
    // let amount = mxw.utils.parseMxw("1.0");
    // var transfer_to_user = await kyc_provider.transfer(wallet.address, amount);
    // var testing = await wallet.getBalance();
    // console.log("Balance: ", testing.toString());

    // 6. Create the Program
    var courseName = Math.random().toString(36).substring(7);
    let nonFungibleTokenProperties = {
      name: courseName,
      symbol: courseName,
      fee: {
        to: nodeProvider.nonFungibleToken.feeCollector,
        value: bigNumberify("1"),
      },
      metadata: "Course " + courseName,
      properties: courseName,
    };
    let defaultOverrides = {
      logSignaturePayload: function (payload: string) {
        console.log("signaturePayload:", JSON.stringify(payload));
      },
      logSignedTransaction: function (signedTransaction: string) {
        console.log("signedTransaction:", signedTransaction);
      },
    };
    let enroll_results = await nonFungibleToken.NonFungibleToken.create(
      nonFungibleTokenProperties,
      nft_issuer,
      defaultOverrides
    );
    console.log(enroll_results);
    console.log("Symbol:", nonFungibleTokenProperties.symbol);

    // 7. Approve the Program
    let seatLimit = 10;
    let nftState = {
      tokenFees: [
        { action: NonFungibleTokenActions.transfer, feeName: "default" },
        {
          action: NonFungibleTokenActions.transferOwnership,
          feeName: "default",
        },
        { action: NonFungibleTokenActions.acceptOwnership, feeName: "default" },
      ],
      endorserList: [],
      endorserListLimit: 3,
      mintLimit: seatLimit,
      transferLimit: 1,
      burnable: true,
      transferable: true,
      modifiable: true,
      pub: false, // not public
    };
    let approve_1 = await nonFungibleToken.NonFungibleToken.approveNonFungibleToken(
      courseName,
      nft_provider,
      nftState
    );
    let approve_2 = await nonFungibleToken.NonFungibleToken.signNonFungibleTokenStatusTransaction(
      approve_1,
      nft_issuer
    );
    let approve_3 = await nonFungibleToken.NonFungibleToken.sendNonFungibleTokenStatusTransaction(
      approve_2,
      nft_middleware
    );

    console.log("Approve 1 : ", approve_1);
    console.log("Approve 2 : ", approve_2);
    console.log("Approve 3 : ", approve_3);

    // 8. Enroll the user
    var theId = Math.floor(Math.random() * 10 + 1);
    var minter = new NonFungibleToken(courseName, nft_issuer); // query NFT created before
    let itemId = courseName + "#" + theId;
    let properties = "Course " + courseName + " - Seat #" + theId;
    let itemProp = {
      symbol: courseName, // value must be same with NFT symbol, the parent
      itemID: itemId, // value must be unique for same NFT
      properties: properties,
      metadata: properties,
    } as nonFungibleToken.NonFungibleTokenItem;
    let overrides = { memo: itemId + " transferred to " + wallet.address }; // optional

    let mint_1 = await minter.mint(nft_issuer.address, itemProp);
    let mint_2 = await NonFungibleTokenItem.fromSymbol(
      courseName,
      itemId,
      nft_issuer
    );
    let mint_3 = await mint_2.getState();
    let mint_4 = await mint_2.transfer(wallet.address, overrides);

    console.log("Mint item receipt 1 :", mint_1);
    console.log("Mint item receipt 2 :", mint_2);
    console.log("Mint item receipt 3 :", mint_3);
    console.log("Mint item receipt 4 :", mint_4);
    console.log("Transfer NFT item receipt:", JSON.stringify(mint_4));

    // 9. Check who is in the program
    wallet.getTransactionCount().then((nonce) => {
      console.log("wallet Transaction Count: " + mxw.utils.formatMxw(nonce));
    });
    nft_issuer.getTransactionCount().then((nonce) => {
      console.log(
        "nft_issuer Transaction Count: " + mxw.utils.formatMxw(nonce)
      );
    });
    let end_list = await mint_2.getTransferTransactionRequest(wallet.address);
    console.log(end_list);

    // 10. Transfer money from provider to user
    let amount = mxw.utils.parseMxw("1.0");
    var before_testing = await wallet.getBalance();
    var transfer_to_user = await nft_provider.transfer(wallet.address, amount);
    var after_testing = await wallet.getBalance();

    console.log("Before Balance: ", before_testing.toString());
    console.log("After Balance: ", after_testing.toString());
  };

  function LandingPage() {
    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-md-offset-2 intro-text">
                  <h1>
                    <Twemoji svg text="Well & Fair 💖" />
                  </h1>

                  <span></span>
                  <p>Fairway to use your well-earned crypto-coins!</p>
                  <Link
                    className="btn btn-custom btn-lg page-scroll"
                    to="/createWallet"
                  >
                    Create your wallet
                  </Link>
                  <br />
                  <br />
                  <Link
                    to="/loadWallet"
                    className="btn btn-custom btn-lg page-scroll"
                    onClick={() => {}}
                  >
                    Load your Wallet
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function SectionCreateWallet() {
    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 text-center col-md-offset-2 intro-info">
                  <h4>Sign Up</h4>
                  <hr />
                  <br />
                  <Form fluid>
                    <FormGroup>
                      <ControlLabel>
                        Full Name{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl name="name" placeholder="John Doe" />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>
                        Email{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl
                        name="email"
                        type="email"
                        placeholder="John.Doe@gmail.com"
                      />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>
                        Driver License Number{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl
                        name="Driver License"
                        placeholder="F255-921-50-094-0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Phone Number </ControlLabel>
                      <FormControl name="phone" placeholder="202-555-0154" />
                    </FormGroup>

                    <FormGroup>
                      <ButtonToolbar>
                        <Link
                          className="btn btn-custom btn-lg page-scroll"
                          to="/loading"
                        >
                          Submit
                        </Link>
                      </ButtonToolbar>
                    </FormGroup>
                  </Form>
                  <Link className="btn btn-custom2 btn-lg page-scroll" to="/">
                    <i className="fas fa-arrow-left"></i>
                  </Link>
                  <br />
                  <br />
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>{" "}
                  Required Field
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function SectionLoadWallet() {
    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 text-center col-md-offset-2 intro-info">
                  <h4>Load Wallet</h4>
                  <hr />
                  <br />
                  <Form fluid>
                    <FormGroup>
                      <ControlLabel>
                        Email{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl
                        name="email"
                        placeholder="John.Doe@gmail.com"
                        type="email"
                      />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>
                        First Mnemonic Phrase{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl placeholder="unaware" name="first" />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>
                        Last Mnemonic Phrase{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl placeholder="bracket" name="last" />
                    </FormGroup>

                    <FormGroup>
                      <ButtonToolbar>
                        <Link
                          className="btn btn-custom btn-lg page-scroll"
                          to="/loadingLoad"
                        >
                          Submit
                        </Link>
                      </ButtonToolbar>
                    </FormGroup>
                  </Form>
                  <br />
                  <Link className="btn btn-custom2 btn-lg page-scroll" to="/">
                    <i className="fas fa-arrow-left"></i>
                  </Link>
                  <br />
                  <br />
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>{" "}
                  Required Field
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function SectionLoading() {
    const [message, setMessage] = useState("[ KYC ] Provider Signing");

    useEffect(() => {
      console.log("--");
      const timer = setTimeout(() => {
        setMessage("[ KYC ] Issuer Signing");

        setTimeout(() => {
          setMessage("[ KYC ] Verifing Transaction Signature");

          setTimeout(() => {
            setMessage("[ KYC ] Whitelisting a Wallet Address");

            setTimeout(() => {
              history.push("/mainDash");
              window.location.reload();
            }, 1500);
          }, 1500);
        }, 1500);
      }, 1500);
      return () => clearTimeout(timer);
      console.log("--");
    }, []);

    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-md-offset-2 intro-info">
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <Loader center size="lg" content={message} vertical />
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function SectionLoadingLoad() {
    const [message, setMessage] = useState("[ KYC ] Loading Wallet");

    useEffect(() => {
      console.log("--");
      const timer = setTimeout(() => {
        setMessage("[ KYC ] Verifying if Wallet is Whitelisted");

        setTimeout(() => {
          history.push("/mainDash");
          window.location.reload();
        }, 1500);
      }, 1500);
      return () => clearTimeout(timer);
      console.log("--");
    }, []);

    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-md-offset-2 intro-info">
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <Loader center size="lg" content={message} vertical />
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function SectionMainDash() {
    const temp_dat = [
      {
        id: "MXW",
        data: [
          {
            x: -15,
            y: 35,
          },
          {
            x: -5,
            y: 30,
          },
          {
            x: 60,
            y: 90,
          },
          {
            x: -20,
            y: 70,
          },
          {
            x: -10,
            y: 60,
          },
        ],
      },
    ];

    function renderRaise(number: any) {
      const isPositive = number > 0;
      const isNegative = number < 0;
      return (
        <span
          style={{
            paddingLeft: 15,
            color: isNegative ? "red" : "green",
          }}
        >
          <span>{isPositive ? "+" : null}</span>
          <span>{number}</span>
        </span>
      );
    }
    const list_data = [
      {
        title: "Purchase: Face Mask",
        date: "2020.09.30",
        peak: 70,
        peakRaise: -10,
        uv: 433,
        uvRaise: 33,
      },
      {
        title: "Purchase: Food Bank",
        date: "2020.09.29",
        peak: 80,
        peakRaise: -20,
        uv: 238,
        uvRaise: 28,
      },
      {
        title: "JTPA Approved",
        date: "2020.09.28",
        peak: 100,
        peakRaise: 60,
        uv: 239,
        uvRaise: 29,
      },
      {
        title: "Purchase: Water",
        date: "2020.09.27",
        peak: 40,
        peakRaise: -5,
        uv: 921,
        uvRaise: 91,
      },
      {
        title: "Purchase: Hair Cut",
        date: "2020.09.26",
        peak: 55,
        peakRaise: -15,
        uv: 321,
        uvRaise: 132,
      },
    ];
    const styleCenter = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      // height: "60px",
    };
    const slimText = {
      fontSize: "0.666em",
      color: "#97969B",
      fontWeight: "lighter",
      paddingBottom: 5,
    };
    const titleStyle = {
      paddingBottom: 5,
      whiteSpace: "nowrap",
      fontWeight: 500,
    };
    const dataStyle = {
      fontSize: "1.2em",
      fontWeight: 500,
    };

    const [opening, setOpening] = useState(false);

    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-md-offset-2 text-center intro-info">
                  <div
                    style={{
                      minWidth: 0,
                      height: "60vh",
                    }}
                  >
                    <h4>John's Current MXW Balance </h4>
                    <h1>
                      <Twemoji svg text=" 60 Ⓜ️" />
                    </h1>
                    <br />

                    {/*  */}
                    <hr />
                    <h4>Available Grants</h4>
                    <br />
                    <div style={{ width: "100%" }}>
                      <Table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">
                              <a href="https://en.wikipedia.org/wiki/Community_Development_Block_Grant">
                                CDB Grant
                              </a>
                            </th>
                            <td>80 mxw</td>
                            <td>
                              <IconButton
                                color="yellow"
                                icon={<Icon icon="spinner" spin />}
                                onClick={() =>
                                  Swal.fire({
                                    icon: "info",
                                    title: "Pending...",
                                    text: "Your application is pending.",
                                  })
                                }
                                placement="right"
                              >
                                Pending
                              </IconButton>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <a href="https://en.wikipedia.org/wiki/Job_Training_Partnership_Act">
                                JTPA
                              </a>
                            </th>
                            <td>60 mxw</td>
                            <td>
                              <IconButton
                                color="cyan"
                                icon={<Icon icon="check" />}
                                onClick={() =>
                                  Swal.fire({
                                    icon: "success",
                                    title: "Approved!",
                                    text: "Your application has been approved.",
                                  })
                                }
                                placement="right"
                              >
                                Approved
                              </IconButton>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <a href="https://en.wikipedia.org/wiki/Magnet_Schools_Assistance_Program">
                                MSAP
                              </a>
                            </th>
                            <td>90 mxw</td>
                            <td>
                              <IconButton
                                color="red"
                                icon={<Icon icon="close" />}
                                onClick={() =>
                                  Swal.fire({
                                    icon: "error",
                                    title: "Rejected",
                                    text: "Your application has been rejected.",
                                  })
                                }
                                placement="right"
                              >
                                Declined
                              </IconButton>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">
                              <a href="https://en.wikipedia.org/wiki/Aid_to_Families_with_Dependent_Children">
                                Aid to Families
                              </a>
                            </th>
                            <td>70 mxw</td>
                            <td>
                              <IconButton
                                color="green"
                                icon={<Icon icon="money" />}
                                onClick={() => {
                                  history.push("/loanApplication");
                                  window.location.reload();
                                }}
                                placement="right"
                              >
                                Apply
                              </IconButton>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>

                    {/*  */}
                    <hr />
                    <h4>Wallet Activity</h4>
                    <ResponsiveLine
                      data={temp_dat}
                      margin={{ top: 50, right: 25, bottom: 15, left: 25 }}
                      xScale={{ type: "point" }}
                      yScale={{
                        type: "linear",
                        min: 0,
                        max: "auto",
                        stacked: false,
                        reverse: false,
                      }}
                      curve="cardinal"
                      axisTop={null}
                      axisRight={null}
                      axisBottom={null}
                      axisLeft={{
                        orient: "left",
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "count",
                        legendOffset: -40,
                        legendPosition: "middle",
                      }}
                      enableGridY={false}
                      colors={{ scheme: "set3" }}
                      enableArea={true}
                      areaBlendMode="normal"
                      areaBaselineValue={0}
                      areaOpacity={0.4}
                      lineWidth={5}
                      pointSize={10}
                      pointColor={{ theme: "labels.text.fill" }}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: "serieColor" }}
                      enablePointLabel={true}
                      pointLabel={function (e) {
                        if (e.x < 0) {
                          return "-" + e.x;
                        }
                        return "+" + e.x;
                      }}
                      pointLabelYOffset={-12}
                      enableSlices="x"
                      enableCrosshair={false}
                      crosshairType="top-left"
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
                          symbolBorderColor: "rgba(10, 0, 0, .5)",
                          effects: [
                            {
                              on: "hover",
                              style: {
                                itemBackground: "rgba(0, 10, 0, .03)",
                                itemOpacity: 1,
                              },
                            },
                          ],
                        },
                      ]}
                    />

                    <br />
                    <List hover>
                      {list_data.map((item, index) => (
                        <List.Item
                          key={item["title"]}
                          index={index}
                          onClick={() => {
                            Swal.fire({
                              icon: "info",
                              title: item["title"],
                              text: item["date"],
                            });
                          }}
                        >
                          <FlexboxGrid>
                            {/*Date + Content*/}
                            <FlexboxGrid.Item
                              colspan={12}
                              style={{
                                ...styleCenter,
                                flexDirection: "column",
                                // alignItems: "flex-start",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  paddingBottom: 5,
                                  whiteSpace: "nowrap",
                                  fontWeight: 500,
                                }}
                              >
                                {item["title"]}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.666em",
                                  color: "#97969B",
                                  fontWeight: "lighter",
                                  paddingBottom: 5,
                                }}
                              >
                                <div>{item["date"]}</div>
                              </div>
                            </FlexboxGrid.Item>

                            {/*MXW Change*/}
                            <FlexboxGrid.Item colspan={12} style={styleCenter}>
                              <div style={{ textAlign: "right" }}>
                                <div
                                  style={{
                                    fontSize: "0.666em",
                                    color: "#97969B",
                                    fontWeight: "lighter",
                                    paddingBottom: 5,
                                  }}
                                >
                                  MXW Balance
                                </div>
                                <div style={dataStyle}>
                                  {item["peak"].toLocaleString()}
                                </div>
                              </div>
                              {renderRaise(item["peakRaise"])}
                            </FlexboxGrid.Item>

                            {/*  */}
                          </FlexboxGrid>
                        </List.Item>
                      ))}
                    </List>
                    <br />

                    {/*  */}
                    <h4>Need Something?</h4>
                    <br />
                    <Link
                      className="btn btn-custom btn-lg page-scroll"
                      to="/marketplace"
                    >
                      Market Place
                    </Link>

                    {/*  */}
                    <hr />
                    <h4>Are you a business owner?</h4>
                    <br />
                    <Link
                      className="btn btn-custom btn-lg page-scroll"
                      to="/businessForm"
                    >
                      Activate your <br />
                      business account
                    </Link>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function SectionAdmin() {
    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-md-offset-2 text-center intro-info">
                  <br />
                  <PaginationTable />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function SectionMarketPlace() {
    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-md-offset-2 text-center intro-info">
                  <br />
                  <h4>The Market is Open!</h4>
                  <br />
                  <MarketPlace />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function SectionLoanApplication() {
    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 text-center col-md-offset-2 intro-info">
                  <h4>Grant Application</h4>
                  <hr />
                  <br />
                  <Form fluid>
                    <FormGroup>
                      <ControlLabel>
                        Borrower Name{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl name="name" placeholder="John Doe" />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>
                        Social Security Number{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl placeholder="086981234" />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>
                        City, State, & Zip Code{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl placeholder="Washington, District of Columbia, DC, 20001" />
                    </FormGroup>

                    <FormGroup>
                      <ControlLabel>
                        Grant Purpose{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl
                        rows={3}
                        name="textarea"
                        placeholder="Please describe your intended use of this grant."
                        componentClass="textarea"
                      />
                    </FormGroup>

                    <FormGroup>
                      <ControlLabel>
                        Estimated Asset Value{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl
                        rows={3}
                        componentClass="textarea"
                        placeholder="Please describe the value of your assets here."
                      />
                    </FormGroup>

                    <FormGroup>
                      <ButtonToolbar>
                        <Button
                          className="btn btn-custom btn-lg page-scroll"
                          onClick={() => {
                            Swal.fire({
                              icon: "success",
                              title: "Application Submitted",
                              text: "Your application has been submitted.",
                            }).then(() => {
                              history.push("/mainDash");
                              window.location.reload();
                            });
                          }}
                        >
                          Submit
                        </Button>
                      </ButtonToolbar>
                    </FormGroup>
                  </Form>
                  <Link
                    className="btn btn-custom2 btn-lg page-scroll"
                    to="/mainDash"
                  >
                    <i className="fas fa-arrow-left"></i>
                  </Link>
                  <br />
                  <br />
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>{" "}
                  Required Field
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function SectionBusinessForm() {
    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 text-center col-md-offset-2 intro-info">
                  <h4>Activate Business Account</h4>
                  <hr />
                  <br />
                  <Form fluid>
                    <FormGroup>
                      <ControlLabel>
                        Business Name{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl
                        name="name"
                        placeholder="Grace's Grocery stores"
                      />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>
                        Business License{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl
                        name="Business License"
                        placeholder="13-98443-30"
                      />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>
                        Tax ID{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl name="Tax ID" placeholder="968-635-7472" />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Business Phone Number </ControlLabel>
                      <FormControl name="phone" placeholder="+1-541-754-3010" />
                    </FormGroup>

                    <FormGroup>
                      <ButtonToolbar>
                        <Link
                          className="btn btn-custom btn-lg page-scroll"
                          to="/businessLoading"
                        >
                          Submit
                        </Link>
                      </ButtonToolbar>
                    </FormGroup>
                  </Form>
                  <Link
                    className="btn btn-custom2 btn-lg page-scroll"
                    to="/mainDash"
                  >
                    <i className="fas fa-arrow-left"></i>
                  </Link>
                  <br />
                  <br />
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>{" "}
                  Required Field
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function SectionBusinessLoading() {
    const [message, setMessage] = useState("Verifying Business License");

    useEffect(() => {
      console.log("--");
      const timer = setTimeout(() => {
        setMessage("Verifying Tax ID");

        setTimeout(() => {
          history.push("/businessDash");
          window.location.reload();
        }, 2500);
      }, 2500);
      return () => clearTimeout(timer);
      console.log("--");
    }, []);

    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-md-offset-2 intro-info">
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <Loader center size="lg" content={message} vertical />
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function SectionBusinessDash() {
    function renderRaise(number: any) {
      const isPositive = number > 0;
      const isNegative = number < 0;
      return (
        <span
          style={{
            paddingLeft: 15,
            color: isNegative ? "red" : "green",
          }}
        >
          <span>{isPositive ? "+" : null}</span>
          <span>{number}</span>
        </span>
      );
    }
    const list_data = [
      {
        title: "20170923-Hong Kong independent travel",
        icon: "image",
        creator: "Yvnonne",
        date: "2017.10.13 14:50",
        peak: 3223,
        peakRaise: 433,
        uv: 433,
        uvRaise: 33,
      },
      {
        title: "Celebration of the Mid-Autumn festival",
        icon: "image",
        creator: "Daibiao",
        date: "2017.10.13 14:50",
        peak: 3223,
        peakRaise: 238,
        uv: 238,
        uvRaise: 28,
      },
      {
        title: "Live to play basketball",
        icon: "film",
        creator: "Bidetoo",
        date: "2017.10.13 14:50",
        peak: 4238,
        peakRaise: -239,
        uv: 239,
        uvRaise: 29,
      },
      {
        title: "2018 the legislature meeting broadcast live",
        icon: "film",
        creator: "Yvnonne",
        date: "2017.10.13 14:50",
        peak: 4238,
        peakRaise: 2321,
        uv: 921,
        uvRaise: 91,
      },
      {
        title: "Aiwanke paster",
        icon: "image",
        creator: "Tony",
        date: "2017.10.13 14:50",
        peak: 2321,
        peakRaise: 1321,
        uv: 321,
        uvRaise: 132,
      },
    ];
    const styleCenter = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "60px",
    };
    const slimText = {
      fontSize: "0.666em",
      color: "#97969B",
      fontWeight: "lighter",
      paddingBottom: 5,
    };
    const titleStyle = {
      paddingBottom: 5,
      whiteSpace: "nowrap",
      fontWeight: 500,
    };
    const dataStyle = {
      fontSize: "1.2em",
      fontWeight: 500,
    };

    const temp_dat = [
      {
        id: "facemask",
        color: "hsl(252, 70%, 50%)",
        data: [
          {
            x: "facemask",
            y: 72,
          },
          {
            x: "water",
            y: 53,
          },
          {
            x: "foodbank",
            y: 137,
          },
          {
            x: "gas",
            y: 47,
          },
        ],
      },
      {
        id: "water",
        color: "hsl(295, 70%, 50%)",
        data: [
          {
            x: "facemask",
            y: 242,
          },
          {
            x: "water",
            y: 98,
          },
          {
            x: "foodbank",
            y: 266,
          },
          {
            x: "gas",
            y: 257,
          },
          {
            x: "clothes",
            y: 201,
          },
        ],
      },
      {
        id: "foodbank",
        color: "hsl(352, 70%, 50%)",
        data: [
          {
            x: "facemask",
            y: 98,
          },
          {
            x: "water",
            y: 24,
          },
          {
            x: "foodbank",
            y: 244,
          },
          {
            x: "gas",
            y: 47,
          },
          {
            x: "clothes",
            y: 95,
          },
        ],
      },
      {
        id: "gas",
        color: "hsl(60, 70%, 50%)",
        data: [
          {
            x: "facemask",
            y: 157,
          },
          {
            x: "water",
            y: 89,
          },
          {
            x: "foodbank",
            y: 239,
          },
          {
            x: "gas",
            y: 242,
          },
          {
            x: "clothes",
            y: 26,
          },
        ],
      },
      {
        id: "clothes",
        color: "hsl(210, 70%, 50%)",
        data: [
          {
            x: "facemask",
            y: 189,
          },
          {
            x: "water",
            y: 225,
          },
          {
            x: "foodbank",
            y: 105,
          },
          {
            x: "gas",
            y: 191,
          },
        ],
      },
    ];

    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-md-offset-2 text-center intro-info">
                  <div
                    style={{
                      minWidth: 0,
                      height: "60vh",
                    }}
                  >
                    <h4>Welcome Back Business John 😊</h4>
                    <ResponsiveLine
                      data={temp_dat}
                      margin={{ top: 50, right: 0, bottom: 50, left: 0 }}
                      xScale={{ type: "point" }}
                      yScale={{
                        type: "linear",
                        min: "auto",
                        max: "auto",
                        stacked: false,
                        reverse: false,
                      }}
                      curve="cardinal"
                      axisTop={null}
                      axisRight={null}
                      axisBottom={null}
                      axisLeft={null}
                      enableGridY={false}
                      colors={{ scheme: "set3" }}
                      lineWidth={5}
                      pointSize={10}
                      pointColor={{ theme: "background" }}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: "serieColor" }}
                      pointLabel="y"
                      pointLabelYOffset={-12}
                      areaOpacity={0}
                      enableCrosshair={false}
                      crosshairType="top-left"
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
                    <hr />
                    <h4>
                      {/* axisLeft=
                      {{
                        orient: "left",
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "count",
                        legendOffset: -40,
                        legendPosition: "middle",
                      }} */}
                      <Twemoji
                        svg
                        text="Want to sell your product online? 📦"
                      />
                      <br />
                      <br />
                    </h4>

                    <Link
                      className="btn btn-custom btn-lg page-scroll"
                      to="/productDetails"
                    >
                      <Twemoji svg text="Upload product details" />
                    </Link>
                    <br />

                    <hr />
                    <List hover>
                      {list_data.map((item, index) => (
                        <List.Item key={item["title"]} index={index}>
                          <FlexboxGrid>
                            {/*base info*/}
                            <FlexboxGrid.Item
                              colspan={6}
                              style={{
                                ...styleCenter,
                                flexDirection: "column",
                                alignItems: "flex-start",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  paddingBottom: 5,
                                  whiteSpace: "nowrap",
                                  fontWeight: 500,
                                }}
                              >
                                {item["title"]}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.666em",
                                  color: "#97969B",
                                  fontWeight: "lighter",
                                  paddingBottom: 5,
                                }}
                              >
                                <div>
                                  <Icon icon="user-circle-o" />
                                  {" " + item["creator"]}
                                </div>
                                <div>{item["date"]}</div>
                              </div>
                            </FlexboxGrid.Item>

                            {/*uv data*/}
                            <FlexboxGrid.Item colspan={10} style={styleCenter}>
                              <div style={{ textAlign: "center" }}>
                                <div
                                  style={{
                                    fontSize: "0.666em",
                                    color: "#97969B",
                                    fontWeight: "lighter",
                                    paddingBottom: 5,
                                  }}
                                >
                                  Inventory Count
                                </div>
                                <div style={dataStyle}>
                                  {item["uv"].toLocaleString()}
                                </div>
                              </div>
                              {renderRaise(item["uvRaise"])}
                            </FlexboxGrid.Item>
                            {/*uv data*/}
                            <FlexboxGrid.Item
                              colspan={8}
                              style={{
                                ...styleCenter,
                              }}
                            >
                              <a href="#">View</a>
                              <span style={{ padding: 5 }}>|</span>
                              <a href="#">Edit</a>
                            </FlexboxGrid.Item>
                          </FlexboxGrid>
                        </List.Item>
                      ))}
                    </List>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function SectionCreateQR() {
    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 text-center col-md-offset-2 intro-info">
                  <h4>Product Details</h4>
                  <hr />
                  <br />
                  <Form fluid>
                    <FormGroup>
                      <ControlLabel>
                        Product Name{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl name="name" placeholder="Awesome FaceMask" />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>
                        Price (MXW){" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl placeholder="20" />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>
                        Product Description{" "}
                        <span style={{ color: "red", display: "inline-block" }}>
                          *
                        </span>
                      </ControlLabel>
                      <FormControl
                        rows={5}
                        componentClass="textarea"
                        placeholder="HIGH QUALITY 3 LAYER FACE MASK: Outer layer is effective dust waterproof; Middle layer stop particles; Inner skin-friendly layer absorb the moisture from the breath, which makes it breathable and comfortable to wear. 3 ply face mask can well protect the health of the respiratory system and protect your breathing."
                      />
                    </FormGroup>
                    <h4>Product Image / 3D Model</h4>
                    <br />
                    <FormGroup>
                      <br />
                      <Uploader
                        action="//jsonplaceholder.typicode.com/posts/"
                        draggable
                      >
                        <div style={{ lineHeight: "200px" }}>
                          Click or Drag files to this area to upload
                        </div>
                      </Uploader>
                    </FormGroup>

                    <FormGroup>
                      <ButtonToolbar>
                        <Button
                          className="btn btn-custom btn-lg page-scroll"
                          onClick={() => {
                            Swal.fire({
                              icon: "success",
                              title: "Product Uploaded",
                              text: "Your product details has been uploaded.",
                            }).then(() => {
                              history.push("/businessDash");
                              window.location.reload();
                            });
                          }}
                        >
                          Submit
                        </Button>
                      </ButtonToolbar>
                    </FormGroup>
                  </Form>
                  <Link
                    className="btn btn-custom2 btn-lg page-scroll"
                    to="/businessDash"
                  >
                    <i className="fas fa-arrow-left"></i>
                  </Link>
                  <br />
                  <br />
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>{" "}
                  Required Field
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function SectionProductViewer(id: any) {
    console.log(id);
    return (
      <header id="header">
        <div className="intro">
          <div className="overlay">
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-md-offset-2 intro-info">
                  <h2>Amazing Coffee</h2>
                  <br />

                  <Panel
                    shaded
                    bordered
                    bodyFill
                    style={{ display: "inline-block" }}
                  >
                    <div style={{ width: "100%", textAlign: "center" }}>
                      <Carousel_
                        showArrows={true}
                        infiniteLoop={true}
                        swipeable={true}
                      >
                        <div>
                          <img src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=1" />
                        </div>
                        <div>
                          <img src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=1" />
                        </div>
                        <div>
                          <img src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=1" />
                        </div>
                        <div>
                          <img src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=1" />
                        </div>
                      </Carousel_>
                    </div>
                    <Panel header="RSUITE">
                      <p>
                        <small>
                          A suite of React components, sensible UI design, and a
                          friendly development experience.
                        </small>
                      </p>
                    </Panel>
                  </Panel>
                  <hr />
                  <TagGroup>
                    <Tag color="red">Red</Tag>
                    <Tag color="orange">Orange</Tag>
                    <Tag color="yellow">Yellow</Tag>
                    <Tag color="green">Green</Tag>
                    <Tag color="cyan">Cyan</Tag>
                    <Tag color="blue">Blue</Tag>
                    <Tag color="violet">Violet</Tag>
                  </TagGroup>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <Router>
      <Container className="text-center">
        <Navbar />

        <Switch>
          {/* Main */}
          <Route history={history} exact path="/">
            <LandingPage />
          </Route>
          <Route history={history} path="/createWallet">
            <SectionCreateWallet />
          </Route>
          <Route history={history} path="/loadWallet">
            <SectionLoadWallet />
          </Route>
          <Route history={history} path="/Loading">
            <SectionLoading />
          </Route>
          <Route history={history} path="/LoadingLoad">
            <SectionLoadingLoad />
          </Route>
          <Route history={history} path="/mainDash">
            <SectionMainDash />
          </Route>
          <Route history={history} path="/marketplace">
            <SectionMarketPlace />
          </Route>
          <Route history={history} path="/loanApplication">
            <SectionLoanApplication />
          </Route>
          <Route history={history} path="/admin">
            <SectionAdmin />
          </Route>
          {/* Business */}
          <Route history={history} path="/businessForm">
            <SectionBusinessForm />
          </Route>
          <Route history={history} path="/businessLoading">
            <SectionBusinessLoading />
          </Route>
          <Route history={history} path="/businessDash">
            <SectionBusinessDash />
          </Route>
          <Route history={history} path="/productDetails">
            <SectionCreateQR />
          </Route>
          <Route history={history} path="/productViewer">
            <SectionProductViewer />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}
