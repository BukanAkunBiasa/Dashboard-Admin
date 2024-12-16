const mysql = require('mysql2');

// Konfigurasi koneksi ke database
const db = mysql.createConnection({
    host: 'localhost', // Host database
    user: 'root',      // Username MySQL
    password: '',      // Password MySQL
    database: 'kelola_pengguna' // Nama database
});

// Cek koneksi
db.connect((err) => {
    if (err) {
        console.error('Koneksi ke database gagal:', err.message);
    } else {
        console.log('Terhubung ke database MySQL!');
    }
});

module.exports = db;
