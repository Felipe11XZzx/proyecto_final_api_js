const API_URL = "https://soccer-api.com/api/leagues";

const btn = document.querySelector("#btn");
btn.addEventListener("click", peticionAsyncAwait);

async function peticionAsyncAwait() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json", // Asegúrate de que el servidor devuelva JSON
        Authorization:
          "Bearer SEijtIiKO9h5CaMrNiY1cj88h0OFZtLpSxskdk2zwn5aXiuGNDshct33PBGU", // Reemplaza con tu token real
      },
    });

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }

    // Obtener los datos en formato JSON
    const data = await response.json();
    console.log("Datos de la API:", data); // Muestra los datos para verificar la estructura

    mostrarDatos(data); // Llama a la función para mostrar los datos
  } catch (error) {
    console.log(error); // Manejo de errores
  } finally {
    console.log("Proceso finalizado"); // Indicador de que el proceso se ha completado
  }
}

function mostrarDatos(data) {
  const contenedor = document.querySelector("#datos");

  // Verifica la estructura de los datos
  if (!data || !data.leagues) {
    console.error("No se encontraron datos o la estructura es incorrecta");
    return;
  }

  let html = `
    <table class="table table-dark">
      <thead>
        <tr>
          <th scope="col">ID Liga</th>
          <th scope="col">Nombre Liga</th>
          <th scope="col">País</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Itera sobre las ligas
  data.leagues.forEach((leagues) => {
    html += `
      <tr>
        <td>${leagues.id}</td>
        <td>${leagues.name}</td>
        <td>${leagues.country_id}</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  contenedor.innerHTML = html; // Inserta el HTML generado en el contenedor
}
