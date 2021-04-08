import { combineReducers } from "redux";
import { startProjectReducer } from "./startProjectReducer";
import { notificationReducer } from "./notificationReducer";

const allReducers = combineReducers({
	startProject: startProjectReducer,
	notification: notificationReducer,
});
export default allReducers;
