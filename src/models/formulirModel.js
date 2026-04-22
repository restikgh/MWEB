const pool = require('../config/db');

const getAll = async () => {
  const result = await pool.query('SELECT * FROM formulir ORDER BY id ASC');
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM formulir WHERE id=$1', [id]);
  return result.rows[0];
};

const create = async (data) => {
  const { nama, tempat, tanggal, agama, alamat, telp, jk, provinsi, kabupaten } = data;

  const result = await pool.query(`
    INSERT INTO formulir
    (nama, tempat_lahir, tanggal_lahir, agama, alamat, no_telp, jenis_kelamin, id_provinsi, id_kab_kota)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
  `, [nama, tempat, tanggal, agama, alamat, telp, jk, provinsi, kabupaten]);

  return result.rows[0];
};

const update = async (id, data) => {
  const { nama, tempat, tanggal, agama, alamat, telp, jk, provinsi, kabupaten } = data;

  const result = await pool.query(`
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
    RETURNING *
  `, [nama, tempat, tanggal, agama, alamat, telp, jk, provinsi, kabupaten, id]);

  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query(
    'DELETE FROM formulir WHERE id=$1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

module.exports = { getAll, getById, create, update, remove };