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
    book_id VARCHAR(15) REFERENCES books(book_id),
    PRIMARY KEY (book_cover_id, book_id)
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

INSERT INTO books (book_id, title, subtitle, first_published, description) VALUES
('OL1000020W', 'Foundation', NULL, '1951-01-01', 'A science fiction novel about the collapse of a galactic empire.'),
('OL1000021W', 'Foundation and Empire', NULL, '1952-01-01', 'The second book in the Foundation series.'),
('OL1000022W', 'Second Foundation', NULL, '1953-01-01', 'The third book in the Foundation series.'),
('OL1000023W', 'Dune', NULL, '1965-08-01', 'A science fiction novel set in a distant future.'),
('OL1000024W', 'Dune Messiah', NULL, '1969-01-01', 'The sequel to Dune.'),
('OL1000025W', 'Children of Dune', NULL, '1976-01-01', 'The third novel in the Dune series.'),
('OL1000026W', 'The Left Hand of Darkness', NULL, '1969-03-01', 'A novel about gender and society.'),
('OL1000027W', 'A Wizard of Earthsea', NULL, '1968-01-01', 'A fantasy novel about a young wizard.'),
('OL1000028W', 'Do Androids Dream of Electric Sheep?', NULL, '1968-01-01', 'A dystopian science fiction novel.'),
('OL1000029W', 'The Hitchhiker’s Guide to the Galaxy', NULL, '1979-10-12', 'A comedy science fiction novel.'),
('OL1000030W', 'A Game of Thrones', NULL, '1996-08-06', 'The first novel in A Song of Ice and Fire.'),
('OL1000031W', 'A Clash of Kings', NULL, '1998-11-16', 'The second novel in A Song of Ice and Fire.'),
('OL1000032W', 'The Three-Body Problem', NULL, '2006-01-01', 'A hard science fiction novel.'),
('OL1000033W', 'The Dark Forest', NULL, '2008-01-01', 'The sequel to The Three-Body Problem.'),
('OL1000034W', 'The Martian', NULL, '2011-02-11', 'A novel about survival on Mars.'),
('OL1000035W', 'Good Omens', 'The Nice and Accurate Prophecies of Agnes Nutter, Witch', '1990-05-01', 'A comedic novel about the apocalypse.'),
('OL1000036W', 'The Talisman', NULL, '1984-11-08', 'A dark fantasy novel involving parallel worlds.');

