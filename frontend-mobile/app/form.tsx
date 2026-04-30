import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomDropdown from '../components/CustomDropdown';
import { getFormulirById, createFormulir, updateFormulir, getProvinsi, getKabKota } from '../api/formulirApi';

const AGAMA_OPTIONS = [
  { label: 'Islam', value: 'Islam' },
  { label: 'Kristen', value: 'Kristen' },
  { label: 'Katolik', value: 'Katolik' },
  { label: 'Hindu', value: 'Hindu' },
  { label: 'Buddha', value: 'Buddha' },
  { label: 'Konghucu', value: 'Konghucu' },
];

const JK_OPTIONS = [
  { label: 'Laki-laki', value: 'L' },
  { label: 'Perempuan', value: 'P' },
];

export default function FormScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  
  const [form, setForm] = useState({
    nama: '',
    tempat: '',
    tanggal: new Date(),
    agama: '',
    alamat: '',
    telp: '',
    jk: '',
    provinsi: null,
    kabupaten: null
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [provinsiOptions, setProvinsiOptions] = useState([]);
  const [kabKotaOptions, setKabKotaOptions] = useState([]);

  useEffect(() => {
    fetchProvinsi();
    if (isEdit) {
      loadInitialData();
    }
  }, []);

  const fetchProvinsi = async () => {
    try {
      const res = await getProvinsi();
      const options = res.data.map((p: any) => ({ label: p.nama, value: p.id }));
      setProvinsiOptions(options);
    } catch (e) {
      console.log('Failed to fetch provinsi', e);
    }
  };

  const fetchKabKota = async (idProv: number) => {
    try {
      const res = await getKabKota(idProv);
      const options = res.data.map((k: any) => ({ label: k.nama, value: k.id }));
      setKabKotaOptions(options);
    } catch (e) {
      console.log('Failed to fetch kabkota', e);
    }
  };

  const loadInitialData = async () => {
    try {
      const res = await getFormulirById(id);
      const data = res.data[0] || res.data; // Depending on API response
      
      setForm({
        nama: data.nama || '',
        tempat: data.tempat_lahir || '',
        tanggal: data.tanggal_lahir ? new Date(data.tanggal_lahir) : new Date(),
        agama: data.agama || '',
        alamat: data.alamat || '',
        telp: data.no_telp || '',
        jk: data.jenis_kelamin || '',
        provinsi: data.id_provinsi || null,
        kabupaten: data.id_kab_kota || null
      });

      if (data.id_provinsi) {
        fetchKabKota(data.id_provinsi);
      }
    } catch (e) {
      Alert.alert('Error', 'Gagal memuat data formulir');
    } finally {
      setFetching(false);
    }
  };

  const handleProvinsiChange = (val: number) => {
    setForm({ ...form, provinsi: val, kabupaten: null });
    if (val) {
      fetchKabKota(val);
    } else {
      setKabKotaOptions([]);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setForm({ ...form, tanggal: selectedDate });
    }
  };

  const handleSave = async () => {
    if (!form.nama || !form.jk || !form.provinsi || !form.kabupaten) {
      Alert.alert('Validasi', 'Nama, Jenis Kelamin, Provinsi, dan Kabupaten wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nama: form.nama,
        tempat: form.tempat,
        tanggal: form.tanggal.toISOString(),
        agama: form.agama,
        alamat: form.alamat,
        telp: form.telp,
        jk: form.jk,
        provinsi: form.provinsi,
        kabupaten: form.kabupaten
      };

      if (isEdit) {
        await updateFormulir(id, payload);
        Alert.alert('Sukses', 'Data berhasil diperbarui');
      } else {
        await createFormulir(payload);
        Alert.alert('Sukses', 'Data berhasil ditambahkan');
      }
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{ marginTop: 10 }}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{isEdit ? 'Edit Formulir' : 'Tambah Formulir'}</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nama Lengkap *</Text>
        <TextInput 
          style={styles.input} 
          value={form.nama} 
          onChangeText={(t) => setForm({...form, nama: t})}
          placeholder="Masukkan nama"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
          <Text style={styles.label}>Tempat Lahir</Text>
          <TextInput 
            style={styles.input} 
            value={form.tempat} 
            onChangeText={(t) => setForm({...form, tempat: t})}
            placeholder="Kota lahir"
          />
        </View>
        
        <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
          <Text style={styles.label}>Tanggal Lahir</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {form.tanggal.toLocaleDateString('id-ID')}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={form.tanggal}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>
      </View>

      <CustomDropdown 
        label="Jenis Kelamin *" 
        value={form.jk} 
        options={JK_OPTIONS} 
        onSelect={(val) => setForm({...form, jk: val})} 
      />

      <CustomDropdown 
        label="Agama" 
        value={form.agama} 
        options={AGAMA_OPTIONS} 
        onSelect={(val) => setForm({...form, agama: val})} 
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>No. Telepon</Text>
        <TextInput 
          style={styles.input} 
          value={form.telp} 
          onChangeText={(t) => setForm({...form, telp: t})}
          placeholder="Contoh: 08123456789"
          keyboardType="phone-pad"
        />
      </View>

      <CustomDropdown 
        label="Provinsi *" 
        value={form.provinsi} 
        options={provinsiOptions} 
        onSelect={handleProvinsiChange} 
        placeholder="Pilih Provinsi"
      />

      <CustomDropdown 
        label="Kabupaten / Kota *" 
        value={form.kabupaten} 
        options={kabKotaOptions} 
        onSelect={(val) => setForm({...form, kabupaten: val})} 
        placeholder={form.provinsi ? "Pilih Kab/Kota" : "Pilih Provinsi dulu"}
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Alamat Lengkap</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={form.alamat} 
          onChangeText={(t) => setForm({...form, alamat: t})}
          placeholder="Masukkan alamat domisili"
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Simpan Data</Text>
        )}
      </TouchableOpacity>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#80b3e6',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
