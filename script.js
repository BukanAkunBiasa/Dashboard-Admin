// Ambil data pengguna dari API dan tampilkan di tabel
function fetchData() {
    fetch('http://localhost:3000/pengguna')
        .then(response => response.json())
        .then(data => {
            console.log('Data diterima:', data);
            const tbody = document.querySelector('#userTable tbody');
            tbody.innerHTML = ''; // Hapus isi tabel sebelum menambahkan data baru

            if (data && data.length > 0) {
                data.forEach(pengguna => {
                    const tr = createUserRow(pengguna);
                    tbody.appendChild(tr);
                });

                addEventListeners();
            } else {
                console.log('Data pengguna kosong atau tidak valid.');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Membuat elemen baris pengguna untuk tabel
function createUserRow(pengguna) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', pengguna.id_user);
    tr.innerHTML = `
        <td>${pengguna.nama}</td>
        <td>${pengguna.id_user}</td>
        <td>${pengguna.alamat}</td>
        <td>${pengguna.jumlah_kandang}</td>
        <td>${pengguna.email}</td>
        <td>${pengguna.no_telp}</td>
        <td>${pengguna.password}</td>
        <td>${pengguna.status}</td>
        <td class="action-icons">
            <i class="fas fa-edit edit" data-id="${pengguna.id_user}"></i>
            <i class="fas fa-trash delete" data-id="${pengguna.id_user}"></i>
        </td>
    `;
    return tr;
}

// Menambahkan event listener untuk tombol Edit dan Delete
function addEventListeners() {
    // Menambahkan event listener untuk tombol Edit
    document.querySelectorAll('.edit').forEach(editBtn => {
        editBtn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            editData(id);
        });
    });

    // Menambahkan event listener untuk tombol Delete
    document.querySelectorAll('.delete').forEach(deleteBtn => {
        deleteBtn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            deleteData(id);
        });
    });
}

// Fungsi untuk menangani edit data
function editData(id) {
    fetch(`http://localhost:3000/pengguna/${id}`)
        .then(response => response.json())
        .then(data => {

            const nama = prompt('Edit Nama:', data.nama);
            const alamat = prompt('Edit Alamat:', data.alamat);
            const email = prompt('Edit Email:', data.email);
            const jumlah_kandang = prompt('Edit Jumlah Kandang:', data.jumlah_kandang);
            const no_telp = prompt('Edit No Telp:', data.no_telp);

            if (nama && alamat && email && jumlah_kandang && no_telp) {
                updateData(id, { nama, alamat, email, jumlah_kandang, no_telp });
            } else {
                alert('Data tidak lengkap, pembaruan dibatalkan.');
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            alert('Terjadi kesalahan saat mengambil data pengguna.');
        });
}

// Fungsi untuk mengupdate data setelah diedit
function updateData(id, updatedData) {
    fetch(`http://localhost:3000/pengguna/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(() => {
        alert('Data berhasil diperbarui!');
        fetchData(); // Reload data pengguna
    })
    .catch(error => console.error('Error updating data:', error));
}

// Fungsi untuk menangani delete data
function deleteData(id) {
    console.log('Menghapus data dengan ID:', id); // Debug log
    const confirmDelete = confirm('Apakah Anda yakin ingin menghapus data ini?');
    if (confirmDelete) {
        fetch(`http://localhost:3000/pengguna/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    alert('Data berhasil dihapus!');
                    document.querySelector(`tr[data-id='${id}']`).remove(); // Hapus baris dari DOM
                    fetchData(); // Reload data pengguna setelah penghapusan
                } else {
                    alert('Gagal menghapus data!');
                }
            })
            .catch(error => {
                console.error('Error deleting data:', error);
                alert('Terjadi kesalahan saat menghapus data!');
            });
    }
}

