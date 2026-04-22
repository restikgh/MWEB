const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// koneksi database
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'kuliah',
    password: '12345678', // sesuaikan
    port: 5433,
});

// ================= GET =================
app.get('/formulir', async (req, res) => {
    const result = await pool.query("SELECT * FROM formulir");
    res.json(result.rows);
});

// ================= POST =================
app.post('/formulir', async (req, res) => {
    const { nama, tempat, tanggal, agama, alamat, telp, jk, provinsi, kabupaten } = req.body;

    await pool.query(`
        INSERT INTO formulir
        (nama, tempat_lahir, tanggal_lahir, agama, alamat, no_telp, jenis_kelamin, id_provinsi, id_kab_kota)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    `, [nama, tempat, tanggal, agama, alamat, telp, jk, provinsi, kabupaten]);

    res.send("Data berhasil ditambah");
});

// ================= PUT =================
app.put('/formulir/:id', async (req, res) => {
    const id = req.params.id;
    const { nama, tempat, tanggal, agama, alamat, telp, jk, provinsi, kabupaten } = req.body;

    await pool.query(`
        UPDATE formulir SET
        nama=$1,
        tempat_lahir=$2,
        tanggal_lahir=$3,
        agama=$4,
        alamat=$5,
        no_telp=$6,
        jenis_kelamin=$7,
        id_provinsi=$8,
        id_kab_kota=$9
        WHERE id=$10
    `, [nama, tempat, tanggal, agama, alamat, telp, jk, provinsi, kabupaten, id]);

    res.send("Data berhasil diupdate");
});

// ================= DELETE =================
app.delete('/formulir/:id', async (req, res) => {
    const id = req.params.id;

    await pool.query("DELETE FROM formulir WHERE id=$1", [id]);

    res.send("Data berhasil dihapus");
});

// jalankan server
app.listen(3000, () => {
    console.log("Server jalan di http://localhost:3000");
});