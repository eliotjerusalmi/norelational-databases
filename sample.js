
const { MongoClient } = require("mongodb");

const URI = "mongodb://localhost:27017";
const client = new MongoClient(URI);

async function main() {
  await client.connect();

  const books = client.db("book_db").collection("books");

  // Start fresh on every run
  await books.deleteMany({});

  // TODO 1 - insertOne with an embedded object
  await books.insertOne({
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupery",
    publisher: {
      name: "Gallimard",
      country: "France"
    }
  });

  // TODO 2 - insertOne with an array
  await books.insertOne({
    title: "Dune",
    author: "Frank Herbert",
    tags: ["science fiction", "adventure", "classic"]
  });

  // TODO 3 - insertMany
  await books.insertMany([
    {
      title: "Les Miserables",
      author: "Victor Hugo",
      publisher: {
        name: "Gallimard",
        country: "France"
      },
      tags: ["classic", "fiction"]
    },
    {
      title: "1984",
      author: "George Orwell",
      publisher: {
        name: "Secker & Warburg",
        country: "UK"
      }
    },
    {
      title: "Harry Potter",
      author: "J.K. Rowling",
      tags: ["fantasy", "magic", "adventure"]
    },
    {
      title: "L'Etranger",
      author: "Albert Camus",
      publisher: {
        name: "Gallimard",
        country: "France"
      }
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien"
    }
  ]);

  // TODO 4 - find all documents
  const allBooks = await books.find().toArray();

  console.log("All books:");
  allBooks.forEach(book => {
    console.log(book.title);
  });

  // TODO 5 - findOne with dot notation
  const frenchBook = await books.findOne({
    "publisher.country": "France"
  });

  console.log("First French book:");
  if (frenchBook) {
    console.log(frenchBook.title);
  }

  // TODO 6 - find with a filter
  const frenchBooks = await books.find({
    "publisher.country": "France"
  }).toArray();

  console.log("Number of French books:", frenchBooks.length);

  frenchBooks.forEach(book => {
    console.log(book.title);
  });

  // TODO 7 - find with $exists
  const taggedBooks = await books.find({
    tags: { $exists: true }
  }).toArray();

  console.log("Books with tags:");
  taggedBooks.forEach(book => {
    console.log(book.title, book.tags);
  });

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});