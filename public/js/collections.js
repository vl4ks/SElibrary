let editingCollection = null;

document.addEventListener("DOMContentLoaded", () => {
	loadCollections();

	document.getElementById("add-collection-btn")
		.addEventListener("click", () => openModal(null));

	document.getElementById("cancel-modal-btn")
		.addEventListener("click", closeModal);

	document.getElementById("save-collection-btn")
		.addEventListener("click", saveCollection);

	document.getElementById("add-book-btn")
		.addEventListener("click", addBookRow);
});


async function loadCollections() {
	const res = await fetch("/api/collections");
	const collections = await res.json();
	renderCollections(collections);
}

function renderCollections(collections) {
	const container = document.getElementById("collections-list");
	container.innerHTML = "";

	if (!collections.length) {
		container.innerHTML = `<p class="empty">No collections yet.</p>`;
		return;
	}

	collections.forEach(col => {
		container.appendChild(createCollectionCard(col));
	});
}

function createCollectionCard(c) {
	const div = document.createElement("div");
	div.className = "collection-item ";
	div.dataset.id = c.id;

	const books = c.books || [];

	div.innerHTML = `
        <div class="collection-info">
            <h3>${c.title}</h3>
        </div>

        <div class="books-list">
            ${books.map(b => `
                <div class="book-cover">
                    <img src="/img/covers/${b.image || 'defaultbookpreview.png'}" alt="${b.title}">
                    <p>${b.title}</p>
                </div>
            `).join('')}
        </div>

        ${window.isLoggedIn ? `
        <div class="collection-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
        ` : ''}
    `;

	if (window.isLoggedIn) {
		div.querySelector(".edit-btn").addEventListener("click", () => openModal(c));
		div.querySelector(".delete-btn").addEventListener("click", () => deleteCollection(c.id));
	}

	return div;
}


function openModal(collection) {
	editingCollection = collection;

	document.getElementById("collection-modal").classList.remove("hidden");

	const titleInput = document.getElementById("collection-name-input");
	const booksList = document.getElementById("books-list");

	titleInput.value = "";
	booksList.innerHTML = "";

	if (collection) {
		document.getElementById("modal-title").textContent = "Edit Collection";
		titleInput.value = collection.title;

		(collection.books || []).forEach(b => addBookRow(b));
	} else {
		document.getElementById("modal-title").textContent = "New Collection";
	}
}

function closeModal() {
	document.getElementById("collection-modal").classList.add("hidden");
	editingCollection = null;
}


async function fetchCoverByTitle(title) {
	try {
		const searchRes = await fetch("/api/catalog/search", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title, page: 1 })
		});

		const searchData = await searchRes.json();
		const books = searchData.rows || [];

		if (books.length === 0) {
			return "defaultbookpreview.png";
		}

		const firstBook = books[0];
		const bookRes = await fetch(`/api/catalog/books/${firstBook.bookID}`);
		const bookData = await bookRes.json();

		if (bookData.covers && bookData.covers.length > 0) {
			return bookData.covers[0].filePath;
		} else {
			return "defaultbookpreview.png";
		}
	} catch (err) {
		console.error("Error fetching cover for", title, err);
		return "defaultbookpreview.png";
	}
}

function addBookRow(book = { id: "", title: "", image: "" }) {
	const wrapper = document.createElement("div");
	wrapper.className = "book-item";

	wrapper.innerHTML = `
        <input class="book-title" type="text" placeholder="Book title" value="${book.title || ""}">
        <button class="delete-book">✕</button>
    `;

	wrapper.querySelector(".delete-book")
		.addEventListener("click", () => wrapper.remove());

	document.getElementById("books-list").appendChild(wrapper);
}


function getBooksFromModal() {
	return [...document.querySelectorAll("#books-list .book-item")].map(row => ({
		id: "",
		title: row.querySelector(".book-title").value.trim()
	})).filter(b => b.title !== "");
}


async function saveCollection() {
	const title = document.getElementById("collection-name-input").value.trim();
	const books = getBooksFromModal();

	if (!title) {
		alert("Collection name is required");
		return;
	}

	const booksWithCovers = await Promise.all(books.map(async (book) => {
		const image = await fetchCoverByTitle(book.title);
		return { ...book, image };
	}));

	const payload = { title, books: booksWithCovers };

	try {
		if (editingCollection) {
			await fetch(`/api/collections/${editingCollection.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});
		} else {
			await fetch("/api/collections", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});
		}

		closeModal();
		loadCollections();

	} catch (err) {
		alert(err.error || err.message || "Ошибка");
	}
}



async function deleteCollection(id) {
	if (!confirm("Delete this collection?")) return;

	await fetch(`/api/collections/${id}`, { method: "DELETE" });

	loadCollections();
}