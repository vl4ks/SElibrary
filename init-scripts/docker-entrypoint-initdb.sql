-- SCHEMA

CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
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
    book_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    first_published DATE,
    description TEXT,
    cover_id INTEGER,
    FOREIGN KEY (cover_id) REFERENCES book_covers(cover_id) ON DELETE SET NULL
);

CREATE TABLE subjects (
    subject_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    topic VARCHAR(255) NOT NULL
);

CREATE TABLE book_subjects_rel (
    book_id INTEGER,
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
    book_id INTEGER,
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
    book_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
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

-- TEST DATA

-- admin user
INSERT INTO admins (login, password) VALUES ('admin', 'admin123');

-- book covers
INSERT INTO book_covers (cover_id, file_path) VALUES
(1, 'defaultbookpreview.png'),
(2, 'defaultbookpreview.png'),
(3, 'defaultbookpreview.png'),
(4, 'defaultbookpreview.png'),
(5, 'defaultbookpreview.png'),
(6, 'defaultbookpreview.png'),
(7, 'defaultbookpreview.png'),
(8, 'defaultbookpreview.png');

-- books
INSERT INTO books (book_id, title, cover_id) OVERRIDING SYSTEM VALUE VALUES
(1, 'The Hobbit', 1),
(2, 'Harry Potter and the Order of the Phoenix', 2),
(3, 'The homeplace', 3),
(4, 'Les Misérables', 4),
(5, 'Moby Dick, or The White Whale', 5),
(6, 'The Da Vinci Code', 6),
(7, 'Three Men in a Boat (to say nothing of the dog)', 7),
(8, 'The Hunger Games', 8);

-- subjects
INSERT INTO subjects (subject_id, topic) OVERRIDING SYSTEM VALUE VALUES
(1, 'Fantasy'),
(2, 'Adventure'),
(3, 'Fiction'),
(4, 'Historical Fiction'),
(5, 'Thriller'),
(6, 'Comedy'),
(7, 'Dystopian');

-- authors
INSERT INTO authors (author_id, name) OVERRIDING SYSTEM VALUE VALUES
(1, 'J.R.R. Tolkien'),
(2, 'J.K. Rowling'),
(3, 'Victor Hugo'),
(4, 'Herman Melville'),
(5, 'Dan Brown'),
(6, 'Jerome K. Jerome'),
(7, 'Suzanne Collins'),
(8, 'John Doe');

-- book_subjects_rel
INSERT INTO book_subjects_rel (book_id, subject_id) VALUES
(1, 1), (1, 2), -- The Hobbit: Fantasy, Adventure
(2, 1),         -- Harry Potter: Fantasy
(3, 3),         -- The homeplace: Fiction
(4, 4),         -- Les Misérables: Historical Fiction
(5, 2),         -- Moby Dick: Adventure
(6, 5),         -- The Da Vinci Code: Thriller
(7, 6),         -- Three Men in a Boat: Comedy
(8, 7);         -- The Hunger Games: Dystopian

-- book_authors_rel
INSERT INTO book_authors_rel (book_id, author_id) VALUES
(1, 1),         -- The Hobbit: Tolkien
(2, 2),         -- Harry Potter: Rowling
(3, 8),         -- The homeplace: John Doe
(4, 3),         -- Les Misérables: Hugo
(5, 4),         -- Moby Dick: Melville
(6, 5),         -- The Da Vinci Code: Brown
(7, 6),         -- Three Men in a Boat: Jerome
(8, 7);         -- The Hunger Games: Collins

-- customers
INSERT INTO customers (customer_id, name, address, postal_code, city, phone, email) OVERRIDING SYSTEM VALUE VALUES
(1005, 'Kenneth Wright', '4070 Viverra.  Avenue', '72604', 'Lac-Serent', '2025550147', 'kwright@gmail.com'),
(1006, 'Kylie Green', '4196 Pharetra  Straße', '8071', 'Northumberland', '3075550125', 'kylie1990@msn.com'),
(1013, 'Shelley Howard', '5193 Aliquet Rd.', '5404', 'Broxburn', '4105550161', 'howardshelley@outlook.com'),
(1017, 'Nash Charles', '3549 Nullam  Rd.', '487505', 'Turrialba', '2085550115', 'nash_charles@yahoo.com'),
(1021, 'Tad Curry', '8702 Dolor.  Straße', '52201', 'Carbonear', '6175550184', 'tad80curry@gmail.com'),
(1025, 'Quon Palmer', '7125 Aliquam  Straße', '20248', 'Quimper', '8035550173', 'palmer_quimper@msn.com'),
(1027, 'Ulric Stein', '2438 Ornare  Straße', '9663', 'Río Hurtado', '8605550157', 'stein7125@outlook.com'),
(1028, 'Grace Bridges', '243-9174 Semper St.', '717993', 'Chaudfontaine', '8085550116', 'grace.bridges@yahoo.com'),
(1029, 'Jasper Sweet', '564-8483 Cursus  Avenue', '21300', 'York', '6015550103', 'sweety_jasper@gmail.com'),
(1030, 'Blair Glenn', '457-157 Luctus  Rd.', '644373', 'Vilna', '4055550163', 'blair_glenn@msn.com'),
(1031, 'Bianca Mendoza', '2001 Sem St.', '151099', 'Constitución', '9195550122', 'bmendoza@outlook.com');

-- history
INSERT INTO history (book_id, customer_id, issue_date, return_date, status, issued_by, received_by) VALUES
(1, 1028, '2017-01-13', '2017-01-23', true, 1, 1),
(2, 1028, '2017-02-03', '2017-02-21', true, 1, 1),
(3, 1029, '2017-02-06', '2017-02-20', true, 1, 1),
(3, 1017, '2017-03-01', '2017-03-12', true, 1, 1),
(3, 1031, '2017-03-25', '2017-04-09', true, 1, 1),
(4, 1028, '2017-04-03', '2017-05-05', true, 1, 1),
(5, 1029, '2017-05-24', NULL, false, 1, NULL),
(6, 1031, '2017-05-25', NULL, false, 1, NULL),
(3, 1028, '2017-05-26', '2017-06-16', true, 1, 1),
(7, 1028, '2017-05-26', NULL, false, 1, NULL),
(5, 1028, '2017-06-03', '2017-06-11', true, 1, 1),
(6, 1028, '2017-06-03', NULL, false, 1, NULL),
(8, 1028, '2017-06-03', NULL, false, 1, NULL);