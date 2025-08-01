export interface Patient {
  id: string;
  rekamMedik: string;
  namaLengkap: string;
  jenisIdentitas: string;
  nomorIdentitas: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  golonganDarah: string;
  statusPerkawinan: string;
  namaSuami?: string;
  namaIbu: string;
  pendidikan: string;
  pekerjaan: string;
  kewarganegaraan: string;
  agama: string;
  suku: string;
  bahasa: string;
  alamat: string;
  rt: string;
  rw: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  kodePos: string;
  telepon: string;
  hubunganPenanggungJawab: string;
  namaPenanggungJawab: string;
  teleponPenanggungJawab: string;
  fotoRontgen?: string;
  gambarKolom1?: string;
  gambarKolom2?: string;
  gambarKolom3?: string;
  gambarKolom4?: string;
  gambarKolom5?: string;
  gambarKolom6?: string;
  gambarKolom7?: string;
  gambarKolom8?: string;
  gambarKolom9?: string;
  gambarKolom10?: string;
  gambarKolom11?: string;
  gambarKolom12?: string;
  gambarKolom13?: string;
  gambarKolom14?: string;
  gambarKolom15?: string;
  gambarKolom16?: string;
  gambarKolom17?: string;
  informedConsent?: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  idPendaftaran: string;
  noAntrian: number;
  tanggal: string;
  patientId: string;
  status: string;
  ruangan?: string;
  dokter?: string;
  namaPengantar?: string;
  teleponPengantar?: string;
  noRekamMedik?: string;
  pasien?: string;
  
}

export interface User {
  id: string;
  username: string;
  role: "administrasi" | "dokter";
  name: string;
}
