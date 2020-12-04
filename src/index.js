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
          accessibilityLabel: "Home page"
        },
        {
          url: "/about",
          label: "About this project",
          icon: BehaviorMajor,
          accessibilityLabel: "About page"
        },
      ]}
    />
  </Navigation>
);
ReactDOM.render(
  <BrowserRouter>
    <AppProvider ii18n={{}}>
      <Frame navigation={navigationMarkup} accessibilityLabel='test'>
        <App />
      </Frame>
    </AppProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
