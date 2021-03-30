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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartProject = void 0;
var core_1 = require("@blueprintjs/core");
var react_1 = __importStar(require("react"));
var slugify_1 = __importDefault(require("slugify"));
var Source_1 = require("./Source/Source");
var StartProject = function (props) {
    var defaultState = {
        source: "",
        sourceOptions: {},
        name: ""
    };
    var _a = react_1.useState(defaultState), projectOptions = _a[0], setProjectOptions = _a[1];
    var _b = react_1.useState({}), sourceOptions = _b[0], setSourceOptions = _b[1];
    var _c = react_1.useState(true), nextButtonDisabled = _c[0], setNextButtonDisabled = _c[1];
    react_1.useEffect(function () {
        if (projectOptions.source !== "") {
            setProjectOptions(__assign(__assign({}, projectOptions), { sourceOptions: sourceOptions }));
        }
    }, [sourceOptions]);
    var handleSourceChange = function (event) {
        setProjectOptions(__assign(__assign({}, projectOptions), { source: event.currentTarget.value }));
    };
    var handleNameChange = function (event) {
        var withoutSpace = slugify_1.default(event.currentTarget.value, { lower: true, remove: /[*_+~,.()'"!:@]/g });
        event.currentTarget.value = withoutSpace;
        setProjectOptions(__assign(__assign({}, projectOptions), { name: withoutSpace }));
        if (event.currentTarget.value !== "") {
            setNextButtonDisabled(false);
        }
    };
    return (react_1.default.createElement(core_1.MultistepDialog, __assign({ title: "Start a new Project", nextButtonProps: { disabled: nextButtonDisabled } }, props, { onClosing: function () { setProjectOptions(defaultState); setSourceOptions({}); } }),
        react_1.default.createElement(core_1.DialogStep, { id: "general", panel: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(core_1.FormGroup, { label: "Name", labelInfo: "(required)" },
                    react_1.default.createElement(core_1.InputGroup, { id: "text-input", onChange: handleNameChange, defaultValue: projectOptions.name })),
                react_1.default.createElement(core_1.Callout, { title: "Valid Project Names", intent: "primary" }, "Supported characters for a project name are letters, numers and dashes. Dashes must not be entered next to another."),
                react_1.default.createElement(core_1.FormGroup, { label: "Source" },
                    react_1.default.createElement(core_1.RadioGroup, { selectedValue: projectOptions.source, onChange: handleSourceChange },
                        react_1.default.createElement(core_1.Radio, { label: "Postgres, MySQL, MariaDB, SQLite, Microsoft SQL Server", value: "database" }),
                        react_1.default.createElement(core_1.Radio, { label: "CSV (coming soon...)", value: "csv", disabled: true }),
                        react_1.default.createElement(core_1.Radio, { label: "Excel (coming soon...)", value: "excel", disabled: true })))), title: "General" }),
        react_1.default.createElement(core_1.DialogStep, { id: "source", panel: react_1.default.createElement(Source_1.Source, { source: projectOptions.source, setNextButtonDisabled: setNextButtonDisabled, sourceOptions: sourceOptions, setSourceOptions: setSourceOptions }), title: "Configure Source", style: { overflowY: "scroll", maxHeight: 500 } }),
        react_1.default.createElement(core_1.DialogStep, { id: "reconcparams", panel: react_1.default.createElement("div", null,
                react_1.default.createElement("h1", null, "Reconciliation Parameters")), title: "Set Reconciliation Parameters" })));
};
exports.StartProject = StartProject;
//# sourceMappingURL=StartProject.js.map