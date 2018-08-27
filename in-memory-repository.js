class InMemoryRepository {
    constructor(idProperty) {
        this.__data = {};
        this.__idProperty = idProperty || 'id';
    }
    get items() {
        return Promise.resolve(Object.values(this.__data));
    }

    get(id) {
        if (this.__data[id]) {
            return Promise.resolve(this.__data[id]);
        } else {
            return Promise.reject('Not found');
        }
    }

    insert(item) {
        this.__data[item[this.__idProperty]] = item;
        return Promise.resolve();
    }
};

module.exports = InMemoryRepository;