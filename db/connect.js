// --- Connessione a MongoDB ---
const mongoose = require("mongoose"); // Importa Mongoose

const DB_LOCAL = "mongodb://localhost:27017/nodejs-gemini"; // URI di connessione
// 'nodejs-gemini' sarà il nome del tuo database. Se non esiste, MongoDB lo creerà.
const connectDB = (url) => {
  const uri = url || DB_URI; // Usa l'URL passato o il default
  return mongoose
    .connect(url)
    .then(() => console.log("Connesso a MongoDB!"))
    .then(() => console.log("URI:", uri))
    .catch((err) =>
      console.error(`Errore di connessione a MongoDB (${uri}):`, err)
    );
};

module.exports = connectDB;
