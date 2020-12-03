import "./App.css";
import About from "./About";
import Home from "./Home";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <main>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/about" component={About} />
      </Switch>
    </main>
  );
}

export default App;
