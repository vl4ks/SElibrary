class Book {
    constructor(book_id, title, first_published, description, author_id, subject_ids, cover_ids) {
        this.book_id = book_id;
        this.title = title;
        this.first_published = first_published;
        this.description = description;
        this.author_id = author_id;
        this.subject_ids = subject_ids;
        this.cover_ids = cover_ids;
    }
}

module.exports = Book