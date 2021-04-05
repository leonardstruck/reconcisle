import { hot } from "react-hot-loader";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Island from "../app/assets/island.svg";
import { Button, ButtonGroup, NonIdealState } from "@blueprintjs/core";

export const App = () => {
	return (
		<NonIdealState
			icon={<Island />}
			title="Title"
			description="Description"
			action={
				<ButtonGroup>
					<Button>Refresh Data</Button>
				</ButtonGroup>
			}
		/>
	);
};

export default hot(module)(App);

ReactDOM.render(<App />, document.getElementById("App"));