// add User
document.addEventListener('DOMContentLoaded', () => {
    // Menampilkan form tambah pengguna saat tombol tambah diklik
    document.querySelector('#addUserBtn').addEventListener('click', () => {
        console.log('Tombol Tambah Diklik!');
        document.querySelector('.add-user-form').style.display = 'block';
    });

    // Menutup form tambah pengguna saat tombol batal diklik
    document.querySelector('#closeFormBtn').addEventListener('click', () => {
        document.querySelector('.add-user-form').style.display = 'none';
    });

    // Menangani pengiriman form tambah pengguna
    document.querySelector('#addUserForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const nama = document.querySelector('#nama').value;
        const alamat = document.querySelector('#alamat').value;
        const email = document.querySelector('#email').value;
        const jumlah_kandang = document.querySelector('#jumlah_kandang').value;
        const no_telp = document.querySelector('#no_telp').value;

        const newUser = {
            nama,
            alamat,
            email,
            jumlah_kandang,
            no_telp
        };

        addUser(newUser);  // Mengirim data pengguna baru
    });

    // Fungsi untuk menambahkan pengguna
    function addUser(newUser) {
        fetch('http://localhost:3000/pengguna', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
        .then(response => response.json())
        .then(() => {
            alert('Pengguna berhasil ditambahkan!');
            fetchData();  // Reload data pengguna
            document.querySelector('.add-user-form').style.display = 'none';  // Sembunyikan form
        })
        .catch(error => {
            console.error('Error adding user:', error);
            alert('Gagal menambahkan pengguna.');
        });
    }

    // Fitur pencarian pengguna
    document.querySelector('#search-bar').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterUsers(searchTerm);
    });

    // Menampilkan data pengguna
    function fetchData() {
        fetch('http://localhost:3000/pengguna')
            .then(response => response.json())
            .then(users => {
                renderUserTable(users);
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    // Menyaring dan menampilkan pengguna berdasarkan pencarian
    function filterUsers(searchTerm) {
        const rows = document.querySelectorAll('#userTable tr');
        rows.forEach(row => {
            const cells = row.getElementsByTagName('td');
            if (cells.length > 0) {
                const userData = Array.from(cells).map(cell => cell.textContent.toLowerCase());
                const match = userData.some(text => text.includes(searchTerm));
                row.style.display = match ? '' : 'none';
            }
        });
    }

    // Render data pengguna ke dalam tabel
    function renderUserTable(users) {
        const table = document.querySelector('#userTable');
        table.innerHTML = '';  // Clear tabel sebelum merender ulang
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.nama}</td>
                <td>${user.alamat}</td>
                <td>${user.email}</td>
                <td>${user.jumlah_kandang}</td>
                <td>${user.no_telp}</td>
            `;
            table.appendChild(row);
        });
    }

    // Ambil data pengguna saat pertama kali halaman dimuat
    fetchData();
});


// Panggil fetchData untuk memuat data saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchData);


// Fungsi untuk menampilkan form edit dengan data pengguna
function editData(id) {
    fetch(`http://localhost:3000/pengguna/${id}`)
        .then(response => response.json())
        .then(data => {
            // Mengisi data pada form edit
            document.querySelector('#editNama').value = data.nama;
            document.querySelector('#editAlamat').value = data.alamat;
            document.querySelector('#editEmail').value = data.email;
            document.querySelector('#editJumlahKandang').value = data.jumlah_kandang;
            document.querySelector('#editNoTelp').value = data.no_telp;

            // Menampilkan form edit
            document.querySelector('#editUserForm').style.display = 'block';

            // Event listener untuk tombol simpan
            document.querySelector('#saveEditBtn').addEventListener('click', () => {
                const updatedData = {
                    nama: document.querySelector('#editNama').value,
                    alamat: document.querySelector('#editAlamat').value,
                    email: document.querySelector('#editEmail').value,
                    jumlah_kandang: document.querySelector('#editJumlahKandang').value,
                    no_telp: document.querySelector('#editNoTelp').value
                };
                updateData(id, updatedData);
            });

            // Event listener untuk tombol batal
            document.querySelector('#cancelEditBtn').addEventListener('click', () => {
                document.querySelector('#editUserForm').style.display = 'none';
            });
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            alert('Terjadi kesalahan saat mengambil data pengguna.');
        });
}

// Fungsi untuk mengupdate data setelah diedit
function updateData(id, updatedData) {
    fetch(`http://localhost:3000/pengguna/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(() => {
        alert('Data berhasil diperbarui!');
        fetchData(); // Reload data pengguna
        document.querySelector('#editUserForm').style.display = 'none';  // Sembunyikan form edit
    })
    .catch(error => console.error('Error updating data:', error));
}

// Fungsi untuk menampilkan form delete dengan konfirmasi
function deleteData(id) {
    // Menampilkan form delete
    document.querySelector('#deleteUserForm').style.display = 'block';

    // Event listener untuk tombol hapus
    document.querySelector('#confirmDeleteBtn').addEventListener('click', () => {
        fetch(`http://localhost:3000/pengguna/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    alert('Data berhasil dihapus!');
                    document.querySelector(`tr[data-id='${id}']`).remove(); // Hapus baris dari DOM
                    fetchData(); // Reload data pengguna setelah penghapusan
                    document.querySelector('#deleteUserForm').style.display = 'none';  // Sembunyikan form delete
                } else {
                    alert('Gagal menghapus data!');
                }
            })
            .catch(error => {
                console.error('Error deleting data:', error);
                alert('Terjadi kesalahan saat menghapus data!');
                document.querySelector('#deleteUserForm').style.display = 'none';  // Sembunyikan form delete
            });
    });

    // Event listener untuk tombol batal
    document.querySelector('#cancelDeleteBtn').addEventListener('click', () => {
        document.querySelector('#deleteUserForm').style.display = 'none';  // Sembunyikan form delete
    });
}

// Menambahkan event listener untuk tombol Edit dan Delete setelah data dimuat
function addEventListeners() {
    document.querySelectorAll('.edit').forEach(editBtn => {
        editBtn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            editData(id);  // Menampilkan form edit
        });
    });

    document.querySelectorAll('.delete').forEach(deleteBtn => {
        deleteBtn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            deleteData(id);  // Menampilkan form delete
        });
    });
}

// Menambahkan event listener untuk menutup form edit dan delete saat klik tombol batal
document.querySelector('#cancelEditBtn').addEventListener('click', () => {
    document.querySelector('#editUserForm').style.display = 'none';  // Sembunyikan form edit
});
document.querySelector('#cancelDeleteBtn').addEventListener('click', () => {
    document.querySelector('#deleteUserForm').style.display = 'none';  // Sembunyikan form delete
});


// perbarui data
