// --- Definizione dello Schema Utente ---
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "Il nome non può superare i 50 caratteri"],
      minlength: [3, "Il nome deve avere almeno 3 caratteri"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Inserisci un'email valida"],
      unique: true,
    },
    // - Altri campi HERE!!!
  },
  { timestamps: true }
);

// Mongo Aggiunge automaticamente createdAt e updatedAt

module.exports = mongoose.model("User", userSchema);
