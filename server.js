const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(cors());

app.get('/pengguna', (req, res) => {
  db.query('SELECT * FROM pengguna', (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Error fetching users');
    } else {
      res.json(results); // Mengirimkan hasil query sebagai JSON
    }
  });
});

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Contoh endpoint GET
app.get('/', (req, res) => {
  res.send('hELLO word!');
});

// Contoh endpoint POST
app.post('/data', (req, res) => {
  const data = req.body;
  res.send({
    message: 'Data berhasil diterima',
    data: data,
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

// KONEKSI DATABASE
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kelola_pengguna',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected!');
  }
});

// CONTOH
app.get('/pengguna', (req, res) => {
  db.query('SELECT * FROM pengguna', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Endpoint DELETE untuk menghapus data pengguna berdasarkan ID
app.delete('/pengguna/:id', (req, res) => {
  const { id } = req.params; // Ambil ID dari URL parameter

  // Query untuk menghapus pengguna berdasarkan id_user
  db.query('DELETE FROM pengguna WHERE id_user = ?', [id], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ message: 'Gagal menghapus data' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    } else {
      res.status(200).json({ message: 'Data berhasil dihapus' });
    }
  });
});

// Endpoint untuk mengedit data pengguna
app.put('/pengguna/:id', (req, res) => {
  const id = req.params.id;
  const { nama, alamat, email, jumlah_kandang, no_telp } = req.body; // Ambil data yang dikirim dari frontend

  // SQL query untuk memperbarui data berdasarkan ID
  const query = 'UPDATE pengguna SET nama = ?, alamat = ?, email = ?, jumlah_kandang = ?, no_telp = ?  WHERE id_user = ?';

  db.query(query, [nama, alamat, email, jumlah_kandang, no_telp, id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Error updating user data');
    } else {
      res.send({ message: 'Data berhasil diperbarui' });
    }
  });
});

// Endpoint untuk mendapatkan data pengguna berdasarkan ID
app.get('/pengguna/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM pengguna WHERE id_user = ?', [id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Error fetching user data');
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).send('User not found');
      }
    }
  });
});

// Endpoint untuk menambah pengguna baru
app.post('/pengguna', (req, res) => {
  const { nama, alamat, email, jumlah_kandang, no_telp } = req.body;

  // Query untuk menambah pengguna ke database
  const query = 'INSERT INTO pengguna (nama, alamat, email, jumlah_kandang, no_telp) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [nama, alamat, email, jumlah_kandang, no_telp], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Error adding user');
    } else {
      res.status(200).send({ message: 'User added successfully', userId: results.insertId });
    }
  });
});
