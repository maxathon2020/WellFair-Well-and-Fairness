import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
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
} from "reactstrap";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

// ======= ONLINE COURSE ENROL =======
import { nodeProvider } from "../node/node";
import { mxw, token, nonFungibleToken } from "mxw-sdk-js/dist";
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

// === KYC ===
import KycData from "./kyc/data";
import KycProvider from "./kyc/provider";
import KycIssuer from "./kyc/issuer";
import KycValidator from "./kyc/validator";
import KycWhitelistor from "./kyc/whitelistor";

// Student Class
class Student {
  private providerConn: mxw.providers.Provider;
  public studentWallet: string;
  constructor(providerConn: mxw.providers.Provider) {
    this.providerConn = providerConn;
    this.studentWallet = "";
  }

  /**
   * Register new student
   */
  registerNewStudent() {
    // create wallet instance
    let student: mxw.Wallet = mxw.Wallet.createRandom();

    console.log("Wallet address:", student.address);
    // sample output: mxw18mt86al0xpgh2qhvyeqgf8m96xpwz55sdfwc8n
    console.log("Wallet mnemonic:", student.mnemonic);
    // sample output: unaware timber engage dust away host narrow market hurry wave inherit bracket
    this.studentWallet = student.mnemonic;
    this.getStudentInfo(student.mnemonic);
  }

  /**
   * Query wallet from mnemonic or private key.
   * @param mnemonic string FIND ME
   */
  getStudent(theId: { [name: string]: string }): mxw.Wallet {
    //mnemonic: string, privateKey: string
    console.log(theId);
    let student: mxw.Wallet = mxw.Wallet.fromMnemonic(theId["mnemonic"]);

    if (
      theId["mnemonic"] &&
      theId["mnemonic"].length > 0 &&
      theId["mnemonic"].indexOf(" ") > 0
    ) {
      try {
        student = mxw.Wallet.fromMnemonic(theId["mnemonic"]);
      } catch (error) {
        console.log(error);
      }
    }
    if (
      student == undefined &&
      theId["privateKey"] &&
      theId["privateKey"].length > 0 &&
      theId["privateKey"].startsWith("0x")
    ) {
      student = new mxw.Wallet(theId["privateKey"]);
    }

    if (student) {
      student = student.connect(this.providerConn);
    }

    return student;
  }

  /**
   * Get student/wallet info via mnemonic or private key.
   * @param theId string - mnemonic or private key
   */
  getStudentInfo(theId: string) {
    const ids = {
      mnemonic: theId,
      privateKey: theId,
    };
    //mnemonic: string, address: string, privateKey: string
    let student: mxw.Wallet = this.getStudent(ids);

    if (student == undefined) {
      return this.providerConn.getAccountState(theId).then((accState) => {
        console.log("Account state:", JSON.stringify(accState));
      });
    } else {
      console.log("Wallet address:", student.address);
      console.log("Wallet private key:", student.privateKey);

      return student
        .getAccountNumber()
        .then((accountNumber) => {
          console.log("Wallet account number: " + accountNumber.toString());
        })
        .then(() => {
          return student.getBalance().then((balance) => {
            console.log("Wallet balance: " + balance.toString());
          });
        })
        .then(() => {
          return student.isWhitelisted().then((result) => {
            console.log("Is wallet whitelisted: " + result.toString());
          });
        });
    }
  }

