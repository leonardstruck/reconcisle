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
exports.Open = void 0;
var React = __importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var react_helmet_1 = require("react-helmet");
var core_1 = require("@blueprintjs/core");
var ProjectList_1 = require("./ProjectList");
var Open = function () {
    return (React.createElement(React.Fragment, null,
        React.createElement(react_helmet_1.Helmet, null,
            React.createElement("title", null, "reconcIsle - Open")),
        React.createElement(core_1.Card, { elevation: core_1.Elevation.FOUR, className: "centeredCard" },
            React.createElement(ProjectList_1.ProjectList, null),
            React.createElement(react_router_dom_1.Link, { to: "/" },
                React.createElement(core_1.Button, { icon: "arrow-left", intent: "primary", minimal: true }, "Back")))));
};
exports.Open = Open;
//# sourceMappingURL=Open.js.map