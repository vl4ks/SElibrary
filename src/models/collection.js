class Collection {
    constructor(id, title, books = []) {
        this.id = id;
        this.title = title;
        this.books = books;
    }
}

module.exports = Collection;