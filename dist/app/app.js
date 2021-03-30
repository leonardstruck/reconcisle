"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var React = __importStar(require("react"));
var ReactDOM = __importStar(require("react-dom"));
var react_hot_loader_1 = require("react-hot-loader");
var react_router_dom_1 = require("react-router-dom");
require("./app.css");
//import Components
var Home_1 = require("./components/Home/Home");
var Open_1 = require("./components/Open/Open");
var App = function () {
    return (React.createElement(react_router_dom_1.BrowserRouter, null,
        React.createElement(react_router_dom_1.Switch, null,
            React.createElement(react_router_dom_1.Route, { path: "/open" },
                React.createElement(Open_1.Open, null)),
            React.createElement(react_router_dom_1.Route, { path: "/" },
                React.createElement(Home_1.Home, null)))));
};
exports.App = App;
exports.default = react_hot_loader_1.hot(module)(exports.App);
ReactDOM.render(React.createElement(exports.App, null), document.getElementById('App'));
//# sourceMappingURL=app.js.map