import Store from 'electron-store';

//default stores
const projects = new Store({
    name: "projects"
})

export const store = (store: string, method: string, obj: { key: string }):unknown => {
    switch(store) {
        case 'projects':
            switch(method) {
                case 'get':
                    return projects.get(obj.key);
                case 'set':
                    projects.set(obj);
                    return {}
                case 'size':
                    return projects.size
                case 'store':
                    return projects.store;
            }
            break;
        default:
            throw new Error("no such store");
    }
    return {};
}