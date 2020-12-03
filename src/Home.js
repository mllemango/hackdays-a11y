import logo from "./logo.svg";
import "./App.css";
import { Heading, Link, Navigation, Frame, AppProvider } from "@shopify/polaris";

function Home() {
  return (
    <AppProvider i18n={{}}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Heading element="h1">A11y Dev Experience Home</Heading>
          <Link url="https://hackdays.shopify.io/projects/13644">
            Hackdays Project
          </Link>
        </header>
      </div>
    </AppProvider>
  );
}

export default Home;
