module.exports = {
    checkAndReturn: function (req, port, method) {
        const returnBody = {
            "name": "reconcIsle - easy reconciliation service",
            "identifierSpace": `http://localhost:${port}/`,
            "schemaSpace": `http://localhost:${port}/`,
            "view": {
                "url": `http://localhost:${port}/view/{{id}}`
            },
            "preview": {
                "url": `http://localhost:${port}/view/{{id}}`,
                "width": 500,
                "height": 350
            },
            "suggest": {
                "entity": {
                    "service_url": `http://localhost:${port}/`,
                    "service_path": "/suggest",
                    "flyout_service_url": `http://localhost:${port}/`,
                    "flyout_service_path": "/flyout"
                }
            }
        }
        switch(method) {
            case "get": {
                const requestSize = Object.keys(req.query).length;
                if(requestSize === 0) {
                    return returnBody;
                }
            }
            case "post": {
                const requestSize = Object.keys(req.body).length;
                if(requestSize === 0) {
                    return returnBody;
                }
            }
        }
    }
}