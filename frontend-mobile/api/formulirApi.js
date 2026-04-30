import axios from 'axios';

// GANTI IP sesuai laptop kamu!
export const API_URL = 'http://192.168.137.1:3000/formulir';

export const getFormulir = () => axios.get(API_URL);

export const getFormulirById = (id) =>
  axios.get(`${API_URL}/${id}`);

export const createFormulir = (data) =>
  axios.post(API_URL, data);

export const updateFormulir = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);

export const deleteFormulir = (id) =>
  axios.delete(`${API_URL}/${id}`);

export const getProvinsi = () => {
  const baseUrl = API_URL.replace('/formulir', '');
  return axios.get(`${baseUrl}/provinsi`);
};

export const getKabKota = (id_provinsi) => {
  const baseUrl = API_URL.replace('/formulir', '');
  return axios.get(`${baseUrl}/kab_kota/${id_provinsi}`);
};