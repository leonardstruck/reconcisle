const { Sequelize } = require('sequelize');

export const service = (service, method, obj) => {
    switch(service) {
        case "database":
            switch(method) {
                case "checkAuth":
                    return {status: "ok"}
            }
    }
}