  /**
   * Make payment, i.e. transfer MXW
   * @param studentId string of mnemonic or private key, for use to retrieve wallet.
   * @param amount BigNumber
   */
  makePayment(studentId: string, amount: BigNumber) {
    let student = this.getStudent({
      mnemonic: studentId,
      privateKey: studentId,
    });

    if (student) {
      return student
        .transfer(nodeProvider.nonFungibleToken.feeCollector, amount)
        .then((receipt) => {
          console.log("Receipt", JSON.stringify(receipt));
          return Promise.resolve();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("Unable to verify student identity");
      return Promise.resolve();
    }
  }
}

// Course Class
let provider: mxw.Wallet;
let issuer: mxw.Wallet;
let middleware: mxw.Wallet;
let nonFungibleTokenProperties: nonFungibleToken.NonFungibleTokenProperties;
let defaultOverrides = {
  logSignaturePayload: function (payload: string) {
    console.log("signaturePayload:", JSON.stringify(payload));
  },
  logSignedTransaction: function (signedTransaction: string) {
    console.log("signedTransaction:", signedTransaction);
  },
};
class Course {
  private providerConn: mxw.providers.Provider;
  constructor(providerConn: mxw.providers.Provider) {
    this.providerConn = providerConn;

    provider = mxw.Wallet.fromMnemonic(
      nodeProvider.nonFungibleToken.provider
    ).connect(providerConn); //mxw1dww3nwtpvfcq2h94rmlftwywy7skc48yaku27p
    issuer = mxw.Wallet.fromMnemonic(
      nodeProvider.nonFungibleToken.issuer
    ).connect(this.providerConn); //mxw1nj5xdz6ychva2mjr7dnzp36tsfzefphadq230m
    middleware = mxw.Wallet.fromMnemonic(
      nodeProvider.nonFungibleToken.middleware
    ).connect(providerConn); //mxw1qgwzdxf66tp5mjpkpfe593nvsst7qzfxzqq73d
  }

  /**
   * Create new NFT
   * @param courseName string
   */
  createNewCourse(courseName: string) {
    nonFungibleTokenProperties = {
      name: courseName,
      symbol: courseName,
      fee: {
        to: nodeProvider.nonFungibleToken.feeCollector,
        value: bigNumberify("1"),
      },
      metadata: "Course " + courseName,
      properties: courseName,
    };

    // create NFT using above properties
    return nonFungibleToken.NonFungibleToken.create(
      nonFungibleTokenProperties,
      issuer,
      defaultOverrides
    )
      .then((token) => {
        console.log(token);
        console.log("Symbol:", nonFungibleTokenProperties.symbol);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Approve course
   * @param courseSymbol string
   * @param seatLimit number
   */
  approveCourse(courseSymbol: string, seatLimit: number) {
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

    // provider approves NFT, at same time, set NFT with above state
    return nonFungibleToken.NonFungibleToken.approveNonFungibleToken(
      courseSymbol,
      provider,
      nftState
    )
      .then((transaction) => {
        // issuer signs NFT status transaction
        return nonFungibleToken.NonFungibleToken.signNonFungibleTokenStatusTransaction(
          transaction,
          issuer
        );
      })
      .then((transaction) => {
        // middleware sends NFT NFT status transaction
        return nonFungibleToken.NonFungibleToken.sendNonFungibleTokenStatusTransaction(
          transaction,
          middleware
        ).then((receipt) => {
          console.log(receipt);
          return receipt;
        });
      });
  }

  /**
   * Enrol student to a course
   * @param student mxw.Wallet
   * @param courseSymbol string
   * @param theId number
   */
  enrolStudentToCourse(
    student: mxw.Wallet,
    courseSymbol: string,
    theId: number
  ) {
    return this.mintItem(courseSymbol, theId) // mint course entry pass
      .then((nftItem) => {
        let itemId = courseSymbol + "#" + theId;
        return this.transferItem(nftItem, itemId, student); // tranfer pass to student
      })
      .catch((error) => {
        // handle error, if any
        console.log("enrolStudentToCourse", error);
        throw error;
      });
  }

  /**
   * Mint NFT item
   * @param courseSymbol string
   * @param theId number
   */
  mintItem(courseSymbol: string, theId: number) {
    var minter = new NonFungibleToken(courseSymbol, issuer); // query NFT created before
    let itemId = courseSymbol + "#" + theId;
    let properties = "Course " + courseSymbol + " - Seat #" + theId;
    let itemProp = {
      symbol: courseSymbol, // value must be same with NFT symbol, the parent
      itemID: itemId, // value must be unique for same NFT
      properties: properties,
      metadata: properties,
    } as nonFungibleToken.NonFungibleTokenItem;

    // mint item to issuer wallet, with item properties defined above
    return minter
      .mint(issuer.address, itemProp)
      .then((receipt) => {
        console.log("Mint item receipt:", receipt);
        return NonFungibleTokenItem.fromSymbol(courseSymbol, itemId, issuer);
      })
      .then((nftItem) => {
        return this.getNftItemState(nftItem); // print out the NFT item state
      })
      .catch((error) => {
        // handle error, if any
        console.log("mintItem", error);
        throw error;
      });
  }

  /**
   * Transfer NonFungibleTokenItem to a Wallet
   * @param nftItem NonFungibleTokenItem
   * @param itemId string
   * @param student mxw.Wallet
   */
  transferItem(
    nftItem: NonFungibleTokenItem,
    itemId: string,
    student: mxw.Wallet
  ) {
    let overrides = { memo: itemId + " transferred to " + student.address }; // optional

    // transfer NFT item to student
    return nftItem
      .transfer(student.address, overrides)
      .then((receipt) => {
        console.log("+++++ HERE +++++");
        console.log("Transfer NFT item receipt:", JSON.stringify(receipt));
        return nftItem;
      })
      .then((nftItem) => {
        return this.getNftItemState(nftItem); // print out the NFT item state
      })
      .catch((error) => {
        // handle error, if any
        console.log("transferItem", error);
        throw error;
      });
  }

  /**
   * Query and print NFT item state
   * @param nftItem NonFungibleTokenItem
   */
  getNftItemState(nftItem: NonFungibleTokenItem) {
    return nftItem
      .getState() // query NFT item state
      .then((itemState) => {
        console.log("Item state:", JSON.stringify(itemState)); // print NFT item state
        return nftItem;
      })
      .catch((error) => {
        // handle error, if any
        console.log("getNftItemState", error);
        throw error;
      });
  }

  /**
   * Query course entry pass (NFT item)
   * @param courseSymbol string
   * @param id number
   */
  getCourseEntryPass(courseSymbol: string, id: number) {
    let itemId = courseSymbol + "#" + id;
    return NonFungibleTokenItem.fromSymbol(courseSymbol, itemId, issuer).then(
      (theItem) => {
        this.getNftItemState(theItem);
      }
    );
  }

  /**
   * Mint NFT item in bulk, can only do one by one
   */
  async bulkMintItem() {
    const courseSymbol: string = "Account6";

    const minter = new NonFungibleToken(courseSymbol, issuer); // query NFT created before

    let itemId: string;
    let properties;
    let itemProp = {} as nonFungibleToken.NonFungibleTokenItem;

    for (let i = 18; i < 20; i++) {
      itemId = courseSymbol + "#" + i;
      properties = "Course " + courseSymbol + " - Seat #" + i;
      itemProp = {
        symbol: courseSymbol, // value must be same with NFT symbol, the parent
        itemID: itemId, // value must be unique for same NFT
        properties: properties,
        metadata: properties,
      } as nonFungibleToken.NonFungibleTokenItem;
      // mint item to issuer wallet, with item properties defined above
      await minter
        .mint(issuer.address, itemProp)
        .then((receipt) => {
          console.log("Mint item receipt:", JSON.stringify(receipt));
          return NonFungibleTokenItem.fromSymbol(courseSymbol, itemId, issuer);
        })
        .then((nftItem) => {
          return this.getNftItemState(nftItem); // print out the NFT item state
        })
        .catch((error) => {
          // handle error, if any
          console.log("mintItem", error);
          throw error;
        });
    }
  }

  /**
   * Get course (NFT) info such as state, is frozen, is usable and is approved
   * @param courseSymbol
   */
  getCourseInfo(courseSymbol: string) {
    let course = new NonFungibleToken(courseSymbol, issuer);
    console.log("State for course", courseSymbol);

    return course
      .getState()
      .then((state) => {
        console.log(" >> ", state);
        console.log(" >> Course is approved?", course.isApproved);
        console.log(" >> Course is frozen?", course.isFrozen);
        if (course.isApproved) {
          console.log(" >> Course is usable?", course.isUsable);
        } else {
          console.log(" >> Course is not ready for use");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

// Online Learning
let providerConn: mxw.providers.Provider;
class OnlineLearning {
  private student: Student;
  private course: Course;

  constructor() {
    providerConn = new mxw.providers.JsonRpcProvider(
      nodeProvider.connection,
      nodeProvider
    );

    this.student = new Student(providerConn);
    this.course = new Course(providerConn);
  }

  // Create Wallet
  registerNewStudent() {
    this.student.registerNewStudent();
  }

  // Create NFT
  addCourse(courseName: string) {
    this.course.createNewCourse(courseName);
  }

  // Approve NFT
  approveCourse(courseSymbol: string, seatLimit: number) {
    this.course.approveCourse(courseSymbol, seatLimit);
  }

  // Mint and transfer NFT item
  enrolStudentToCourse(
    studentId: string,
    courseSymbol: string,
    enrolCount: number
  ) {
    let student: mxw.Wallet = this.student.getStudent({
      mnemonic: studentId,
      privateKey: studentId,
    });

    if (student) {
      this.course.enrolStudentToCourse(student, courseSymbol, enrolCount);
    }
  }

  // Mint NFT item in bulk
  bulkMintItem() {
    this.course.bulkMintItem();
  }

  // Get Wallet info via mnemonic, wallet address or private key
  getStudentInfo(theId: string) {
    this.student.getStudentInfo(theId);
  }

  // Get NFT info
  getCourseInfo(courseName: string) {
    this.course.getCourseInfo(courseName);
  }

  // Make payment
  studentMakePayment(wallet: string, amount: BigNumber) {
    this.student.makePayment(wallet, amount);
  }

  // return student object
  getStudent() {
    return this.student;
  }

  main() {
    console.log("Action:", process.argv[2]);

    for (let i = 3; ; i++) {
      if (process.argv[i] == undefined) {
        break;
      }
      console.log(">> Param#", i - 2, ":", process.argv[i]);
    }

    try {
      switch (process.argv[2]) {
        case "registerNewStudent":
          this.registerNewStudent();
          break;
        case "addCourse":
          this.addCourse(process.argv[3]);
          break;
        case "getCourseInfo":
          this.getCourseInfo(process.argv[3]);
          break;
        case "approveCourse":
          this.approveCourse(process.argv[3], parseInt(process.argv[4]));
          break;
        case "studentMakePayment":
          this.studentMakePayment(
            process.argv[3],
            bigNumberify(process.argv[4])
          );
          break;
        case "enrolStudentToCourse":
          this.enrolStudentToCourse(
            process.argv[3],
            process.argv[4],
            parseInt(process.argv[5])
          );
          break;
        case "getStudentInfo":
          this.getStudentInfo(process.argv[3]);
          break;
        default:
          console.log(
            "Please enter module name, followed by its parameter(s), if applicable."
          );
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (providerConn) {
        providerConn.removeAllListeners();
      }
    }
  }
}

let silentRpc = nodeProvider.trace.silentRpc;
let providerConnection: mxw.providers.Provider;
/**
 * KYC initialization
 */
providerConnection = new mxw.providers.JsonRpcProvider(
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

provider = mxw.Wallet.fromMnemonic(nodeProvider.kyc.provider).connect(
  providerConnection
);

// mxw1ngx32epz5v5gyunepkarfh4lt0g6mqr79aq3ex
issuer = mxw.Wallet.fromMnemonic(nodeProvider.kyc.issuer).connect(
  providerConnection
);

// mxw1mklypleqjhemrlt6z625rzqa0jl6namdmmqnx4
middleware = mxw.Wallet.fromMnemonic(nodeProvider.kyc.middleware).connect(
  providerConnection
);

async function walletGet() {
  let wallet = mxw.Wallet.createRandom().connect(providerConnection);

  /**
   * Sign KYC address
   */
  const kycData: mxw.KycData = await new KycData(wallet).signKycAddress();

  /**
   * Provider Sign KYC Data
   */
  const partialSignedTrx: mxw.KycTransaction = await new KycProvider(
    provider,
    kycData
  ).signTransaction();

  /**
   *  Issuer Sign KYC Data
   */
  const allSignedTrx: mxw.KycTransaction = await new KycIssuer(
    issuer,
    partialSignedTrx
  ).signTransaction();

  /**
   * Verify Transaction Signature
   */
  const isValidSignature: Boolean = await new KycValidator(
    allSignedTrx
  ).isValidSignature();

  /**
   * Whitelist a Wallet Address
   */
  const whitelistReceipt: mxw.providers.TransactionReceipt = await new KycWhitelistor(
    middleware,
    allSignedTrx
  ).whitelist();

  console.log("Wallet Address", "-", wallet.address);
  console.log("Wallet Mnemonic", "-", wallet.mnemonic);
  console.log("Receipt Hash", "-", whitelistReceipt.hash);

  const green = "\x1b[32m";
  const red = "\x1b[31m";
  let result: String = (await (isValidSignature && wallet.isWhitelisted()))
    ? `${green}wallet number  creation & whitelist success!`
    : `${red}wallet number  creation & whitelist failed!`;
  console.log(result);
  console.log("\x1b[33m%s\x1b[0m", result); //yellow

  // var myOnline = new OnlineLearning();
  // 1. Reg new student
  // myOnline.registerNewStudent();
  // var studentWalletMine = wallet.mnemonic;

  // 2. Add new course NFT
  // myOnline.addCourse("test5");

  // 3. Approve Course
  // myOnline.approveCourse("test5", 300);

  // 4. Get Course into
  // myOnline.getCourseInfo("test5");

  // 5.1 See my Student
  // console.log(studentWalletMine);
  // myOnline.enrolStudentToCourse(studentWalletMine, "test5", 75);
}

// ======= ONLINE COURSE ENROL =======

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [createWalletS, setCreateWalletS] = useState(false);

  const [userWalletM, setUserWalletM] = useState("");
  const [showWallet, setShowWallet] = useState(true);
  const [showLoans, setShowLoans] = useState(true);

  // === TEMP Variable for Enrollment ===
  // const myOnline = new OnlineLearning();
  // === TEMP Variable for Enrollment ===

  useEffect(() => {});

  const toggle = () => setIsOpen(!isOpen);
  const createWallet = async () => {
    // 1. ask for personal details
    var personalDetails = prompt("What is your name?");
    console.log(personalDetails);
    console.log(provider);
    console.log(issuer);
    console.log(middleware);

    // 2. Create the wallet
    let wallet = mxw.Wallet.createRandom().connect(providerConnection);

    // === 3. KYC Process ===
    const kycData: mxw.KycData = await new KycData(wallet).signKycAddress();
    // Provider Sign KYC Data
    const partialSignedTrx: mxw.KycTransaction = await new KycProvider(
      provider,
      kycData
    ).signTransaction();
    // Issuer Sign KYC Data
    const allSignedTrx: mxw.KycTransaction = await new KycIssuer(
      issuer,
      partialSignedTrx
    ).signTransaction();
    // Verify Transaction Signature
    const isValidSignature: Boolean = await new KycValidator(
      allSignedTrx
    ).isValidSignature();
    //  Whitelist a Wallet Address
    const whitelistReceipt: mxw.providers.TransactionReceipt = await new KycWhitelistor(
      middleware,
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

    // 5. Redirect to new section
    setShowWallet(false);
    setShowLoans(true);
    // -- Create Wallet End --
  };

  // 1. Create Wallet Section
  function SectionCreateWallet() {
    return (
      <Jumbotron>
        <h1 className="display-3">Welcome to Well and Fair</h1>
        <p className="lead">
          If this is your first visit we should create a wallet first.
        </p>
        <hr className="my-2" />
        <p>
          It uses utility classes for typography and spacing to space content
          out within the larger container.
        </p>
        <Button
          color="primary"
          size="lg"
          block
          onClick={() => setCreateWalletS(!createWalletS)}
        >
          Create Wallet
        </Button>
        <Collapse isOpen={createWalletS}>
          <Card>
            <CardBody>
              Anim pariatur cliche reprehenderit, enim eiusmod high life
              accusamus terry richardson ad squid. Nihil anim keffiyeh
              helvetica, craft beer labore wes anderson cred nesciunt sapiente
              ea proident.
            </CardBody>
          </Card>
        </Collapse>
        <br />
        <Button color="success" size="lg" block>
          Log In to Wallet
        </Button>
      </Jumbotron>
    );
  }

  // 2. Show Loan Types
  function ShowLoanTypes() {
    function enrollLoan() {
      console.log(userWalletM);

      // 2. Add new course NFT
      // myOnline.addCourse("test6");

      // 3. Approve Course
      // myOnline.approveCourse("test6", 300);

      // 4. Get Course into
      // myOnline.getCourseInfo("test6");

      // 5. Enroll the user
      // myOnline.enrolStudentToCourse(userWalletM, "test6", 1);

      console.log("Function for enrolling");
    }

    return (
      <ListGroup style={{ fontSize: "250%" }}>
        <ListGroupItem color="success" className="justify-content-between">
          Interest Rate 2%<Badge pill>95/100 Left</Badge>
          <br />
          <Button color="info" onClick={() => enrollLoan()}>
            Enroll in Program
          </Button>
        </ListGroupItem>
        <ListGroupItem color="primary" className="justify-content-between">
          Interest Rate 5%
          <Badge pill>95/100 Left</Badge>
          <br />
          <Button color="info" onClick={() => enrollLoan()}>
            Enroll in Program
          </Button>
        </ListGroupItem>
        <ListGroupItem color="danger" className="justify-content-between">
          Interest Rate 10%
          <Badge pill>95/100 Left</Badge>
          <br />
          <Button color="info" onClick={() => enrollLoan()}>
            Enroll in Program
          </Button>
        </ListGroupItem>
      </ListGroup>
    );
  }

  return (
    <div className="App">
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Well & Fair</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/about">about</NavLink>
            </NavItem>
          </Nav>
          <NavbarText>Create Wallet</NavbarText>
        </Collapse>
      </Navbar>

      <Container className="themed-container text-center">
        {showWallet ? <SectionCreateWallet /> : null}
        {showLoans ? <ShowLoanTypes /> : null}
      </Container>
    </div>
  );
}

export default App;
