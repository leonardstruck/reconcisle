import { combineReducers } from "redux";
import { startProjectReducer } from "./startProjectReducer";
import { notificationReducer } from "./notificationReducer";
import { reconciliationReducer } from "./reconciliationReducer";

const allReducers = combineReducers({
	startProject: startProjectReducer,
	notification: notificationReducer,
	reconciliation: reconciliationReducer,
});
export default allReducers;