INSERT INTO books (book_id, title, subtitle, first_published, description) VALUES
('OL1000037W', 'Lord of the Flies', NULL, '1954-09-17', 'A novel about boys stranded on an island.'),
('OL1000038W', 'Slaughterhouse-Five', NULL, '1969-03-31', 'A novel about the bombing of Dresden.'),
('OL1000039W', 'The Grapes of Wrath', NULL, '1939-04-14', 'A story of migrant workers during the Great Depression.'),
('OL1000040W', 'Catch-22', NULL, '1961-11-10', 'A satirical novel about World War II.'),
('OL1000041W', 'The Sound and the Fury', NULL, '1929-10-07', 'A novel about the Compson family.'),
('OL1000042W', 'Their Eyes Were Watching God', NULL, '1937-09-18', 'A novel about an African American woman.'),
('OL1000043W', 'The Sun Also Rises', NULL, '1926-10-22', 'A novel about expatriates in Europe.'),
('OL1000044W', 'A Farewell to Arms', NULL, '1929-09-27', 'A love story set during World War I.'),
('OL1000045W', 'The Old Man and the Sea', NULL, '1952-09-01', 'A story of an old fisherman.'),
('OL1000046W', 'Fahrenheit 451', NULL, '1953-10-19', 'A dystopian novel about book burning.'),
('OL1000047W', 'The Road', NULL, '2006-09-26', 'A father and son in a post-apocalyptic world.'),
('OL1000048W', 'No Country for Old Men', NULL, '2005-07-19', 'A crime thriller.'),
('OL1000049W', 'Blood Meridian', NULL, '1985-04-01', 'A violent western.'),
('OL1000050W', 'The Bell Jar', NULL, '1963-01-14', 'A novel about mental health.'),
('OL1000051W', 'The Handmaid''s Tale', NULL, '1985-08-01', 'A dystopian society.'),
('OL1000052W', 'Alias Grace', NULL, '1996-09-01', 'A historical fiction.'),
('OL1000053W', 'The Testaments', NULL, '2019-09-10', 'A sequel to The Handmaid''s Tale.'),
('OL1000054W', 'The Color Purple', NULL, '1982-01-01', 'An epistolary novel.'),
('OL1000055W', 'Beloved', NULL, '1987-09-02', 'A ghost story.'),
('OL1000056W', 'Song of Solomon', NULL, '1977-01-01', 'A magical realism novel.');

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
(15, 'Philosophy'),
(16, 'Magic');

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
(20, 'Mark Twain', 'American writer, humorist, entrepreneur, publisher, and lecturer.', '1835-11-30', '1910-04-21', 'https://en.wikipedia.org/wiki/Mark_Twain'),
(21, 'Neil Gaiman', 'English author of short fiction, novels, and comics.', '1960-11-10', NULL, 'https://en.wikipedia.org/wiki/Neil_Gaiman'),
(22,'Terry Pratchett', 'English author of fantasy novels, especially Discworld.', '1948-04-28', '2015-03-12', 'https://en.wikipedia.org/wiki/Terry_Pratchett'),
(23,'Stephen King', 'American author of horror, supernatural fiction, suspense.', '1947-09-21', NULL, 'https://en.wikipedia.org/wiki/Stephen_King'),
(24,'Peter Straub', 'American novelist and poet.', '1943-03-02', '2022-09-04', 'https://en.wikipedia.org/wiki/Peter_Straub'),
(25,'Robert C. Martin', 'American software engineer and author.', '1952-12-05', NULL, 'https://en.wikipedia.org/wiki/Robert_C._Martin'),
(26,'Martin Fowler', 'British software developer and author.', '1963-12-18', NULL, 'https://en.wikipedia.org/wiki/Martin_Fowler'),
(27,'Kent Beck', 'American software engineer, creator of Extreme Programming.', '1961-03-31', NULL, 'https://en.wikipedia.org/wiki/Kent_Beck'),
(28,'Erich Gamma', 'Swiss software engineer, co-author of Design Patterns.', '1961-03-13', NULL, 'https://en.wikipedia.org/wiki/Erich_Gamma'),
(29,'Richard Helm', 'Computer scientist and software engineer.', NULL, NULL, NULL),
(30,'Ralph Johnson', 'American computer scientist.', '1955-01-01', NULL, 'https://en.wikipedia.org/wiki/Ralph_Johnson_(computer_scientist)'),
(31,'John Vlissides', 'American software engineer.', '1961-08-02', '2005-11-24', 'https://en.wikipedia.org/wiki/John_Vlissides'),
(32, 'Isaac Asimov', 'Science fiction writer and professor of biochemistry.', '1920-01-02', '1992-04-06', 'https://en.wikipedia.org/wiki/Isaac_Asimov'),
(33, 'Arthur C. Clarke', 'British science fiction writer and futurist.', '1917-12-16', '2008-03-19', 'https://en.wikipedia.org/wiki/Arthur_C._Clarke'),
(34, 'Frank Herbert', 'American science fiction author.', '1920-10-08', '1986-02-11', 'https://en.wikipedia.org/wiki/Frank_Herbert'),
(35, 'Ursula K. Le Guin', 'American author of speculative fiction.', '1929-10-21', '2018-01-22', 'https://en.wikipedia.org/wiki/Ursula_K._Le_Guin'),
(36, 'Philip K. Dick', 'American science fiction writer.', '1928-12-16', '1982-03-02', 'https://en.wikipedia.org/wiki/Philip_K._Dick'),
(37, 'Douglas Adams', 'English author and humorist.', '1952-03-11', '2001-05-11', 'https://en.wikipedia.org/wiki/Douglas_Adams'),
(38, 'Brandon Sanderson', 'American fantasy and science fiction writer.', '1975-12-19', NULL, 'https://en.wikipedia.org/wiki/Brandon_Sanderson'),
(39, 'George R. R. Martin', 'American novelist and short story writer.', '1948-09-20', NULL, 'https://en.wikipedia.org/wiki/George_R._R._Martin'),
(40, 'Cixin Liu', 'Chinese science fiction writer.', '1963-06-23', NULL, 'https://en.wikipedia.org/wiki/Liu_Cixin'),
(41, 'Andy Weir', 'American novelist and software engineer.', '1972-06-16', NULL, 'https://en.wikipedia.org/wiki/Andy_Weir'),
(42, 'William Golding', 'English novelist, playwright, and poet.', '1911-09-19', '1993-06-19', 'https://en.wikipedia.org/wiki/William_Golding'),
(43, 'Kurt Vonnegut', 'American writer.', '1922-11-11', '2007-04-11', 'https://en.wikipedia.org/wiki/Kurt_Vonnegut'),
(44, 'John Steinbeck', 'American author.', '1902-02-27', '1968-12-20', 'https://en.wikipedia.org/wiki/John_Steinbeck'),
(45, 'Joseph Heller', 'American author.', '1923-05-01', '1999-12-12', 'https://en.wikipedia.org/wiki/Joseph_Heller'),
(46, 'William Faulkner', 'American writer.', '1897-09-25', '1962-07-06', 'https://en.wikipedia.org/wiki/William_Faulkner'),
(47, 'Zora Neale Hurston', 'American author.', '1891-01-07', '1960-01-28', 'https://en.wikipedia.org/wiki/Zora_Neale_Hurston'),
(48, 'Ray Bradbury', 'American author.', '1920-08-22', '2012-06-05', 'https://en.wikipedia.org/wiki/Ray_Bradbury'),
(49, 'Cormac McCarthy', 'American novelist.', '1933-07-20', '2023-06-13', 'https://en.wikipedia.org/wiki/Cormac_McCarthy'),
(50, 'Sylvia Plath', 'American poet and novelist.', '1932-10-27', '1963-02-11', 'https://en.wikipedia.org/wiki/Sylvia_Plath'),
(51, 'Margaret Atwood', 'Canadian poet and novelist.', '1939-11-18', NULL, 'https://en.wikipedia.org/wiki/Margaret_Atwood'),
(52, 'Alice Walker', 'American novelist.', '1944-02-09', NULL, 'https://en.wikipedia.org/wiki/Alice_Walker'),
(53, 'Toni Morrison', 'American novelist.', '1931-02-18', '2019-08-05', 'https://en.wikipedia.org/wiki/Toni_Morrison');

