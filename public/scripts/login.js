const form = document.getElementById("form-login");
const btnRegistro = document.getElementById("btn-registrarse");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const contrasena = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contrasena })
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Inicio de sesión correcto");
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify({ email }));

      // Redirigir a la tienda
      window.location.href = "index.html";
    } else {
      alert("⚠️ " + (data.error || "Error al iniciar sesión"));
    }
  } catch (error) {
    alert("❌ Error de conexión con el servidor");
    console.error(error);
  }
});

btnRegistro.addEventListener("click", async () => {
  const nombre = prompt("Nombre:");
  const apellido = prompt("Apellido:");
  const email = prompt("Correo electrónico:");
  const contrasena = prompt("Contraseña:");

  if (!nombre || !apellido || !email || !contrasena) return;

  const res = await fetch("http://localhost:3000/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, apellido, email, contrasena })
  });

  const data = await res.json();

  if (res.ok) {
    alert("✅ Usuario registrado con éxito. Ahora podés iniciar sesión.");
  } else {
    alert("⚠️ " + (data.error || "No se pudo registrar"));
  }
});
