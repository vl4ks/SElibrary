class Book {
    constructor(bookID, title, publishedDate, description, authorIDs, subjectIDs, coverIDs) {
        this.bookID = bookID;
        this.title = title;
        this.publishedDate = publishedDate;
        this.description = description;
        this.authorIDs = authorIDs;
        this.subjectIDs = subjectIDs;
        this.coverIDs = coverIDs;
    }
}

module.exports = Book