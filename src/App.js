import "./styles.css";
import React from "react";
import AccountManagement from "./components/users/AccountManagement";
import Home from "./components/Home";
import Splash from "./components/Splash";
import MyWorkouts from "./components/MyWorkouts";
import Workout from "./components/workout/Workout";
import AppTabBar from "./components/standard-page-parts/AppTabBar";
import { FirebaseContext } from "./config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends React.Component {
  static contextType = FirebaseContext;

  constructor(props) {
    super(props);
    this.state = {
      user: {
        uuid: null,
        name: null,
        userEmail: null,
        height: null,
        weight: null
      },
      showLogin: false,
      signUp: false
    };

    this.loginElement = React.createRef();
    this.signUpElement = React.createRef();
    this.tabMenuElement = React.createRef();

    this.handleLogIn = this.handleLogIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.showSignUp = this.showSignUp.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.updateUserDetails = this.updateUserDetails.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  // This function carries out the log in of a user to the application.
  // This is passed to a log-in component from App, and the log in occurs
  // on the app so the updated state can be propagated to other components via props.
  async handleLogIn(email, password) {
    // console.log("Sign in pressed");
    let user = null;
    await signInWithEmailAndPassword(this.context.auth, email, password)
      .then((userCredential) => {
        //If we enter this zone, the log in has been successful
        user = userCredential.user;
        this.context.user = user;
        this.context.authCredential = userCredential;
      })
      .catch((error) => {
        //The log in has failed and Firebase will return this error message
        //For now, this is output to console, but taking this response and
        //outputting to a modal would be a good addition
        const errorCode = error.code;
        // const errorMessage = error.message;
        //We use the ref created for the child of this component to directly call functions that change the state on that component.
        //This allows us to hide the circular progress and display an alert to screen.
        this.loginElement.current.receiveError(errorCode);
        this.loginElement.current.handleSubmit();
      });
    //This is what a database lookup in Firestore looks like
    //The docRef returns the address of a given document (arg3) in a given collection (arg2) within the Firestore (arg1)

    if (user !== null) {
      //Our data on users is stored in a document in the "users" collection that uses the UID of the user as a name.
      const docRef = doc(this.context.database, "users", user.uid);
      const docSnap = await getDoc(docRef);
      //We try to use the data only if getDoc receives a response. In this case we have verified that the user has an associated record in the database
      if (docSnap.exists()) {
        const data = docSnap.data();
        //We now set State inside this response, as we need to combine the records of the user from the Auth and the DB
        this.loginElement.current.handleSubmit();
        this.tabMenuElement.current.handleClose();
        this.setState({
          showLogin: false,
          user: {
            uuid: this.context.user.uid,
            name: data.name,
            height: data.height,
            weight: data.weight,
            userEmail: this.context.user.email
          }
        });

        // console.log(this.state.showLogin)
        // this.setState({user:{name: docSnap.data().name}})
      } else {
        console.log("User ID not found in database");
      }
    }

    // console.log("Parent Component logging in state:" + this.state.loggingIn);
  }

  async handleSignUp(name, email, password, weight = 0, height = 0) {
    let user = null;
    // console.log("User Sign up requested. Name: " + name + ", Email: " + email + ", password " + password + ", weight:" + weight + ", height: " + height)
    await createUserWithEmailAndPassword(this.context.auth, email, password)
      .then((userCredential) => {
        user = userCredential.user;
        this.context.user = user;
        this.context.authCredential = userCredential;
        if (!weight) {
          weight = 0;
        }
        if (!height) {
          height = 0;
        }
        if (!name) {
          name = email;
        }
        setDoc(doc(this.context.database, "users", user.uid), {
          name: name,
          weight: weight,
          height: height
        });
        this.signUpElement.current.handleSignUpProcessing();
        this.tabMenuElement.current.handleClose();
        this.setState({
          signUp: false,
          user: { uuid: user.uid, name: name, userEmail: user.email }
        });
      })
      .catch((error) => {
        let errorMessage = "Error occurred";
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // this.signUpElement.current.handleSignUpProcessing();
        console.log(error.code);
        if (error === "db/name-not-provided") {
          errorMessage = "Please provide a name";
        } else if (
          error.code === "auth/missing-email" ||
          error.code === "auth/invalid-email"
        ) {
          errorMessage = "Missing or Invalid Email Address";
        } else if (error.code === "auth/weak-password") {
          errorMessage = "Password must be at least 6 characters";
        } else if (error.code === "auth/email-already-in-use") {
          errorMessage = "Email is already in use.";
        }

        this.signUpElement.current.receiveError(errorMessage);
        this.signUpElement.current.handleSignUpProcessing();
      });
  }

  async updateUserDetails(name, weight, height) {
    await setDoc(doc(this.context.database, "users", this.context.user.uid), {
      name: name,
      weight: weight,
      height: height
    }).then(() => {
      this.setState({
        user: {
          uuid: this.state.user.uuid,
          userEmail: this.state.user.userEmail,
          name: name,
          weight: weight,
          height: height
        }
      });
      console.log(this.state.user);
    });
  }

  async deleteUser() {
    console.log("Delete function on main component called");
    await deleteUser(this.context.auth.currentUser)
      .then(() => {
        const docRef = doc(
          this.context.database,
          "users",
          this.context.user.uid
        );
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            console.log("User documents found in Database, Deleting...");
            deleteDoc(docRef);
          } else {
            console.log(
              "User ID not found in database, no documents to delete. This may be an error"
            );
          }
        });

        this.setState({
          user: {
            uuid: null,
            name: null,
            userEmail: null,
            height: null,
            weight: null
          }
        });
      })
      .catch((error) => {
        console.log("An error occurred.");
      });
  }

  logOut() {
    this.setState({
      user: {
        uuid: null,
        name: null,
        userEmail: null
      }
    });
  }

  showSignUp() {
    this.setState({ signUp: !this.state.signUp });
  }

  render() {
    return (
      <Router>
        <AppTabBar
          ref={this.tabMenuElement}
          user={this.state.user}
          appLoginHandler={this.handleLogIn}
          loginOpen={this.state.showLogin}
          loggingIn={this.state.loggingIn}
          //passing ref into the component to allow us to call functions on the child from the parent
          loginRef={this.loginElement}
          appSignUpHandler={this.showSignUp}
          signUpSubmit={this.handleSignUp}
          signUpRef={this.signUpElement}
          signUpOpen={this.state.signUp}
          appLogoutHandler={this.logOut}
        />

        <Switch>
          {this.state.user.uuid ? (
            <React.Fragment>
              <Route
                path="/account-management"
                component={() => (
                  <AccountManagement
                    user={this.state.user}
                    deleteHandler={this.deleteUser}
                    updateUserDetails={this.updateUserDetails}
                  />
                )}
              />
              <Route
                path="/myworkouts"
                component={() => <MyWorkouts user={this.state.user} />}
              />
              <Route
                path={`/workout/:userWorkoutId`}
                component={() => <Workout user={this.state.user} />}
              />
              <Route
                exact
                path="/"
                component={() => <Home user={this.state.user} />}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Route exact path="" component={() => <Splash />} />
            </React.Fragment>
          )}
        </Switch>
      </Router>
    );
  }
}

export default App;
