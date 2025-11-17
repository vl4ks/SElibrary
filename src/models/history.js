class History {
    constructor(historyID, bookID, customerID, issueDate, returnDate, status, issuedBy, receivedBy) {
        this.historyID = historyID;
        this.bookID = bookID;
        this.customerID = customerID;
        this.issueDate = issueDate;
        this.returnDate = returnDate;
        this.status = status;
        this.issuedBy = issuedBy;
        this.receivedBy = receivedBy;
    }
}

module.exports = History