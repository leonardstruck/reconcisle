import { FormGroup, InputGroup, MenuItem, Callout, RadioGroup, Radio, Collapse, Button, Intent, ButtonGroup, Toaster, Toast, Position } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { Select } from "@blueprintjs/select";

import React, { SetStateAction, useEffect, useState } from "react";

import { serviceHandler } from "../../serviceHandler";

export const Source:React.FunctionComponent<{ source: string, sourceOptions, setSourceOptions: React.Dispatch<SetStateAction<object>>, setNextButtonDisabled: React.Dispatch<SetStateAction<boolean>>}> = (props) => {
    const [selectedSource, setSelectedSource] = useState(props.sourceOptions.source ? props.sourceOptions.source : "");
    useEffect(() => {
        props.setNextButtonDisabled(true);
    }, [])

    const [connectionData, setConnectionData] = useState({
        "mysql": {
            host: (props.sourceOptions.source === "mysql" ? props.sourceOptions.host : "localhost"),
            port: (props.sourceOptions.source === "mysql" ? props.sourceOptions.port: 3306),
            username: (props.sourceOptions.source === "mysql" ? props.sourceOptions.username : ""),
            password: (props.sourceOptions.source === "mysql" ? props.sourceOptions.password : ""),
            database: (props.sourceOptions.source === "mysql" ? props.sourceOptions.database : ""),
            table: (props.sourceOptions.source === "mysql" ? props.sourceOptions.table : ""),
            status: (props.sourceOptions.source === "mysql" ? props.sourceOptions.status : "")
        }
    })

    useEffect(() => {
        if(selectedSource !== "") {
            props.setSourceOptions({ source: selectedSource, ...connectionData[selectedSource]});
        }
    }, [connectionData[selectedSource]])

    const [toasts, setToasts] = useState([]);
    
    return (
        <>
        <Toaster position={Position.TOP}>
            {toasts.map(toast => <Toast {...toast} key={toast.message} onDismiss={() => {setToasts([])}}/>)}
        </Toaster>
        <Callout title="Explore your databases" intent="primary">
            reconcIsle is compatible with the following relational databases:
        </Callout>
        <FormGroup
            label="Source"
        >
            <RadioGroup
                inline={true}
                onChange={(e) => { setSelectedSource(e.currentTarget.value)}}
                selectedValue={selectedSource}
            >
                <Radio label="PostgreSQL" value="postgres" />
                <Radio label="MySQL" value="mysql" />
                <Radio label="MariaDB" value="mariadb" />
                <Radio label="SQLite" value="sqlite" />
                <Radio label="Microsoft SQL" value="microsoft" />
            </RadioGroup>
        </FormGroup>
        <Collapse isOpen={selectedSource !== ""}>
            <Config source={selectedSource} setNextButtonDisabled={props.setNextButtonDisabled} setToasts={setToasts} connectionData={connectionData} setConnectionData={setConnectionData} />
        </Collapse>
        </>
    );
} 


