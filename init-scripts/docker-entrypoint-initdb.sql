-- SCHEMA

CREATE TABLE customers (
    customer_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    postal_code VARCHAR(6) NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE book_covers (
    cover_id INTEGER PRIMARY KEY,
    file_path VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    book_id VARCHAR(15) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    first_published DATE,
    description TEXT,
    cover_id INTEGER,
    FOREIGN KEY (cover_id) REFERENCES book_covers(cover_id) ON DELETE SET NULL
);

CREATE TABLE book_covers_rel (
    book_cover_id INTEGER REFERENCES book_covers(cover_id),
    book_id VARCHAR(15) REFERENCES books(book_id)
);

CREATE TABLE subjects (
    subject_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    topic VARCHAR(255) NOT NULL
);

CREATE TABLE book_subjects_rel (
    book_id VARCHAR(15),
    subject_id INTEGER,
    PRIMARY KEY (book_id, subject_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);

CREATE TABLE authors (
    author_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    birth_date DATE,
    death_date DATE,
    wikipedia VARCHAR(255)
);

CREATE TABLE book_authors_rel (
    book_id VARCHAR(15),
    author_id INTEGER,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (author_id) REFERENCES authors(author_id)
);

CREATE TABLE admins (
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    login VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE history (
    history_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    book_id VARCHAR(15) NOT NULL,
    customer_id VARCHAR(10) NOT NULL,
    issue_date DATE NOT NULL,
    return_date DATE,
    status BOOLEAN NOT NULL DEFAULT FALSE,
    issued_by INTEGER NOT NULL,
    received_by INTEGER,
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (issued_by) REFERENCES admins(user_id),
    FOREIGN KEY (received_by) REFERENCES admins(user_id)
);

CREATE TABLE collections (
    collection_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE collection_books (
    id SERIAL PRIMARY KEY,
    collection_id INT NOT NULL REFERENCES collections(collection_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255)
);


-- TEST DATA

-- admin user
INSERT INTO admins (login, password) VALUES ('admin', 'admin123');

-- book covers
INSERT INTO book_covers (cover_id, file_path) VALUES
(1, 'the-hobbit-1.webp'),
(2, 'the-hobbit-2.webp'),
(3, 'the-hobbit-3.webp'),
(4, 'harry-potter-and-the-order-of-the-phoenix-1.webp'),
(5, 'les-miserables-1.webp'),
(6, 'moby-dick-or-the-white-whale-1.webp'),
(7, 'the-da-vinci-code-1.webp'),
(8, 'three-men-in-a-boat-to-say-nothing-of-the-dog-1.webp'),
(9, 'the-hunger-games-1.webp'),
(10, 'pride-and-prejudice-1.webp'),
(11, '1984-1.webp');

-- books
INSERT INTO books (book_id, title, subtitle, first_published, description) VALUES
('OL1000000W', 'The Hobbit', 'Or There and Back Again', '1937-09-21', 'A fantasy novel about Bilbo Baggins adventure.'),
('OL1000001W', 'Harry Potter and the Order of the Phoenix', NULL, '2003-06-21', 'The fifth book in the Harry Potter series.'),
('OL1000002W', 'The homeplace', NULL, '1978-01-01', 'A story of family and heritage.'),
('OL1000003W', 'Les Misérables', NULL, '1862-01-01', 'A historical novel set in France.'),
('OL1000004W', 'Moby Dick, or The White Whale', NULL, '1851-10-18', 'A tale of obsession with a white whale.'),
('OL1000005W', 'The Da Vinci Code', NULL, '2003-03-18', 'A thriller involving secret societies.'),
('OL1000006W', 'Three Men in a Boat (to say nothing of the dog)', NULL, '1889-01-01', 'A humorous account of a boating trip.'),
('OL1000007W', 'The Hunger Games', NULL, '2008-09-14', 'A dystopian novel about survival.'),
('OL1000008W', 'Pride and Prejudice', NULL, '1813-01-28', 'A romantic novel about manners and marriage.'),
('OL1000009W', '1984', NULL, '1949-06-08', 'A dystopian social science fiction novel.'),
('OL1000010W', 'To Kill a Mockingbird', NULL, '1960-07-11', 'A novel about racial injustice.'),
('OL1000011W', 'The Great Gatsby', NULL, '1925-04-10', 'A critique of the American Dream.'),
('OL1000012W', 'War and Peace', NULL, '1869-01-01', 'An epic novel about Russian society.'),
('OL1000013W', 'The Catcher in the Rye', NULL, '1951-07-16', 'A story of teenage angst.'),
('OL1000014W', 'One Hundred Years of Solitude', NULL, '1967-05-30', 'A magical realism novel.'),
('OL1000015W', 'Brave New World', NULL, '1932-01-01', 'A dystopian vision of the future.'),
('OL1000016W', 'The Lord of the Rings', 'The Fellowship of the Ring', '1954-07-29', 'The first part of the epic fantasy trilogy.'),
('OL1000017W', 'Crime and Punishment', NULL, '1866-01-01', 'A psychological thriller.'),
('OL1000018W', 'The Brothers Karamazov', NULL, '1880-01-01', 'A philosophical novel.'),
('OL1000019W', 'Anna Karenina', NULL, '1877-01-01', 'A tragic love story.');

-- book_covers_rel
INSERT INTO book_covers_rel (book_cover_id, book_id) VALUES
(1, 'OL1000000W'),
(2, 'OL1000000W'),
(3, 'OL1000000W'),
(4, 'OL1000001W'),
(5, 'OL1000003W'),
(6, 'OL1000004W'),
(7, 'OL1000005W'),
(8, 'OL1000006W'),
(9, 'OL1000007W'),
(10, 'OL1000008W'),
(11, 'OL1000009W');

-- subjects
INSERT INTO subjects (subject_id, topic) OVERRIDING SYSTEM VALUE VALUES
(1, 'Fantasy'),
(2, 'Adventure'),
(3, 'Fiction'),
(4, 'Historical Fiction'),
(5, 'Thriller'),
(6, 'Comedy'),
(7, 'Dystopian'),
(8, 'Romance'),
(9, 'Science Fiction'),
(10, 'Mystery'),
(11, 'Biography'),
(12, 'Horror'),
(13, 'Poetry'),
(14, 'Drama'),
(15, 'Philosophy');

-- authors
INSERT INTO authors (author_id, name, bio, birth_date, death_date, wikipedia) OVERRIDING SYSTEM VALUE VALUES
(1, 'J.R.R. Tolkien', 'English writer, poet, philologist, and academic.', '1892-01-03', '1973-09-02', 'https://en.wikipedia.org/wiki/J._R._R._Tolkien'),
(2, 'J.K. Rowling', 'British author, philanthropist, and screenwriter.', '1965-07-31', NULL, 'https://en.wikipedia.org/wiki/J._K._Rowling'),
(3, 'Victor Hugo', 'French poet, novelist, and dramatist.', '1802-02-26', '1885-05-22', 'https://en.wikipedia.org/wiki/Victor_Hugo'),
(4, 'Herman Melville', 'American novelist, short story writer, and poet.', '1819-08-01', '1891-09-28', 'https://en.wikipedia.org/wiki/Herman_Melville'),
(5, 'Dan Brown', 'American author of thriller fiction.', '1964-06-22', NULL, 'https://en.wikipedia.org/wiki/Dan_Brown'),
(6, 'Jerome K. Jerome', 'English writer and humorist.', '1859-05-02', '1927-06-14', 'https://en.wikipedia.org/wiki/Jerome_K._Jerome'),
(7, 'Suzanne Collins', 'American television writer and novelist.', '1962-08-10', NULL, 'https://en.wikipedia.org/wiki/Suzanne_Collins'),
(8, 'John Doe', 'Fictional placeholder name.', NULL, NULL, NULL),
(9, 'Jane Austen', 'English novelist known for her witty social commentary.', '1775-12-16', '1817-07-18', 'https://en.wikipedia.org/wiki/Jane_Austen'),
(10, 'George Orwell', 'English novelist, essayist, journalist and critic.', '1903-06-25', '1950-01-21', 'https://en.wikipedia.org/wiki/George_Orwell'),
(11, 'Harper Lee', 'American novelist widely known for To Kill a Mockingbird.', '1926-04-28', '2016-02-19', 'https://en.wikipedia.org/wiki/Harper_Lee'),
(12, 'F. Scott Fitzgerald', 'American novelist, essayist, screenwriter and short-story writer.', '1896-09-24', '1940-12-21', 'https://en.wikipedia.org/wiki/F._Scott_Fitzgerald'),
(13, 'Leo Tolstoy', 'Russian writer who is regarded as one of the greatest authors of all time.', '1828-09-09', '1910-11-20', 'https://en.wikipedia.org/wiki/Leo_Tolstoy'),
(14, 'J.D. Salinger', 'American writer known for The Catcher in the Rye.', '1919-01-01', '2010-01-27', 'https://en.wikipedia.org/wiki/J._D._Salinger'),
(15, 'Gabriel García Márquez', 'Colombian novelist, short-story writer, screenwriter and journalist.', '1927-03-06', '2014-04-17', 'https://en.wikipedia.org/wiki/Gabriel_Garc%C3%ADa_M%C3%A1rquez'),
(16, 'Aldous Huxley', 'English writer and philosopher.', '1894-07-26', '1963-11-22', 'https://en.wikipedia.org/wiki/Aldous_Huxley'),
(17, 'Fyodor Dostoevsky', 'Russian novelist, short story writer, essayist, journalist and philosopher.', '1821-11-11', '1881-02-09', 'https://en.wikipedia.org/wiki/Fyodor_Dostoevsky'),
(18, 'Franz Kafka', 'German-speaking Bohemian Jewish novelist and short story writer.', '1883-07-03', '1924-06-03', 'https://en.wikipedia.org/wiki/Franz_Kafka'),
(19, 'Ernest Hemingway', 'American novelist, short story writer, and journalist.', '1899-07-21', '1961-07-02', 'https://en.wikipedia.org/wiki/Ernest_Hemingway'),
(20, 'Mark Twain', 'American writer, humorist, entrepreneur, publisher, and lecturer.', '1835-11-30', '1910-04-21', 'https://en.wikipedia.org/wiki/Mark_Twain');

-- book_subjects_rel
INSERT INTO book_subjects_rel (book_id, subject_id) VALUES
('OL1000000W', 1), ('OL1000000W', 2),  -- The Hobbit: Fantasy, Adventure
('OL1000001W', 1),                     -- Harry Potter: Fantasy
('OL1000002W', 3),                     -- The homeplace: Fiction
('OL1000003W', 4),                     -- Les Misérables: Historical Fiction
('OL1000004W', 2),                     -- Moby Dick: Adventure
('OL1000005W', 5),                     -- The Da Vinci Code: Thriller
('OL1000006W', 6),                     -- Three Men in a Boat: Comedy
('OL1000007W', 7),                     -- The Hunger Games: Dystopian
('OL1000008W', 8),                     -- Pride and Prejudice: Romance
('OL1000009W', 7), ('OL1000009W', 9),  -- 1984: Dystopian, Science Fiction
('OL1000010W', 3), ('OL1000010W', 14), -- To Kill a Mockingbird: Fiction, Drama
('OL1000011W', 3), ('OL1000011W', 14), -- The Great Gatsby: Fiction, Drama
('OL1000012W', 4),                     -- War and Peace: Historical Fiction
('OL1000013W', 3),                     -- The Catcher in the Rye: Fiction
('OL1000014W', 1), ('OL1000014W', 3),  -- One Hundred Years of Solitude: Fantasy, Fiction
('OL1000015W', 7), ('OL1000015W', 9),  -- Brave New World: Dystopian, Science Fiction
('OL1000016W', 1), ('OL1000016W', 2),  -- The Lord of the Rings: Fantasy, Adventure
('OL1000017W', 3), ('OL1000017W', 10), -- Crime and Punishment: Fiction, Mystery
('OL1000018W', 3), ('OL1000018W', 15), -- The Brothers Karamazov: Fiction, Philosophy
('OL1000019W', 3), ('OL1000019W', 8);  -- Anna Karenina: Fiction, Romance

-- book_authors_rel
INSERT INTO book_authors_rel (book_id, author_id) VALUES
('OL1000000W', 1),                     -- The Hobbit: Tolkien
('OL1000001W', 2),                     -- Harry Potter: Rowling
('OL1000002W', 8),                     -- The homeplace: John Doe
('OL1000003W', 3),                     -- Les Misérables: Hugo
('OL1000004W', 4),                     -- Moby Dick: Melville
('OL1000005W', 5),                     -- The Da Vinci Code: Brown
('OL1000006W', 6),                     -- Three Men in a Boat: Jerome
('OL1000007W', 7),                     -- The Hunger Games: Collins
('OL1000008W', 9),                     -- Pride and Prejudice: Austen
('OL1000009W', 10),                    -- 1984: Orwell
('OL1000010W', 11),                    -- To Kill a Mockingbird: Lee
('OL1000011W', 12),                    -- The Great Gatsby: Fitzgerald
('OL1000012W', 13),                    -- War and Peace: Tolstoy
('OL1000013W', 14),                    -- The Catcher in the Rye: Salinger
('OL1000014W', 15),                    -- One Hundred Years of Solitude: García Márquez
('OL1000015W', 16),                    -- Brave New World: Huxley
('OL1000016W', 1),                     -- The Lord of the Rings: Tolkien
('OL1000017W', 17),                    -- Crime and Punishment: Dostoevsky
('OL1000018W', 17),                    -- The Brothers Karamazov: Dostoevsky
('OL1000019W', 13);                    -- Anna Karenina: Tolstoy

-- customers
INSERT INTO customers (customer_id, name, address, postal_code, city, phone, email) VALUES
('C1000', 'Kenneth Wright', '4070 Viverra.  Avenue', '72604', 'Lac-Serent', '2025550147', 'kwright@gmail.com'),
('C1001', 'Kylie Green', '4196 Pharetra  Straße', '8071', 'Northumberland', '3075550125', 'kylie1990@msn.com'),
('C1002', 'Shelley Howard', '5193 Aliquet Rd.', '5404', 'Broxburn', '4105550161', 'howardshelley@outlook.com'),
('C1003', 'Nash Charles', '3549 Nullam  Rd.', '487505', 'Turrialba', '2085550115', 'nash_charles@yahoo.com'),
('C1004', 'Tad Curry', '8702 Dolor.  Straße', '52201', 'Carbonear', '6175550184', 'tad80curry@gmail.com'),
('C1005', 'Quon Palmer', '7125 Aliquam  Straße', '20248', 'Quimper', '8035550173', 'palmer_quimper@msn.com'),
('C1006', 'Ulric Stein', '2438 Ornare  Straße', '9663', 'Río Hurtado', '8605550157', 'stein7125@outlook.com'),
('C1007', 'Grace Bridges', '243-9174 Semper St.', '717993', 'Chaudfontaine', '8085550116', 'grace.bridges@yahoo.com'),
('C1008', 'Jasper Sweet', '564-8483 Cursus  Avenue', '21300', 'York', '6015550103', 'sweety_jasper@gmail.com'),
('C1009', 'Blair Glenn', '457-157 Luctus  Rd.', '644373', 'Vilna', '4055550163', 'blair_glenn@msn.com'),
('C1010', 'Bianca Mendoza', '2001 Sem St.', '151099', 'Constitución', '9195550122', 'bmendoza@outlook.com'),
('C1011', 'Alice Johnson', '123 Main St.', '12345', 'Springfield', '5551234567', 'alice@example.com'),
('C1012', 'Bob Smith', '456 Oak Ave.', '67890', 'Riverside', '5559876543', 'bob@example.com'),
('C1013', 'Charlie Brown', '789 Pine Rd.', '54321', 'Hilltop', '5554567890', 'charlie@example.com'),
('C1014', 'Diana Prince', '321 Elm St.', '09876', 'Metropolis', '5557890123', 'diana@example.com'),
('C1015', 'Edward Norton', '654 Birch Ln.', '13579', 'Gotham', '5553210987', 'edward@example.com'),
('C1016', 'Fiona Green', '987 Cedar Dr.', '24680', 'Smallville', '5556543210', 'fiona@example.com'),
('C1017', 'George Lucas', '147 Maple Ct.', '97531', 'Star City', '5551472580', 'george@example.com'),
('C1018', 'Helen Troy', '258 Spruce St.', '86420', 'Atlantis', '5553692580', 'helen@example.com'),
('C1019', 'Ian Fleming', '369 Willow Ave.', '75319', 'London', '5552583690', 'ian@example.com'),
('C1020', 'Julia Roberts', '741 Poplar Rd.', '15973', 'Hollywood', '5557418520', 'julia@example.com');

-- history
INSERT INTO history (book_id, customer_id, issue_date, return_date, status, issued_by, received_by) VALUES
('OL1000000W', 'C1007', '2017-01-13', '2017-01-23', true, 1, 1),
('OL1000001W', 'C1007', '2017-02-03', '2017-02-21', true, 1, 1),
('OL1000002W', 'C1008', '2017-02-06', '2017-02-20', true, 1, 1),
('OL1000002W', 'C1003', '2017-03-01', '2017-03-12', true, 1, 1),
('OL1000002W', 'C1010', '2017-03-25', '2017-04-09', true, 1, 1),
('OL1000003W', 'C1007', '2017-04-03', '2017-05-05', true, 1, 1),
('OL1000004W', 'C1008', '2017-05-24', NULL, false, 1, NULL),
('OL1000005W', 'C1010', '2017-05-25', NULL, false, 1, NULL),
('OL1000002W', 'C1007', '2017-05-26', '2017-06-16', true, 1, 1),
('OL1000006W', 'C1007', '2017-05-26', NULL, false, 1, NULL),
('OL1000004W', 'C1007', '2017-06-03', '2017-06-11', true, 1, 1),
('OL1000005W', 'C1007', '2017-06-03', NULL, false, 1, NULL),
('OL1000007W', 'C1007', '2017-06-03', NULL, false, 1, NULL),
('OL1000008W', 'C1011', '2017-07-01', '2017-07-15', true, 1, 1),
('OL1000009W', 'C1012', '2017-07-05', NULL, false, 1, NULL),
('OL1000010W', 'C1013', '2017-07-10', '2017-07-25', true, 1, 1),
('OL1000011W', 'C1014', '2017-07-15', NULL, false, 1, NULL),
('OL1000012W', 'C1015', '2017-07-20', '2017-08-05', true, 1, 1),
('OL1000013W', 'C1016', '2017-07-25', NULL, false, 1, NULL),
('OL1000014W', 'C1017', '2017-08-01', '2017-08-15', true, 1, 1),
('OL1000015W', 'C1018', '2017-08-05', NULL, false, 1, NULL),
('OL1000016W', 'C1019', '2017-08-10', '2017-08-25', true, 1, 1),
('OL1000017W', 'C1020', '2017-08-15', NULL, false, 1, NULL),
('OL1000018W', 'C1000', '2017-08-20', '2017-09-05', true, 1, 1),
('OL1000019W', 'C1001', '2017-08-25', NULL, false, 1, NULL),
('OL1000000W', 'C1002', '2017-09-01', '2017-09-15', true, 1, 1),
('OL1000001W', 'C1003', '2017-09-05', NULL, false, 1, NULL),
('OL1000002W', 'C1004', '2017-09-10', '2017-09-25', true, 1, 1),
('OL1000003W', 'C1005', '2017-09-15', NULL, false, 1, NULL),
('OL1000004W', 'C1006', '2017-09-20', '2017-10-05', true, 1, 1),
('OL1000005W', 'C1007', '2017-09-25', NULL, false, 1, NULL),
('OL1000006W', 'C1008', '2017-10-01', '2017-10-15', true, 1, 1),
('OL1000007W', 'C1009', '2017-10-05', NULL, false, 1, NULL);

-- collections
INSERT INTO collections (collection_id, title) OVERRIDING SYSTEM VALUE VALUES
(1, 'New Year'),
(2, 'Harry Potter');

-- collection_books
INSERT INTO collection_books (id, collection_id, title, image) OVERRIDING SYSTEM VALUE VALUES
(89, 1, 'Moby Dick, or The White Whale', 'moby-dick-or-the-white-whale-1.webp'),
(90, 1, 'The Da Vinci Code', 'the-da-vinci-code-1.webp'),
(91, 1, 'Pride and Prejudice', 'pride-and-prejudice-1.webp'),
(92, 1, 'Three Men in a Boat (to say nothing of the dog)', 'three-men-in-a-boat-to-say-nothing-of-the-dog-1.webp'),
(93, 1, 'Harry Potter and the Order of the Phoenix', 'harry-potter-and-the-order-of-the-phoenix-1.webp'),
(94, 1, 'The Hobbit', 'the-hobbit-1.webp'),
(95, 1, 'Les Misérables', 'les-miserables-1.webp'),
(35, 2, 'Harry Potter and the Order of the Phoenix', 'harry-potter-and-the-order-of-the-phoenix-1.webp');
