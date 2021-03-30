import { Sequelize } from 'sequelize';

export const service = async (service:string, method:string, obj:{host: string, port: number, username: string, password: string, database: string, table: string, status: string, type: string}):Promise<{ [key: string]: unknown; }> => {
    let sequelize;
    switch(service) {
        case "database":
            switch(obj.type) {
                case "mysql":
                    console.log("Establishing mysql-connection");
                    sequelize = new Sequelize(obj.database, obj.username, obj.password, {
                        dialect: "mysql",
                        host: obj.host,
                        port: obj.port
                    })
                    switch(method) {
                        case "getTables":
                            try {
                                let tables;
                                await sequelize.authenticate();
                                console.log("Connection has established successfully");
                                await sequelize.query('SHOW Tables', {
                                    type: sequelize.QueryTypes.SHOWTABLES
                                }).then((result) => {
                                    tables = result;
                                })
                                return {status: "ok", tables: tables};
                            } catch(error) {
                                console.log("Unable to connect to database: ", error);
                                return {status: "error" + error}
                            }
                    }
                    
            }
    }
}