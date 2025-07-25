import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import RegistrationTable from './RegistrationTable';
import { Registration } from '../../types';
import { registrationService } from '../../services/registrationService';

interface PatientRegistrationProps {
  onNavigateToPatients: () => void;
  onNavigateToNewPatient: () => void;
  onNavigateToSelectPatient: () => void;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ 
  onNavigateToPatients, 
  onNavigateToNewPatient,
  onNavigateToSelectPatient
}) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  // Fungsi untuk mengambil data pendaftaran dari Supabase
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const data = await registrationService.getAllRegistrations();
        setRegistrations(data);
      } catch (error) {
        console.error('Gagal mengambil data pendaftaran:', error);
      }
    };

    fetchRegistrations();
  }, []);

  const handleEdit = (registration: Registration) => {
    console.log('Edit registration:', registration);
  };

  const handleView = (registration: Registration) => {
    console.log('View registration:', registration);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pendaftaran ini?')) {
      try {
        await registrationService.deleteRegistration(id);
        setRegistrations(prev => prev.filter(reg => reg.id !== id));
        // Optional: Tampilkan notifikasi sukses jika ada komponen notifikasi
        console.log('Data berhasil dihapus');
      } catch (error) {
        console.error('Gagal menghapus data:', error);
        // Optional: Tampilkan notifikasi error
        alert('Gagal menghapus data pendaftaran');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Pendaftaran Pasien</h1>
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={onNavigateToSelectPatient}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Pendaftaran Pasien Lama</span>
          </button>
          
          <button
            onClick={onNavigateToNewPatient}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Pendaftaran Pasien Baru</span>
          </button>
        </div>
      </div>

      <RegistrationTable
        registrations={registrations}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default PatientRegistration;