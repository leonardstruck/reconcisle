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
exports.Source = void 0;
/* eslint-disable react/prop-types */
var core_1 = require("@blueprintjs/core");
var popover2_1 = require("@blueprintjs/popover2");
var select_1 = require("@blueprintjs/select");
var react_1 = __importStar(require("react"));
var serviceHandler_1 = require("../../serviceHandler");
var Source = function (props) {
    var _a = react_1.useState(props.sourceOptions.source ? props.sourceOptions.source : ""), selectedSource = _a[0], setSelectedSource = _a[1];
    react_1.useEffect(function () {
        props.setNextButtonDisabled(true);
    }, []);
    var _b = react_1.useState({
        "mysql": {
            host: (props.sourceOptions.source === "mysql" ? props.sourceOptions.host : "localhost"),
            port: (props.sourceOptions.source === "mysql" ? props.sourceOptions.port : 3306),
            username: (props.sourceOptions.source === "mysql" ? props.sourceOptions.username : ""),
            password: (props.sourceOptions.source === "mysql" ? props.sourceOptions.password : ""),
            database: (props.sourceOptions.source === "mysql" ? props.sourceOptions.database : ""),
            table: (props.sourceOptions.source === "mysql" ? props.sourceOptions.table : ""),
            status: (props.sourceOptions.source === "mysql" ? props.sourceOptions.status : "")
        }
    }), connectionData = _b[0], setConnectionData = _b[1];
    react_1.useEffect(function () {
        if (selectedSource !== "") {
            props.setSourceOptions(__assign({ source: selectedSource }, connectionData[selectedSource]));
        }
    }, [connectionData[selectedSource]]);
    var _c = react_1.useState([]), toasts = _c[0], setToasts = _c[1];
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(core_1.Toaster, { position: core_1.Position.TOP }, toasts.map(function (toast) { return react_1.default.createElement(core_1.Toast, __assign({}, toast, { key: toast.message, onDismiss: function () { setToasts([]); } })); })),
        react_1.default.createElement(core_1.Callout, { title: "Explore your databases", intent: "primary" }, "reconcIsle is compatible with the following relational databases:"),
        react_1.default.createElement(core_1.FormGroup, { label: "Source" },
            react_1.default.createElement(core_1.RadioGroup, { inline: true, onChange: function (e) { setSelectedSource(e.currentTarget.value); }, selectedValue: selectedSource },
                react_1.default.createElement(core_1.Radio, { label: "PostgreSQL", value: "postgres" }),
                react_1.default.createElement(core_1.Radio, { label: "MySQL", value: "mysql" }),
                react_1.default.createElement(core_1.Radio, { label: "MariaDB", value: "mariadb" }),
                react_1.default.createElement(core_1.Radio, { label: "SQLite", value: "sqlite" }),
                react_1.default.createElement(core_1.Radio, { label: "Microsoft SQL", value: "microsoft" }))),
        react_1.default.createElement(core_1.Collapse, { isOpen: selectedSource !== "" },
            react_1.default.createElement(Config, { source: selectedSource, setNextButtonDisabled: props.setNextButtonDisabled, setToasts: setToasts, connectionData: connectionData, setConnectionData: setConnectionData }))));
};
exports.Source = Source;
var Config = function (props) {
    var connectionData = props.connectionData;
    var setToasts = props.setToasts;
    var serviceConnectionData = props.connectionData[props.source];
    var setConnectionData = props.setConnectionData;
    var _a = react_1.useState(false), showPassword = _a[0], setShowPassword = _a[1];
    var _b = react_1.useState(false), isConnecting = _b[0], setIsConnecting = _b[1];
    var _c = react_1.useState([]), availableTables = _c[0], setAvailableTables = _c[1];
    var _d = react_1.useState([]), isFaulty = _d[0], setIsFaulty = _d[1];
    var _e = react_1.useState(false), isConnected = _e[0], setIsConnected = _e[1];
    var _f = react_1.useState(false), isRefreshing = _f[0], setIsRefreshing = _f[1];
    var _g = react_1.useState(false), connectButtonDisabled = _g[0], setConnectButtonDisabled = _g[1];
    var _h = react_1.useState(true), refreshButtonDisabled = _h[0], setRefreshButtonDisabled = _h[1];
    var handleSetNextButtonDisabled = function (bool) {
        props.setNextButtonDisabled(bool);
    };
    var checkFields = function () {
        var response = true;
        var areFaulty = [];
        for (var key in serviceConnectionData) {
            if (serviceConnectionData[key] === null || serviceConnectionData[key] == "" && key != "table" && key != "status") {
                areFaulty.push(key);
                response = false;
            }
        }
        if (!response) {
            var toasts_1 = [];
            areFaulty.map(function (fault) {
                toasts_1.push({ message: "Check field ”" + fault + "”!", intent: "warning" });
            });
            setIsFaulty(areFaulty);
            setToasts(toasts_1);
        }
        return response;
    };
    var handleChange = function (e) {
        var _a, _b;
        var typeInState = typeof (connectionData[props.source][e.currentTarget.id]);
        var newData;
        if (typeInState === "number") {
            var newDataString = e.currentTarget.value.toString();
            var newDataStrip = newDataString.replace(/\D/, '');
            newData = Number(newDataStrip);
            e.currentTarget.value = newData;
        }
        else {
            newData = e.currentTarget.value;
        }
        var prev = connectionData[props.source];
        setConnectionData(__assign(__assign({}, connectionData), (_a = {}, _a[props.source] = __assign(__assign({}, prev), (_b = {}, _b[e.currentTarget.id] = newData, _b)), _a.status = "", _a.table = "", _a)));
        setRefreshButtonDisabled(true);
        handleSetNextButtonDisabled(true);
        setIsConnected(false);
        connectButtonDisabled && setConnectButtonDisabled(false);
    };
    var lockButton = (react_1.default.createElement(popover2_1.Tooltip2, { content: showPassword ? "Hide" : "Show" },
        react_1.default.createElement(core_1.Button, { icon: showPassword ? "unlock" : "lock", intent: core_1.Intent.WARNING, minimal: true, onClick: function () { setShowPassword(!showPassword); } })));
    var handleConnect = function () {
        if (checkFields()) {
            setIsConnecting(true);
            var sendObj = __assign(__assign({}, connectionData[props.source]), { type: props.source });
            serviceHandler_1.serviceHandler({ service: "database", method: "getTables", obj: sendObj }).then(function (response) {
                var _a;
                if (response.status === "ok") {
                    var prev = connectionData[props.source];
                    setConnectionData(__assign(__assign({}, connectionData), (_a = {}, _a[props.source] = __assign(__assign({}, prev), { "status": "ok" }), _a)));
                    setRefreshButtonDisabled(false);
                    setConnectButtonDisabled(true);
                    setIsConnected(true);
                    setIsFaulty([]);
                    setToasts([{ message: "Connection established!", intent: "success" }]);
                    setAvailableTables(response.tables);
                }
                else {
                    setToasts([{ message: response.status, intent: "danger" }]);
                }
                setIsConnecting(false);
            });
        }
    };
    var handleRefresh = function () {
        setIsRefreshing(true);
        var sendObj = __assign(__assign({}, connectionData[props.source]), { type: props.source });
        serviceHandler_1.serviceHandler({ service: "database", method: "getTables", obj: sendObj }).then(function (response) {
            var _a;
            if (response.status === "ok") {
                var prev = connectionData[props.source];
                setConnectionData(__assign(__assign({}, connectionData), (_a = {}, _a[props.source] = __assign(__assign({}, prev), { "status": "ok" }), _a)));
                setAvailableTables(response.tables);
                setToasts([{ message: "Fetched new table data", intent: "success" }]);
            }
            else {
                setToasts({ message: response.status, intent: "danger" });
            }
            setIsRefreshing(false);
        });
    };
    var TablesProps = {
        items: availableTables.map(function (table) { return { name: table }; }),
        filterable: false,
        disabled: !isConnected,
        onItemSelect: function () { return ""; },
        // eslint-disable-next-line react/display-name
        itemRenderer: function (table) {
            return (react_1.default.createElement(core_1.MenuItem, { text: table.name, key: table.name, onClick: function () {
                    var _a;
                    var prev = connectionData[props.source];
                    setConnectionData(__assign(__assign({}, connectionData), (_a = {}, _a[props.source] = __assign(__assign({}, prev), { "table": table }), _a)));
                    handleSetNextButtonDisabled(false);
                } }));
        }
    };
    switch (props.source) {
        case "mysql":
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(core_1.FormGroup, { label: "Host", labelInfo: "(required)", helperText: "Replace 'localhost' with the name or ip-address of your database host. " },
                    react_1.default.createElement(core_1.InputGroup, { id: "host", defaultValue: connectionData.mysql.host, onChange: handleChange, intent: isFaulty.includes("host") ? "warning" : "none" })),
                react_1.default.createElement(core_1.FormGroup, { label: "Port", labelInfo: "(required)", helperText: "The port number to use. the default port number is 3306." },
                    react_1.default.createElement(core_1.InputGroup, { id: "port", defaultValue: connectionData.mysql.port, onChange: handleChange, intent: isFaulty.includes("port") ? "warning" : "none" })),
                react_1.default.createElement(core_1.FormGroup, { label: "Database", labelInfo: "(required)", helperText: "The database's name to use." },
                    react_1.default.createElement(core_1.InputGroup, { id: "database", defaultValue: connectionData.mysql.database, onChange: handleChange, intent: isFaulty.includes("database") ? "warning" : "none" })),
                react_1.default.createElement(core_1.FormGroup, { label: "Username", labelInfo: "(required)", helperText: "The user name of the MySQL account to use for connecting to the server. The default user name is ODBC on Windows or your Unix login name on Unix." },
                    react_1.default.createElement(core_1.InputGroup, { id: "username", defaultValue: connectionData.mysql.username, onChange: handleChange, intent: isFaulty.includes("username") ? "warning" : "none" })),
                react_1.default.createElement(core_1.FormGroup, { label: "Password", labelInfo: "(required)", helperText: "Password to use when connecting to server" },
                    react_1.default.createElement(core_1.InputGroup, { type: showPassword ? "text" : "password", rightElement: lockButton, id: "password", defaultValue: connectionData.mysql.password, intent: isFaulty.includes("password") ? "warning" : "none", onChange: handleChange })),
                react_1.default.createElement(core_1.FormGroup, { label: "Table", labelInfo: "(connection must be established to change)", helperText: "Select the table which should be used as data source" },
                    react_1.default.createElement(select_1.Select, __assign({}, TablesProps),
                        react_1.default.createElement(core_1.Button, { disabled: !isConnected, icon: "th", text: connectionData.mysql.table.name || "Select a table" }))),
                react_1.default.createElement(core_1.ButtonGroup, { minimal: true, large: true },
                    react_1.default.createElement(core_1.Button, { text: isConnected ? "Connection established" : "Connect", loading: isConnecting, icon: isConnected ? "data-connection" : "database", onClick: handleConnect, disabled: connectButtonDisabled }),
                    react_1.default.createElement(core_1.Button, { text: "Refresh tables", loading: isRefreshing, icon: "refresh", onClick: handleRefresh, intent: "primary", disabled: refreshButtonDisabled }))));
        default:
            return react_1.default.createElement(core_1.Callout, { intent: "danger", title: "configuration view missing" });
    }
};
//# sourceMappingURL=Source.js.map