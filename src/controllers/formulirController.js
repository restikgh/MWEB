const model = require('../models/formulirModel');

// GET ALL
const getAll = async (req, res) => {
  const data = await model.getAll();
  res.status(200).json({
    message: "Berhasil ambil semua data",
    data: data
  });
};

// GET BY ID
const getById = async (req, res) => {
  const data = await model.getById(req.params.id);

  if (!data) {
    return res.status(404).json({
      message: "Data tidak ditemukan"
    });
  }

  res.status(200).json({
    message: "Berhasil ambil data by id",
    data: data
  });
};

// CREATE
const create = async (req, res) => {
  const data = await model.create(req.body);
  res.status(201).json({
    message: "Data berhasil ditambah",
    data: data
  });
};

// UPDATE
const update = async (req, res) => {
  const data = await model.update(req.params.id, req.body);

  if (!data) {
    return res.status(404).json({
      message: "Data tidak ditemukan"
    });
  }

  res.status(200).json({
    message: "Data berhasil diupdate",
    data: data
  });
};

// DELETE
const remove = async (req, res) => {
  const data = await model.remove(req.params.id);

  if (!data) {
    return res.status(404).json({
      message: "Data tidak ditemukan"
    });
  }

  res.status(200).json({
    message: "Data berhasil dihapus",
    data: data
  });
};

module.exports = { getAll, getById, create, update, remove };