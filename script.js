
async function obtenerDatosRealBetisBalompie() {
  try {
    const response = await fetch(
      "http://localhost:3001/api/team/real-betis-balompie"
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Datos de Real Betis Balompié:", data);
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
    <div class="card mb-4">
      <div class="card-header d-flex align-items-center">
        <img src="${data.crest}" alt="${
    data.name
  } Logo" class="me-3" style="width:60px; height:auto;">
        <h2 class="mb-0">${data.name}</h2>
      </div>
      <div class="card-body">
        <div class="row mb-4">
          <div class="col-md-6">
            <p><i class="bi bi-globe"></i> <strong>País:</strong> ${
              data.area.name
            } (${data.area.code})</p>
            <p><i class="bi bi-house-fill"></i> <strong>Estadio:</strong> ${
              data.stadium
            }</p>
          </div>
        </div>
        
        <h3 class="mb-3"><i class="bi bi-people-fill"></i> Plantilla</h3>
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Posición</th>
              </tr>
            </thead>
            <tbody>
              ${data.squad
                .map(
                  (player, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${player.name}</td>
                  <td><span class="badge bg-primary">${
                    player.position
                  }</span></td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  contenedor.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#btn");
  btn.addEventListener("click", obtenerDatosRealBetisBalompie);
});
