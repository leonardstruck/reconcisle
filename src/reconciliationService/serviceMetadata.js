const serviceMetadata = (port) => {
	return {
		name: "reconcIsle",
		identifierSpace: "http://localhost:" + port + "/",
		schemaSpace: "http://localhost:" + port + "/",
		defaultTypes: [
			{
				id: "/reconcIsle/",
				name: "reconcIsle",
			},
		],
		view: {
			url: "http://localhost:" + port + "/view/{{id}}",
		},
		preview: {
			url: "http://localhost:" + port + "/view/{{id}}",
			height: 350,
			width: 500,
		},
		suggest: {
			entity: {
				service_url: "http://localhost:" + port,
				service_path: "/suggest",
				flyout_service_url: "http://localhost:" + port,
				flyout_service_path: "/flyout",
			},
		},
	};
};

exports.get = serviceMetadata;
