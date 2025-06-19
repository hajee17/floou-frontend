<template>
    <div class="space-y-6">
        <h1 class="text-3xl font-bold">Kelola Akun Pengguna</h1>

        <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p class="font-bold">Fitur Belum Tersedia</p>
            <p>Fungsionalitas untuk mengelola akun (tambah, edit, hapus pengguna) belum didukung oleh API backend saat ini. Halaman ini adalah placeholder.</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-green-100 text-green-800 font-semibold">
                        <tr>
                            <th class="p-4">ID Akun</th>
                            <th class="p-4">Nama</th>
                            <th class="p-4">Email</th>
                            <th class="p-4">Role</th>
                            <th class="p-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="p-4 font-medium">1</td>
                            <td class="p-4">Admin Floou</td>
                            <td class="p-4 text-gray-600">admin@floou.com</td>
                            <td class="p-4">
                               <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">Admin</span>
                            </td>
                            <td class="p-4 text-gray-400">
                                Edit / Hapus
                            </td>
                        </tr>
                        <tr>
                            <td class="p-4 font-medium">2</td>
                            <td class="p-4">User Contoh</td>
                            <td class="p-4 text-gray-600">user@example.com</td>
                            <td class="p-4">
                                <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">User</span>
                            </td>
                            <td class="p-4 text-gray-400">
                                Edit / Hapus
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>