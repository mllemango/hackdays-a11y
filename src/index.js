import App from "./App";
import "@shopify/polaris/dist/styles.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Heading, Navigation, Frame, AppProvider } from "@shopify/polaris";
import { HomeMajor, BehaviorMajor } from "@shopify/polaris-icons";
const navigationMarkup = (
  <Navigation location="/">
    <Navigation.Section
      items={[
        {
          url: "/",
          label: "Home",
          icon: HomeMajor,
        },
        {
          url: "/about",
          label: "About this project",
          icon: BehaviorMajor,
        },
      ]}
    />
  </Navigation>
);
ReactDOM.render(
  <BrowserRouter>
    <AppProvider ii18n={{}}>
      <Frame navigation={navigationMarkup}>
        <App />
      </Frame>
    </AppProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
