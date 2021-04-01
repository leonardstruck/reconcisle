import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

export const service = async (service, method, obj) => {
	let sequelize;
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
								return { status: "ok", tables: tables };
							} catch (error) {
								console.log("Unable to connect to database: ", error);
								return { status: "error" + error };
							}
					}
			}
	}
};
