const express = require('express'); // Importa il modulo Express.js
const app = express(); // Crea un'istanza dell'applicazione Express
const PORT = 3000;

// Dati utenti simulati
const users = [
  { id: 1, name: 'Mario Rossi', email: 'mario.rossi@example.com' },
  { id: 2, name: 'Luca Bianchi', email: 'luca.bianchi@example.com' },
  { id: 3, name: 'Anna Verdi', email: 'anna.verdi@example.com' }
];

// Middleware: per parseare il corpo delle richieste JSON
app.use(express.json());

// Rotta GET per recuperare tutti gli utenti
app.get('/users', (req, res) => {
  res.json(users); // Metodo .json() invia automaticamente JSON e imposta Content-Type
});

// Rotta GET per recuperare un singolo utente per ID
// :id è un parametro dinamico nell'URL
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id); // req.params.id cattura il valore di :id
  const user = users.find(u => u.id === id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'Utente non trovato' }); // Imposta lo stato e invia JSON
  }
});

// Rotta POST per creare un nuovo utente
app.post('/users', (req, res) => {
  const newUser = req.body; // I dati inviati nel corpo della richiesta sono in req.body
  if (!newUser.name || !newUser.email) {
    return res.status(400).json({ message: 'Nome ed email sono obbligatori' });
  }
  newUser.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1; // Assegna un ID
  users.push(newUser);
  res.status(201).json(newUser); // 201 Created: Utente creato con successo
});

// Rotta PUT per aggiornare un utente esistente
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    let userFound = false;
    users.forEach((user, index) => {
        if (user.id === id) {
            users[index] = { ...user, ...updatedData, id: id }; // Aggiorna i campi, mantenendo l'ID originale
            userFound = true;
            return res.json(users[index]);
        }
    });
    if (!userFound) {
        res.status(404).json({ message: 'Utente non trovato' });
    }
});

// Rotta PATCH per aggiornare parzialmente un utente esistente
app.patch('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updates = req.body; // Questo conterrà solo i campi da aggiornare

    let userFound = false;
    users.forEach((user, index) => {
        if (user.id === id) {
            // Applica gli aggiornamenti solo ai campi forniti
            // Object.assign è utile per unire oggetti, o lo spread operator
            users[index] = { ...user, ...updates, id: id }; // Assicurati che l'ID non cambi
            userFound = true;
            return res.json(users[index]); // Invia l'utente aggiornato
        }
    });

    if (!userFound) {
        res.status(404).json({ message: 'Utente non trovato' });
    }
});

// Rotta DELETE per eliminare un utente
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = users.length;
    // Filtra l'array, rimuovendo l'utente con l'ID specificato
    // Nota: in un'applicazione reale, aggiorneresti il database
    users = users.filter(user => user.id !== id);
    if (users.length < initialLength) {
        res.status(204).send(); // 204 No Content: L'operazione è andata a buon fine, nessuna risposta da inviare
    } else {
        res.status(404).json({ message: 'Utente non trovato' });
    }
});


// Avvia il server
app.listen(PORT, () => {
  console.log(`Server Express in ascolto su http://localhost:${PORT}`);
  console.log(`GET /users`);
  console.log(`GET /users/:id`);
  console.log(`POST /users (con { name: '...', email: '...' } nel body JSON)`);
  console.log(`PUT /users/:id (con { name: '...', email: '...' } nel body JSON)`);
  console.log(`PATCH /users/:id (con { name: '...', email: '...' } nel body JSON)`);
  console.log(`DELETE /users/:id`);
});