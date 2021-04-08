import { createStore } from "redux";
import { composeWithDevTools } from "electron-redux-devtools";
import allReducers from "./reducers/index";

function configureStore(initialState) {
	const store = createStore(allReducers, initialState, composeWithDevTools());

	if (module.host) {
		module.hot.accept("./reducers", () => {
			const nextReducer = require("./reducers/index").default;

			store.replaceReducer(nextReducer);
		});
	}

	return store;
}

export default configureStore();
