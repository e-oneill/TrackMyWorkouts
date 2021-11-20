import { StrictMode } from "react";
import FirebaseProvider from "./config/firebase";
import ReactDOM from "react-dom";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <FirebaseProvider>
    <App />
    </FirebaseProvider>
  </StrictMode>,
  rootElement
);
