<template>
  <div class="space-y-6 px-4 sm:px-8 lg:px-16 py-10 bg-[#F9F5F2] min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800">Kelola Akun Pengguna</h1>

    <!-- Alert -->
    <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
      <p class="font-bold">Fitur Belum Tersedia</p>
      <p>
        Fungsionalitas untuk mengelola akun (tambah, edit, hapus pengguna) belum didukung oleh API
        backend saat ini. Halaman ini adalah placeholder.
      </p>
    </div>

    <!-- Tabel Akun -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-800">
          <thead class="bg-green-100 text-green-900 font-semibold">
            <tr>
              <th class="p-4">ID Akun</th>
              <th class="p-4">Nama</th>
              <th class="p-4">Email</th>
              <th class="p-4">Role</th>
              <th class="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b hover:bg-gray-50 transition">
              <td class="p-4 font-semibold text-gray-900">1</td>
              <td class="p-4 text-gray-800">Admin Floou</td>
              <td class="p-4 text-gray-700">admin@floou.com</td>
              <td class="p-4">
                <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  Admin
                </span>
              </td>
              <td class="p-4 text-gray-500 italic">Edit / Hapus</td>
            </tr>
            <tr class="border-b hover:bg-gray-50 transition">
              <td class="p-4 font-semibold text-gray-900">2</td>
              <td class="p-4 text-gray-800">User Contoh</td>
              <td class="p-4 text-gray-700">user@example.com</td>
              <td class="p-4">
                <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                  User
                </span>
              </td>
              <td class="p-4 text-gray-500 italic">Edit / Hapus</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// Belum ada logic karena masih placeholder
</script>
