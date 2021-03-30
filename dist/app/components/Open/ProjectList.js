"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ProjectList = void 0;
var react_1 = __importStar(require("react"));
var core_1 = require("@blueprintjs/core");
var popover2_1 = require("@blueprintjs/popover2");
var storeHandler_1 = require("../storeHandler");
var StartProject_1 = require("./StartProject");
function SubMenu() {
    return (react_1.default.createElement(popover2_1.Popover2, { content: react_1.default.createElement(core_1.Menu, null,
            react_1.default.createElement(core_1.Menu.Item, { text: "Rename", icon: "edit", intent: "primary" }),
            react_1.default.createElement(core_1.Menu.Item, { text: "Export", icon: "share", intent: "primary" }),
            react_1.default.createElement(core_1.Menu.Divider, null),
            react_1.default.createElement(core_1.Menu.Item, { text: "Delete", icon: "trash", intent: "danger" })), placement: "right-start" },
        react_1.default.createElement(core_1.Button, { icon: "more", minimal: true })));
}
var ProjectList = function () {
    var _a = react_1.useState(true), isLoading = _a[0], setIsLoading = _a[1];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var _b = react_1.useState({}), projects = _b[0], setProjects = _b[1];
    var _c = react_1.useState(0), projectCount = _c[0], setProjectCount = _c[1];
    var _d = react_1.useState({
        isOpen: false,
    }), startProjectState = _d[0], setStartProjectState = _d[1];
    react_1.useEffect(function () {
        storeHandler_1.storeHandler({ store: "projects", method: "size" }).then(function (response) {
            setProjectCount(response);
        });
        storeHandler_1.storeHandler({ store: "projects", method: "store" }).then(function (response) {
            setProjects(response);
            setIsLoading(false);
        });
    }, []);
    if (isLoading) {
        return (react_1.default.createElement(core_1.NonIdealState, { icon: react_1.default.createElement(core_1.Spinner, null), title: "Reading Database" }));
    }
    else if (projectCount === 0) {
        var handleOpen = function () { setStartProjectState({ isOpen: true }); };
        var handleClose = function () { setStartProjectState({ isOpen: false }); };
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(core_1.NonIdealState, { title: "No projects found", icon: "folder-new", action: react_1.default.createElement(core_1.Button, { onClick: handleOpen }, "Start a new Project") }),
            react_1.default.createElement(StartProject_1.StartProject, __assign({}, startProjectState, { onClose: handleClose }))));
    }
    else {
        return (react_1.default.createElement(core_1.HTMLTable, { style: { flexGrow: 1 }, interactive: true },
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", null, "Please select a project"))),
            react_1.default.createElement("tbody", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", null, "Projekt 1"),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(SubMenu, null))),
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", null, "Projekt 2"),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(SubMenu, null))),
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", null, "Projekt 3"),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(SubMenu, null))))));
    }
};
exports.ProjectList = ProjectList;
//# sourceMappingURL=ProjectList.js.map