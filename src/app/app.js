import { hot } from "react-hot-loader";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { MemoryRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import { Home } from "./components/Home";
import { Open } from "./components/Open/Open";
import { Reconc } from "./components/Reconc/Reconc";

export const App = () => {
	return (
		<Provider store={store}>
			<Router>
				<Switch>
					<Route path="/open">
						<Open />
					</Route>
					<Route path="/project">
						<Reconc />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</Router>
		</Provider>
	);
};

export default hot(module)(App);

ReactDOM.render(<App />, document.getElementById("App"));
