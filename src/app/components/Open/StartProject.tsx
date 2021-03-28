import { DialogStep, FormGroup, InputGroup, MultistepDialog, Radio, RadioGroup, Callout } from "@blueprintjs/core";
import React, { useState } from "react";
import slugify from "slugify";

import {storeHandler}  from '../storeHandler';

export default function StartProject(props:any) {
    const [projectOptions, setProjectOptions] = useState({
        source: "sql",
        name: ""
    });

    const handleSourceChange = (event) => {
        setProjectOptions({...projectOptions, source: event.currentTarget.value})
    }

    const handleNameChange = (event) => {
        const withoutSpace = slugify(event.currentTarget.value, {lower: true, remove: /[*_+~,.()'"!:@]/g});
        event.currentTarget.value = withoutSpace;
        setProjectOptions({...projectOptions, name: withoutSpace})
    }

    return (
        <MultistepDialog
            title="Start a new Project"
            {...props}
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
                            <Radio label="SQL" value="sql" />
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
                panel={<div><h1>This is the source panel</h1></div>}
                title="Configure Source"
            />
        </MultistepDialog>
    )
}