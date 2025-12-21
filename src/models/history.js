class History {
    constructor(historyID, bookID, bookTitle, customerID, issueDate, returnDate, status, issuedBy, receivedBy) {
        this.historyID = historyID;
        this.bookID = bookID;
        this.title = bookTitle;
        this.customerID = customerID;
        this.issueDate = issueDate ? new Date(issueDate) : null;
        this.returnDate = returnDate ? new Date(returnDate) : null; 
        this.status = status;
        this.issuedBy = issuedBy;
        this.receivedBy = receivedBy;
    }
}


module.exports = History