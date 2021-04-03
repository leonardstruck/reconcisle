import { QueryTypes, Sequelize } from "sequelize";
import mysql2 from "mysql2";

export const service = async (service, method, obj) => {
	let sequelize;
	const returnC = (val) => {
		sequelize.close();
		console.log("Closed Connection");
		return val;
	};
	switch (service) {
		case "database":
			switch (obj.driver) {
				case "mysql":
					console.log("Establishing mysql-connection");
					sequelize = new Sequelize(obj.database, obj.username, obj.password, {
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
							try {
								let tables;
								await sequelize.authenticate();
								console.log("Connection was established successfully");
								await sequelize
									.query("SHOW Tables", {
										type: sequelize.QueryTypes.SHOWTABLES,
									})
									.then((result) => {
										tables = result;
									});
								return returnC({ status: "ok", tables: tables });
							} catch (error) {
								console.log("Unable to connect to database: ", error);
								return returnC({ status: "error" + error });
							}
						case "previewTable":
							try {
								let tableContent;
								await sequelize.authenticate();
								console.log("Connection was established successfully");
								await sequelize
									.query(
										"SELECT * FROM `" +
											obj.database +
											"`.`" +
											obj.table +
											"` LIMIT 10 OFFSET 0",
										{ type: QueryTypes.SELECT }
									)
									.then((result) => {
										tableContent = result;
									});
								return returnC({ status: "ok", tableContent: tableContent });
							} catch (error) {
								console.log("Unable to get Table Preview Data: ", error);
								return returnC({ status: "error" + error });
							}
					}
			}
	}
};
