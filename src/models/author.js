class Author {
    constructor(authorID, name, birthDate, deathDate, bio, wikipedia) {
        this.authorID = authorID;
        this.name = name;
        this.bio = bio;
        this.birthDate = birthDate;
        this.deathDate = deathDate;
        this.wikipedia = wikipedia;
    }
}

module.exports = Author