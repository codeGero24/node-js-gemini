const http = require('http'); // Importa il modulo http di Node.js

// Dati utenti simulati (come se venissero da un database)
const users = [
  { id: 1, name: 'Mario Rossi', email: 'mario.rossi@example.com' },
  { id: 2, name: 'Luca Bianchi', email: 'luca.bianchi@example.com' },
  { id: 3, name: 'Anna Verdi', email: 'anna.verdi@example.com' }
];

// Crea il server HTTP
const server = http.createServer((req, res) => {
  // Imposta l'intestazione Content-Type per indicare che stiamo inviando JSON
  res.setHeader('Content-Type', 'application/json');

  // Gestiamo le richieste in base all'URL e al metodo HTTP
  if (req.url === '/users' && req.method === 'GET') {
    // Se la richiesta è GET /users, inviamo l'elenco di tutti gli utenti
    res.statusCode = 200; // OK
    res.end(JSON.stringify(users)); // Invia i dati come stringa JSON
  } else if (req.url.startsWith('/users/') && req.method === 'GET') {
    // Se la richiesta è GET /users/:id, proviamo a recuperare un singolo utente
    const id = parseInt(req.url.split('/')[2]); // Estrae l'ID dall'URL
    const user = users.find(u => u.id === id); // Cerca l'utente per ID

    if (user) {
      res.statusCode = 200; // OK
      res.end(JSON.stringify(user)); // Invia i dati dell'utente trovato
    } else {
      res.statusCode = 404; // Not Found
      res.end(JSON.stringify({ message: 'Utente non trovato' }));
    }
  } else {
    // Per tutte le altre richieste, restituiamo un errore 404
    res.statusCode = 404; // Not Found
    res.end(JSON.stringify({ message: 'Endpoint non trovato' }));
  }
});

const PORT = 3000; // La porta su cui il server ascolterà

server.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
  console.log(`Per recuperare tutti gli utenti: http://localhost:${PORT}/users`);
  console.log(`Per recuperare un utente specifico (es. ID 1): http://localhost:${PORT}/users/1`);
});