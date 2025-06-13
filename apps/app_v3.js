const express = require("express");
const mongoose = require("mongoose"); // Importa Mongoose
const app = express();
const PORT = 3000;

// --- Connessione a MongoDB ---
const DB_URI = "mongodb://localhost:27017/database-test"; // URI di connessione
// 'database-test' sarà il nome del tuo database. Se non esiste, MongoDB lo creerà.

mongoose
  .connect(DB_URI)
  .then(() => console.log("Connesso a MongoDB!"))
  .catch((err) => console.error("Errore di connessione a MongoDB:", err));
// ------------------------------------------

// --- Middleware per parseare il corpo delle richieste JSON ---
app.use(express.json());

// --- Definizione dello Schema Utente ---
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Il nome è obbligatorio
    },
    email: {
      type: String,
      required: true,
      unique: true, // L'email deve essere unica
    },
    // Puoi aggiungere altri campi qui (es. age: Number, createdAt: Date)
  },
  { timestamps: true }
); // Aggiunge automaticamente createdAt e updatedAt

const User = mongoose.model("User", userSchema); // Crea il modello 'User' basato sullo schema
// 'User' sarà il nome della collection nel database (MongoDB la chiamerà 'users' automaticamente al plurale)
// ----------------------------------------------------

// ... (Mantieni qui le tue rotte Express esistenti per ora)

// Rotta GET per recuperare tutti gli utenti
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Trova tutti i documenti nella collection 'users'
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message }); // Gestione errori server
  }
});

// Rotta GET per recuperare un singolo utente per ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Cerca un documento per il suo ID unico di MongoDB (_id)
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Utente non trovato" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rotta POST per creare un nuovo utente
app.post("/users", async (req, res) => {
  const newUser = new User({
    // Crea una nuova istanza del modello User
    name: req.body.name,
    email: req.body.email,
  });

  try {
    const savedUser = await newUser.save(); // Salva il nuovo utente nel database
    res.status(201).json(savedUser); // 201 Created
  } catch (error) {
    if (error.code === 11000) {
      // Codice errore per duplicato (es. email unica)
      return res.status(409).json({ message: "L'email fornita esiste già." });
    }
    res.status(400).json({ message: error.message }); // 400 Bad Request per errori di validazione
  }
});

// Rotta PUT per aggiornare un utente esistente (sostituzione completa)
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // {new: true} restituisce il documento aggiornato, {runValidators: true} esegue i validatori dello schema
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "Utente non trovato" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rotta PATCH per aggiornare parzialmente un utente esistente
app.patch("/users/:id", async (req, res) => {
  try {
    // FindByIdAndUpdate con { new: true, runValidators: true } può gestire anche PATCH
    // Mongoose automaticamente applicherà solo i campi che sono presenti in req.body
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body, // Invia solo i campi da aggiornare
      { new: true, runValidators: true } // Restituisce il documento aggiornato e valida i campi
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "Utente non trovato" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rotta DELETE per eliminare un utente
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.status(204).send(); // 204 No Content
    } else {
      res.status(404).json({ message: "Utente non trovato" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------------------------------------------

app.listen(PORT, () => {
  console.log(`Server Mongo in ascolto su http://localhost:${PORT}`);
});
