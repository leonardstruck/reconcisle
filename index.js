const { spawn } = require('child_process')
const reconcServer = spawn('node', ['reconciliation/server.js'])

reconcServer.stdout.on('data', (data) => {
    console.log(`reconcServer %% stdout: ${data}`)
})

reconcServer.stderr.on('data', (data) => {
    console.error(`reconcServer %% stderr: ${data}`)
})

reconcServer.on('close', (code) => {
    console.log(`reconcServer %% Server process exited with code ${code}`)
})