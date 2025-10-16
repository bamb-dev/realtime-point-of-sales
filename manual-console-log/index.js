const user = {
  name: "Aisyah",
  email: "aisyah@example.com",
  role: "admin",
};

function login(user) {
  // Biasanya di sini kita ngecek data user
  if (!user) {
    console.error("User tidak ditemukan");
    return;
  }

  // Misalnya kita mau debug isi user
  // Biasanya kita tulis manual:
  // console.log("user:", user);

  // Tapi dengan Turbo Console Log, kita cukup blok kata 'user'
  // lalu tekan: Ctrl + Alt + L
  // Maka otomatis muncul:
  // console.log("user 👉", user);

  const message = `Selamat datang, ${user.name}!`;
  return message;
}

const result = login(user);
console.log(result);