-- book_subjects_rel
INSERT INTO book_subjects_rel (book_id, subject_id) VALUES
('OL1000000W', 1), ('OL1000000W', 2),  -- The Hobbit: Fantasy, Adventure
('OL1000001W', 1),                     -- Harry Potter: Fantasy
('OL1000001W', 16),                    -- Harry Potter: Magic
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
('OL1000019W', 3), ('OL1000019W', 8),  -- Anna Karenina: Fiction, Romance
('OL1000037W', 1), ('OL1000037W', 2),
('OL1000038W', 9), ('OL1000038W', 3),
('OL1000039W', 4), ('OL1000039W', 3),
('OL1000040W', 3), ('OL1000040W', 6),
('OL1000041W', 3), ('OL1000041W', 14),
('OL1000042W', 3), ('OL1000042W', 8),
('OL1000043W', 3), ('OL1000043W', 8),
('OL1000044W', 3), ('OL1000044W', 8),
('OL1000045W', 2), ('OL1000045W', 3),
('OL1000046W', 7), ('OL1000046W', 9),
('OL1000047W', 3), ('OL1000047W', 7),
('OL1000048W', 3), ('OL1000048W', 5),
('OL1000049W', 2), ('OL1000049W', 3),
('OL1000050W', 3), ('OL1000050W', 14),
('OL1000051W', 7), ('OL1000051W', 3),
('OL1000052W', 3), ('OL1000052W', 10),
('OL1000053W', 7), ('OL1000053W', 3),
('OL1000054W', 3), ('OL1000054W', 8),
('OL1000055W', 3), ('OL1000055W', 12),
('OL1000056W', 1), ('OL1000056W', 3);

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
('OL1000019W', 13),                    -- Anna Karenina: Tolstoy
('OL1000020W', 32),
('OL1000021W', 32),
('OL1000022W', 32),
('OL1000023W', 34),
('OL1000024W', 34),
('OL1000025W', 34),
('OL1000026W', 35),
('OL1000027W', 35),
('OL1000028W', 36),
('OL1000029W', 37),
('OL1000030W', 39),
('OL1000031W', 39),
('OL1000032W', 40),
('OL1000033W', 40),
('OL1000034W', 41),
('OL1000035W', 21),
('OL1000035W', 22),
('OL1000036W', 23),
('OL1000036W', 24),
('OL1000037W', 42),
('OL1000038W', 43),
('OL1000039W', 44),
('OL1000040W', 45),
('OL1000041W', 46),
('OL1000042W', 47),
('OL1000043W', 19),
('OL1000044W', 19),
('OL1000045W', 19),
('OL1000046W', 48),
('OL1000047W', 49),
('OL1000048W', 49),
('OL1000049W', 49),
('OL1000050W', 50),
('OL1000051W', 51),
('OL1000052W', 51),
('OL1000053W', 51),
('OL1000054W', 52),
('OL1000055W', 53),
('OL1000056W', 53);

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

