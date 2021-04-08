import { QueryTypes, Sequelize } from "sequelize";
import mysql2 from "mysql2";

export default async (method, obj) => {
	const promise = new Promise((resolve) => {
		const sequelize = new Sequelize(obj.database, obj.username, obj.password, {
			dialect: "mysql",
			dialectModule: mysql2,
			host: obj.host,
			port: obj.port,
			define: {
				timestamps: false,
			},
		});

		switch (method) {
			case "getTables":
				sequelize
					.authenticate()
					.then(() => {
						console.log("Connection was established successfully");
						sequelize
							.query("SHOW Tables", { type: sequelize.QueryTypes.SHOWTABLES })
							.then((result) => {
								sequelize.close();
								resolve({ status: "ok", tables: result });
							})
							.catch((err) => {
								sequelize.close();
								resolve({ status: "error", errorMessage: err.toString() });
							});
					})
					.catch((err) => {
						sequelize.close();
						resolve({ status: "error", errorMessage: err.toString() });
					});
				break;
			case "previewTable":
				sequelize
					.authenticate()
					.then(() => {
						console.log("Connection was established successfully");
						sequelize
							.query(
								"SELECT * FROM `" +
									obj.database +
									"`.`" +
									obj.table +
									"` ORDER BY RAND() LIMIT 10",
								{ type: QueryTypes.SELECT }
							)
							.then((res) => {
								sequelize.close();
								resolve({ status: "ok", tableContent: res });
							})
							.catch((err) => {
								sequelize.close();
								resolve({ status: "error", errorMessage: err.toString() });
							});
					})
					.catch((err) => {
						sequelize.close();
						resolve({ status: "error", errorMessage: err.toString() });
					});
				break;
			case "getData":
				sequelize
					.authenticate()
					.then(() => {
						console.log("Connection was established successfully");
						sequelize
							.query(
								"SELECT * FROM `" + obj.database + "`.`" + obj.table + "`",
								{ type: QueryTypes.SELECT }
							)
							.then((res) => {
								sequelize.close();
								resolve({ status: "ok", data: res });
							})
							.catch((err) => {
								sequelize.close();
								resolve({ status: "error", errorMessage: err.toString() });
							});
					})
					.catch((err) => {
						sequelize.close();
						resolve({ status: "error", errorMessage: err.toString() });
					});
		}
	});
	return promise;
};
