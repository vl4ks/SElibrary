class Book {
    constructor(bookID, title, subtitle, firstPublished, description, authorIDs, subjectIDs, coverIDs) {
        this.bookID = bookID;
        this.title = title;
        this.subtitle = subtitle;
        this.firstPublished = firstPublished;
        this.description = description;
        this.authorIDs = authorIDs;
        this.subjectIDs = subjectIDs;
        this.coverIDs = coverIDs;
    }
}

module.exports = Book