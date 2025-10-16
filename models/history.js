class History{
    constructor(history_id, book_id, issue_date, return_date, status, issued_by, received_by){
        this.history_id = history_id;
        this.book_id = book_id;
        this.issue_date = issue_date;
        this. return_date = return_date;
        this.status = status;
        this.issued_by = issued_by;
        this.received_by = received_by;
    }
}

export default History