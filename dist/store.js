"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
var electron_store_1 = __importDefault(require("electron-store"));
//default stores
var projects = new electron_store_1.default({
    name: "projects"
});
var store = function (store, method, obj) {
    switch (store) {
        case 'projects':
            switch (method) {
                case 'get':
                    return projects.get(obj.key);
                case 'set':
                    projects.set(obj);
                    return {};
                case 'size':
                    return projects.size;
                case 'store':
                    return projects.store;
            }
            break;
        default:
            throw new Error("no such store");
    }
    return {};
};
exports.store = store;
//# sourceMappingURL=store.js.map