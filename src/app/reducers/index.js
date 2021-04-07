import { combineReducers } from "redux";
import { startProjectReducer } from "./startProjectReducer";

const allReducers = combineReducers({
	startProject: startProjectReducer,
});
export default allReducers;
