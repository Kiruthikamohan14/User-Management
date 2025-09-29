// src/index.tsx
import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store/store";
import {LoadingProvider} from "./components/common/LoadingProvider";
import "antd/dist/reset.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </Provider>
  </React.StrictMode>
);
