import { DialogStep, FormGroup, InputGroup, MultistepDialog, Radio, RadioGroup, Callout } from "@blueprintjs/core";
import React, { useState } from "react";
import slugify from "slugify";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {storeHandler}  from '../storeHandler';

import { Source } from './Source/Source';

export const StartProject:React.FunctionComponent<{ onClose: () => void}> = (props) => {
    const defaultState = {
        source: "database",
        name: ""
    }
    const [projectOptions, setProjectOptions] = useState(defaultState);

    const handleSourceChange = (event: React.FormEvent<HTMLInputElement>) => {
        setProjectOptions({...projectOptions, source: event.currentTarget.value})
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const withoutSpace = slugify(event.currentTarget.value, {lower: true, remove: /[*_+~,.()'"!:@]/g});
        event.currentTarget.value = withoutSpace;
        setProjectOptions({...projectOptions, name: withoutSpace})
    }

    return (
        <MultistepDialog
            title="Start a new Project"
            nextButtonProps={{disabled: projectOptions.name === ""}}
            {...props}
            onClosing={() => {setProjectOptions(defaultState)}}
        >
            <DialogStep
                id="general"
                panel={
                    <>
                    <FormGroup
                        label="Name"
                        labelInfo="(required)"
                        
                    >
                        <InputGroup id="text-input" onChange={handleNameChange} defaultValue={projectOptions.name}/>
                    </FormGroup>
                    <Callout title="Valid Project Names" intent="primary">
                        Supported characters for a project name are letters, numers and dashes.
                        Dashes must not be entered next to another.
                    </Callout>
                    <FormGroup
                        label="Source"
                    >
                        <RadioGroup
                            selectedValue={projectOptions.source}
                            onChange={handleSourceChange}
                        >
                            <Radio label="Postgres, MySQL, MariaDB, SQLite, Microsoft SQL Server" value="database" />
                            <Radio label="CSV (coming soon...)" value="csv" disabled={true} />
                            <Radio label="Excel (coming soon...)" value="excel" disabled={true} />
                        </RadioGroup>
                    </FormGroup>
                    </>
                }
                title="General"
            />
            <DialogStep
                id="source"
                panel={<Source source={projectOptions.source} />}
                title="Configure Source"
                style={{overflowY: "scroll", maxHeight: 500}}
            />
            <DialogStep
                id="reconcparams"
                panel={<div><h1>Reconciliation Parameters</h1></div>}
                title="Set Reconciliation Parameters"
                />
        </MultistepDialog>
    )
}