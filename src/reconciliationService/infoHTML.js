const infoHTML = (port) => {
	return `
    <html>
    <head>
    <title>reconcIsle</title>
    </head>
    <body>
        <h1>This is a reconciliationService</h1>
        <p>Add http://localhost:${port}/reconcile/ as a reconciliation service to OpenRefine to start reconciling</p>
    </body>
</html>
    `;
};

exports.getHTML = infoHTML;
