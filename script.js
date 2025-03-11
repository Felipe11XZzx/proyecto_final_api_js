async function obtenerDatosAstonVilla() {
  try {
    const response = await fetch("http://localhost:3001/api/team/aston-villa");

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Datos de Aston Villa:", data);
    mostrarDatos(data);
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
}

function mostrarDatos(data) {
  const contenedor = document.querySelector("#datos");

  if (!data || !data.name || !data.squad) {
    console.error("Datos incompletos o incorrectos.");
    return;
  }

  let html = `
    <h2>${data.name}</h2>
    <p><strong>País:</strong> ${data.area.name} (${data.area.code})</p>
    <p><strong>Estadio:</strong> ${data.stadium}</p>
    <h3>Jugadores:</h3>
    <ul>
      ${data.squad
        .map((player) => `<li>${player.name} - ${player.position}</li>`)
        .join("")}
    </ul>
    <img src="${data.crest}" alt="${
    data.name
  } Logo" style="width:100px; height:auto;">
  `;

  contenedor.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#btn");
  btn.addEventListener("click", obtenerDatosAstonVilla);
});
