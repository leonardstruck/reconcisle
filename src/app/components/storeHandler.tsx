import React from "react";
import uuid from 'react-uuid';
import {ipcRenderer} from 'electron';


export async function storeHandler(req:any) {
  const randomID = uuid();
  ipcRenderer.send("store", {reqId: randomID, store: req.store, method: req.method, obj:req.obj});
  let promise = new Promise((resolve, reject) => {
    ipcRenderer.once(randomID, (event, data) => { 
      resolve(data);
    })
  })

  return promise;
}