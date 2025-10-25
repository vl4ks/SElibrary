const historyRepository = require("../repositories/history.repository")

class CirculationService {
    async circulation(customerId) {
        // historyRepository.findByCustomerId(customerId)
        // return currentIssue[], history[]
    }

    /*async getCurrentIssues(customerId) {

    }

    async getHistory(customerId) {
        
    }*/
    
    async issue(bookId, customerId) {
        // historyRepository.create()
    }

    async return(bookId, customerId) {
        // historyRepository.create() ?
    }

    async renew(bookId) {
        // historyRepository.create() ?
    }
}

module.exports = new CirculationService()