const Config = (props) => {
    const connectionData = props.connectionData;
    const setToasts = props.setToasts;
    const serviceConnectionData = props.connectionData[props.source];
    const setConnectionData = props.setConnectionData;
    const [showPassword, setShowPassword] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isFaulty, setIsFaulty] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [connectButtonDisabled, setConnectButtonDisabled] = useState(false);
    const [refreshButtonDisabled, setRefreshButtonDisabled] = useState(true);
    const handleSetNextButtonDisabled = (bool) => {
        props.setNextButtonDisabled(bool);
    }

    const checkFields = () => {
        let response = true;
        const areFaulty = [];
        for (let key in serviceConnectionData) {
            if (serviceConnectionData[key] === null || serviceConnectionData[key] == "" && key != "table" && key != "status") {
                areFaulty.push(key);
                response = false;
            } 
        }
        if(!response) {
            const toasts = [];
            areFaulty.map((fault) => {
                toasts.push({message: "Check field \”"+fault+"\"!", intent:"warning"})
            })
            setIsFaulty(areFaulty);
            setToasts(toasts);
        }

        return response;
    }

    const handleChange = (e) => {
        const typeInState = typeof(connectionData[props.source][e.currentTarget.id]);
        let newData;
        if(typeInState === "number") {
            const newDataString = e.currentTarget.value.toString();
            const newDataStrip = newDataString.replace(/\D/, '');
            newData = Number(newDataStrip);
            e.currentTarget.value = newData;
        } else {
            newData = e.currentTarget.value;
        }
        const prev = connectionData[props.source];
        setConnectionData({...connectionData, [props.source]: {...prev, [e.currentTarget.id]: newData}, status: "", table: ""})
        setRefreshButtonDisabled(true);
        handleSetNextButtonDisabled(true);
        setIsConnected(false);
        connectButtonDisabled && setConnectButtonDisabled(false);
    }

    const lockButton = (
        <Tooltip2 content={showPassword ? "Hide" : "Show"}>
            <Button
                icon={showPassword ? "unlock" : "lock" }
                intent={Intent.WARNING}
                minimal={true}
                onClick={() => {setShowPassword(!showPassword)}}
                />
        </Tooltip2>
    )

    const handleConnect = () => {
        if(checkFields()) {
            setIsConnecting(true);
            const sendObj = {...connectionData[props.source], type: props.source};
            serviceHandler({service: "database", method: "checkAuth", obj: sendObj}).then((response:any) => {
                if(response.status === "ok"){
                    const prev = connectionData[props.source];
                    setConnectionData({...connectionData, [props.source]: {...prev, "status": "ok"}});
                    setRefreshButtonDisabled(false);
                    setConnectButtonDisabled(true);
                    setIsConnected(true);
                    setIsFaulty([]);
                    setToasts([{message: "Connection successful!", intent:"success"}]);
                }
                setIsConnecting(false);
            })
        }

    }

    const handleRefresh = () => {
        setIsRefreshing(true);
        const sendObj = {...connectionData[props.source], type: props.source};
        serviceHandler({service: "database", method: "getTables", obj: sendObj}).then((response:any) => {
            setIsRefreshing(false);
        })
    }

    const TablesProps = {
        items: [{name: "table1"}, {name: "table2"}],
        filterable: false,
        disabled: !isConnected,
        itemRenderer: (table) => {
            return(
                <MenuItem
                    text={table.name}
                    key={table.name}
                    onClick={() => {
                        const prev = connectionData[props.source];
                        setConnectionData({...connectionData, [props.source]: {...prev, "table": table}})
                        handleSetNextButtonDisabled(false);
                    }}
                    />
            )
        },
        onItemSelect: (table) => {
        }
    }

    switch(props.source) {
        case "mysql":
            return (
                <>
                    <FormGroup label="Host" labelInfo="(required)" helperText="Replace 'localhost' with the name or ip-address of your database host. ">
                        <InputGroup id="host" defaultValue={connectionData.mysql.host} onChange={handleChange} intent={isFaulty.includes("host")? "warning" : "none"}/>
                    </FormGroup>
                    <FormGroup label="Port" labelInfo="(required)" helperText="The port number to use. the default port number is 3306.">
                        <InputGroup id="port" defaultValue={connectionData.mysql.port} onChange={handleChange} intent={isFaulty.includes("port")? "warning": "none"}/>
                    </FormGroup>
                    <FormGroup label="Database" labelInfo="(required)" helperText="The database's name to use.">
                        <InputGroup id="database" defaultValue={connectionData.mysql.database} onChange={handleChange} intent={isFaulty.includes("database") ? "warning" : "none"} />
                    </FormGroup>
                    <FormGroup label="Username" labelInfo="(required)" helperText="The user name of the MySQL account to use for connecting to the server. The default user name is ODBC on Windows or your Unix login name on Unix.">
                        <InputGroup id="username" defaultValue={connectionData.mysql.username} onChange={handleChange} intent={isFaulty.includes("username")? "warning": "none"}/>
                    </FormGroup>
                    <FormGroup label="Password" labelInfo="(required)" helperText="Password to use when connecting to server">
                        <InputGroup type={showPassword ? "text" : "password"} rightElement={lockButton} id="password" defaultValue={connectionData.mysql.password} intent={isFaulty.includes("password")? "warning": "none"}  onChange={handleChange} />
                    </FormGroup>
                    <FormGroup label="Table" helperText="Select the table which should be used as data source">
                        <Select {...TablesProps}>
                            <Button 
                                    disabled={!isConnected}
                                    icon="th"
                                    text={connectionData.mysql.table.name || isConnected ? connectionData.mysql.table.name || "Select a table" : "Connection must be established at first"}          
                            />               
                        </Select>
                    </FormGroup>
                    <ButtonGroup minimal={true} large={true} >
                        <Button text={isConnected ? "Connection established" : "Connect"} loading={isConnecting} icon={isConnected?"data-connection":"database"} onClick={handleConnect} disabled={connectButtonDisabled} />
                        <Button text="Refresh tables" loading={isRefreshing} icon="refresh" onClick={handleRefresh} intent="primary" disabled={refreshButtonDisabled} />
                    </ButtonGroup>
                </>
            )
        default:
            return <Callout intent="danger" title="configuration view missing" />
    }
}
