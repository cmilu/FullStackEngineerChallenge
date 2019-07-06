import { HashRouter, Switch, Route } from "react-router-dom";
import Employee from "./pages/Employee";
import React from "react";

export default function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" component={Employee} />
      </Switch>
    </HashRouter>
  );
}
