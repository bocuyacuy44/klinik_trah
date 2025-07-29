const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Konfigurasi koneksi PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "klinik_db",
  password: "2106044!", // Ganti dengan password Anda
  port: 5432,
});

// Upload image endpoint
app.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    res.json({
      message: "File uploaded successfully",
      imageUrl: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .json({ message: "Failed to upload file", error: error.message });
  }
});

// Upload multiple images endpoint
app.post("/upload-images", upload.array("images", 17), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imageUrls = req.files.map((file) => ({
      url: `http://localhost:3001/uploads/${file.filename}`,
      filename: file.filename,
    }));

    res.json({
      message: "Files uploaded successfully",
      imageUrls: imageUrls,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    res
      .status(500)
      .json({ message: "Failed to upload files", error: error.message });
  }
});

// Get all patients
app.get("/patients", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM patients ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

// Generate rekam medik
app.post("/generate-rekam-medik", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT generate_rekam_medik() as rekam_medik"
    );
    const newRekamMedik = result.rows[0].rekam_medik;
    res.json({ rekamMedik: newRekamMedik });
  } catch (error) {
    console.error("Error generating rekam medik:", error);
    res.status(500).json({
      message: "Failed to generate rekam medik",
      error: error.message,
    });
  }
});

// Create patient
app.post("/patients", async (req, res) => {
  try {
    const patientData = req.body;
    const result = await pool.query(
      `INSERT INTO patients (
        rekam_medik, nama_lengkap, jenis_identitas, nomor_identitas, tempat_lahir,
        tanggal_lahir, jenis_kelamin, golongan_darah, status_perkawinan, nama_suami,
        nama_ibu, pendidikan, pekerjaan, kewarganegaraan, agama, suku, bahasa,
        alamat, rt, rw, provinsi, kabupaten, kecamatan, kelurahan, kode_pos,
        telepon, hubungan_penanggung_jawab, nama_penanggung_jawab, telepon_penanggung_jawab, 
        foto_rontgen, gambar_kolom1, gambar_kolom2, gambar_kolom3, gambar_kolom4, gambar_kolom5,
        gambar_kolom6, gambar_kolom7, gambar_kolom8, gambar_kolom9, gambar_kolom10,
        gambar_kolom11, gambar_kolom12, gambar_kolom13, gambar_kolom14, gambar_kolom15,
        gambar_kolom16, gambar_kolom17, informed_consent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48)
      RETURNING *`,
      [
        patientData.rekam_medik,
        patientData.nama_lengkap,
        patientData.jenis_identitas,
        patientData.nomor_identitas,
        patientData.tempat_lahir,
        patientData.tanggal_lahir,
        patientData.jenis_kelamin,
        patientData.golongan_darah,
        patientData.status_perkawinan,
        patientData.nama_suami,
        patientData.nama_ibu,
        patientData.pendidikan,
        patientData.pekerjaan,
        patientData.kewarganegaraan,
        patientData.agama,
        patientData.suku,
        patientData.bahasa,
        patientData.alamat,
        patientData.rt,
        patientData.rw,
        patientData.provinsi,
        patientData.kabupaten,
        patientData.kecamatan,
        patientData.kelurahan,
        patientData.kode_pos,
        patientData.telepon,
        patientData.hubungan_penanggung_jawab,
        patientData.nama_penanggung_jawab,
        patientData.telepon_penanggung_jawab,
        patientData.foto_rontgen,
        patientData.gambar_kolom1,
        patientData.gambar_kolom2,
        patientData.gambar_kolom3,
        patientData.gambar_kolom4,
        patientData.gambar_kolom5,
        patientData.gambar_kolom6,
        patientData.gambar_kolom7,
        patientData.gambar_kolom8,
        patientData.gambar_kolom9,
        patientData.gambar_kolom10,
        patientData.gambar_kolom11,
        patientData.gambar_kolom12,
        patientData.gambar_kolom13,
        patientData.gambar_kolom14,
        patientData.gambar_kolom15,
        patientData.gambar_kolom16,
        patientData.gambar_kolom17,
        patientData.informed_consent,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating patient:", error);
    res
      .status(500)
      .json({ message: "Failed to create patient", error: error.message });
  }
});

// Get patient by ID
app.get("/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM patients WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch patient", error: error.message });
  }
});

// Update patient
app.patch("/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const patientData = req.body;
    const fields = Object.keys(patientData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");
    const values = Object.values(patientData);
    const result = await pool.query(
      `UPDATE patients SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating patient:", error);
    res
      .status(500)
      .json({ message: "Failed to update patient", error: error.message });
  }
});

// Delete patient
app.delete("/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM patients WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ message: "Patient deleted" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res
      .status(500)
      .json({ message: "Failed to delete patient", error: error.message });
  }
});

// Search patients
app.get("/patients/search", async (req, res) => {
  try {
    const { term } = req.query;
    const result = await pool.query(
      `SELECT * FROM patients WHERE nama_lengkap ILIKE $1 OR rekam_medik ILIKE $1 ORDER BY created_at DESC`,
      [`%${term}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error searching patients:", error);
    res
      .status(500)
      .json({ message: "Failed to search patients", error: error.message });
  }
});

// Create registration
app.post("/registrations", async (req, res) => {
  try {
    const { patient_id, ruangan, dokter, nama_pengantar, telepon_pengantar } =
      req.body;

    // Generate id_pendaftaran and no_antrian using PostgreSQL functions
    const idPendaftaranResult = await pool.query(
      "SELECT generate_id_pendaftaran() as id_pendaftaran"
    );
    const noAntrianResult = await pool.query(
      "SELECT generate_no_antrian() as no_antrian"
    );

    const id_pendaftaran = idPendaftaranResult.rows[0].id_pendaftaran;
    const no_antrian = noAntrianResult.rows[0].no_antrian;

    const result = await pool.query(
      `INSERT INTO registrations (
        id_pendaftaran, no_antrian, tanggal, patient_id, status,
        ruangan, dokter, nama_pengantar, telepon_pengantar
      ) VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        id_pendaftaran,
        no_antrian,
        patient_id,
        "Dalam Antrian",
        ruangan,
        dokter,
        nama_pengantar,
        telepon_pengantar,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating registration:", error);
    res
      .status(500)
      .json({ message: "Failed to create registration", error: error.message });
  }
});

// Get all registrations
app.get("/registrations", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, p.rekam_medik as no_rekam_medik, p.nama_lengkap as pasien
      FROM registrations r
      JOIN patients p ON r.patient_id = p.id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch registrations", error: error.message });
  }
});

// Update registration
app.put("/registrations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, ruangan, dokter, nama_pengantar, telepon_pengantar } =
      req.body;

    const result = await pool.query(
      `UPDATE registrations
       SET patient_id = $1, ruangan = $2, dokter = $3, nama_pengantar = $4, telepon_pengantar = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [patient_id, ruangan, dokter, nama_pengantar, telepon_pengantar, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating registration:", error);
    res
      .status(500)
      .json({ message: "Failed to update registration", error: error.message });
  }
});

// Delete registration
app.delete("/registrations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM registrations WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.json({ message: "Registration deleted" });
  } catch (error) {
    console.error("Error deleting registration:", error);
    res
      .status(500)
      .json({ message: "Failed to delete registration", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
