// Función para obtener datos del equipo
async function obtenerDatosRealMadrid() {
  try {
    const response = await fetch("http://localhost:3001/api/team/real-madrid");

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Datos de Real Madrid:", data);
    mostrarDatos(data);
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
    mostrarError("No se pudieron cargar los datos del equipo. Inténtalo de nuevo más tarde.");
  }
}

function mostrarDatos(data) {
  const contenedor = document.querySelector("#datos");

  if (!data || !data.name || !data.squad) {
    console.error("Datos incompletos o incorrectos.");
    return;
  }

  // Función para determinar el color del badge según la posición
  function getBadgeColorByPosition(position) {
    // Posiciones de portero
    if (position === 'Goalkeeper') {
      return 'bg-warning text-dark'; // Amarillo
    }
    
    // Posiciones defensivas
    if (['Defence', 'Left-Back', 'Right-Back', 'Centre-Back', 'Defender'].some(pos => position.includes(pos))) {
      return 'bg-danger'; // Rojo
    }
    
    // Posiciones de mediocampo
    if (['Midfield', 'Defensive Midfield', 'Central Midfield', 'Attacking Midfield'].some(pos => position.includes(pos))) {
      return 'bg-success'; // Verde
    }
    
    // Posiciones ofensivas
    if (['Offence', 'Forward', 'Winger', 'Centre-Forward', 'Striker', 'Left Winger', 'Right Winger'].some(pos => position.includes(pos))) {
      return 'bg-primary'; // Azul
    }
    
    // Posición desconocida
    return 'bg-secondary'; // Gris
  }

  // Función para determinar el color del badge según la competición
  function getBadgeColorByCompetition(competitionName) {
    // UEFA Champions League
    if (competitionName.includes('UEFA Champions League')) {
      return 'bg-info text-white'; // Azul claro
    }
    
    // Primera Division
    if (competitionName.includes('Primera Division')) {
      return 'bg-danger text-white'; // Rojo
    }
    
    // FIFA Club World Cup
    if (competitionName.includes('FIFA Club World Cup')) {
      return 'bg-warning text-dark'; // Amarillo
    }
    
    // Otras competiciones
    return 'bg-secondary text-white'; // Gris
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
            } 
<img src="${data.area.flag || 'default-flag-url'}" alt="${data.area.name} Flag" class="me-3" style="width:60px; height:auto;">
            (${data.area.code})</p>
            <p><i class="bi bi-house-fill"></i> <strong>Estadio:</strong> ${
              data.venue
            }</p>
          </div>
        </div>
        
        <h3 class="mb-3"><i class="bi bi-people-fill"></i> Plantilla</h3>
        <div class="table-responsive">
          <table class="table table-hover text-center">
            <thead class="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Posición</th>
              </tr>
            </thead>
            <tbody>
              ${data.squad
                // Ordenar jugadores por posición
                .sort((a, b) => {
                  // Orden de posiciones: Porteros, Defensas, Mediocampistas, Delanteros
                  const posOrder = {
                    'Goalkeeper': 1,
                    'Defence': 2, 'Left-Back': 2, 'Right-Back': 2, 'Centre-Back': 2,
                    'Midfield': 3, 'Defensive Midfield': 3, 'Central Midfield': 3, 'Attacking Midfield': 3,
                    'Offence': 4, 'Forward': 4, 'Winger': 4, 'Centre-Forward': 4, 'Left Winger': 4, 'Right Winger': 4
                  };
                  
                  // Determinar orden de posición
                  const posA = Object.keys(posOrder).find(pos => a.position.includes(pos)) || '';
                  const posB = Object.keys(posOrder).find(pos => b.position.includes(pos)) || '';
                  
                  const orderA = posOrder[posA] || 5;
                  const orderB = posOrder[posB] || 5;
                  
                  // Si son de la misma categoría, ordenar por nombre
                  if (orderA === orderB) {
                    return a.name.localeCompare(b.name);
                  }
                  
                  return orderA - orderB;
                })                .map(
                  (player, index) => `
                <tr>
                  <td class="text-center"><strong>${index + 1}</strong></td>
                  <td>${player.name}</td>
                  <td><span class="badge ${getBadgeColorByPosition(player.position)}">${player.position}</span></td>
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

// Función para mostrar próximos partidos
async function obtenerProximosPartidos() {
  try {
    const response = await fetch("http://localhost:3001/api/team/real-madrid/matches?status=SCHEDULED&limit=5");

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Próximos partidos:", data);
    mostrarPartidos(data, "próximos");
  } catch (error) {
    console.error("Error al obtener próximos partidos:", error);
    mostrarError("No se pudieron cargar los próximos partidos. Inténtalo de nuevo más tarde.");
  }
}

// Función para mostrar últimos resultados
async function obtenerUltimosResultados() {
  try {
    const response = await fetch("http://localhost:3001/api/team/real-madrid/matches?status=FINISHED&limit=5");

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Últimos resultados:", data);
    mostrarPartidos(data, "últimos");
  } catch (error) {
    console.error("Error al obtener últimos resultados:", error);
    mostrarError("No se pudieron cargar los últimos resultados. Inténtalo de nuevo más tarde.");
  }
}

// Función para mostrar competiciones
async function obtenerCompeticiones() {
  try {
    const response = await fetch("http://localhost:3001/api/team/real-madrid/competitions");

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Competiciones:", data);
    mostrarCompeticiones(data);
  } catch (error) {
    console.error("Error al obtener competiciones:", error);
    mostrarError("No se pudieron cargar las competiciones. Inténtalo de nuevo más tarde.");
  }
}

// Función para mostrar competición específica
async function obtenerCompeticion(id, nombre) {
  try {
    const response = await fetch(`http://localhost:3001/api/competitions/${id}/standings`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Clasificación de ${nombre}:`, data);
    mostrarClasificacion(data, nombre);
  } catch (error) {
    console.error(`Error al obtener clasificación de ${nombre}:`, error);
    mostrarError(`No se pudo cargar la clasificación de ${nombre}. Inténtalo de nuevo más tarde.`);
  }
}

// Función para mostrar partidos
function mostrarPartidos(data, tipo) {
  const contenedor = document.querySelector("#datos");
  const titulo = tipo === "próximos" ? "Próximos partidos" : "Últimos resultados";
  
  if (!data || !data.matches || data.matches.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info">No hay ${titulo.toLowerCase()} disponibles.</div>
      </div>
    `;
    return;
  }

  let html = `
    <div class="col-12">
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h3 class="mb-0"><i class="bi bi-calendar-event"></i> ${titulo}</h3>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-dark">
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Competición</th>
                  <th scope="col">Local</th>
                  <th scope="col">Resultado</th>
                  <th scope="col">Visitante</th>
                </tr>
              </thead>
              <tbody>
  `;

  data.matches.forEach(match => {
    const fecha = new Date(match.utcDate).toLocaleDateString();
    const hora = new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const esLocal = match.homeTeam.id === 86; // ID de Real Madrid
    const rival = esLocal ? match.awayTeam.name : match.homeTeam.name;
    const resultado = match.status === 'FINISHED' 
      ? `${match.score.fullTime.home} - ${match.score.fullTime.away}` 
      : hora;

    html += `
      <tr>
        <td>${fecha}</td>
        <td>
          <div class="d-flex align-items-center">
            <img src="${match.competition.emblem}" alt="${match.competition.name}" style="height:20px; margin-right:5px;">
            <span class="badge bg-secondary">${match.competition.name}</span>
          </div>
        </td>
        <td class="${esLocal ? 'fw-bold' : ''}">
          <div class="d-flex align-items-center">
            <img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}" style="height:20px; margin-right:5px;">
            ${match.homeTeam.name}
          </div>
        </td>
        <td class="text-center">${resultado}</td>
        <td class="${!esLocal ? 'fw-bold' : ''}">
          <div class="d-flex align-items-center">
            <img src="${match.awayTeam.crest}" alt="${match.awayTeam.name}" style="height:20px; margin-right:5px;">
            ${match.awayTeam.name}
          </div>
        </td>
      </tr>
    `;
  });

  html += `
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  contenedor.innerHTML = html;
}

// Función para mostrar competiciones
function mostrarCompeticiones(data) {
  const contenedor = document.querySelector('#competiciones');

  if (!data || !data.runningCompetitions || data.runningCompetitions.length === 0) {
    console.error('No se encontraron competiciones activas.');
    return;
  }

  let html = `
    <div class='card mb-4'>
      <div class='card-header'>
        <h3 class='mb-0'><i class='bi bi-trophy-fill'></i> Competiciones Activas</h3>
      </div>
      <div class='card-body'>
        <div class='row'>
          ${data.runningCompetitions.map(comp => `
            <div class='col-md-4 mb-3'>
              <div class='card h-100'>
                <div class='card-body'>
                  ${comp.emblem ? `<img src='${comp.emblem}' alt='${comp.name} Emblem' class='img-fluid mb-3' style='max-height: 100px;'>` : ''}
                  <h5 class='card-title'>${comp.name}</h5>
                  <p class='card-text'>
                    <span class='badge bg-secondary'>${comp.type}</span>
                  </p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  contenedor.innerHTML = html;
}

// Función para mostrar clasificación
function mostrarClasificacion(data, nombreCompeticion) {
  const contenedor = document.querySelector("#datos");

  if (!data || !data.standings) {
    console.error("Datos incompletos o incorrectos.");
    return;
  }

  let html = `
    <div class="card mb-4">
      <div class="card-header">
        <h2>Clasificación de ${nombreCompeticion}</h2>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th scope="col">Pos</th>
                <th scope="col">Equipo</th>
                <th scope="col">PJ</th>
                <th scope="col">G</th>
                <th scope="col">E</th>
                <th scope="col">P</th>
                <th scope="col">GF</th>
                <th scope="col">GC</th>
                <th scope="col">DG</th>
                <th scope="col">Pts</th>
              </tr>
            </thead>
            <tbody>
              ${data.standings[0].table
                .map(
                  (equipo, index) => `
                <tr>
                  <td>${equipo.position}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <img src="${equipo.team.crest}" alt="${equipo.team.name}" style="height:20px; margin-right:10px;">
                      <span class="${equipo.team.id === 86 ? 'fw-bold' : ''}">${equipo.team.name}</span>
                    </div>
                  </td>
                  <td>${equipo.playedGames}</td>
                  <td>${equipo.won}</td>
                  <td>${equipo.draw}</td>
                  <td>${equipo.lost}</td>
                  <td>${equipo.goalsFor}</td>
                  <td>${equipo.goalsAgainst}</td>
                  <td>${equipo.goalDifference}</td>
                  <td class="fw-bold">${equipo.points}</td>
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

// Función para mostrar error
function mostrarError(mensaje) {
  const contenedor = document.querySelector("#datos");
  contenedor.innerHTML = `
    <div class="col-12">
      <div class="alert alert-danger">
        <i class="bi bi-exclamation-triangle-fill"></i> ${mensaje}
      </div>
    </div>
  `;
}

// Función para obtener los goleadores de La Liga
async function obtenerGoleadores() {
  try {
    const response = await fetch("http://localhost:3001/api/competitions/PD/scorers");

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Goleadores de La Liga:", data);
    mostrarGoleadores(data);
  } catch (error) {
    console.error("Error al obtener los goleadores:", error);
    mostrarError("No se pudieron cargar los goleadores. Inténtalo de nuevo más tarde.");
  }
}

// Función para mostrar los goleadores
function mostrarGoleadores(data) {
  const contenedor = document.querySelector("#datos");

  if (!data || !data.scorers) {
    console.error("Datos incompletos o incorrectos.");
    return;
  }

  let html = `
    <div class="card mb-4 text-center">
      <div class="card-header">
        <h2>Goleadores de La Liga</h2>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th scope="col">Ranking</th>
                <th scope="col">Nombre</th>
                <th scope="col">Goles</th>
                <th scope="col">Equipo</th>
              </tr>
            </thead>
            <tbody>
              ${data.scorers
                .map(
                  (scorer, index) => `
                <tr>
                  <td class="text-center"><strong>${index + 1}</strong></td>
                  <td>${scorer.player.name}</td>
                  <td>${scorer.goals}</td>
                  <td>${scorer.team.name}</td>
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

// Asignar el evento al botón de goleadores
document.getElementById("btn-goleadores").addEventListener("click", obtenerGoleadores);

// Inicializar eventos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  // Botón principal
  const btnCargar = document.querySelector("#btn");
  btnCargar.addEventListener("click", obtenerDatosRealMadrid);
  
  // Botones de próximos partidos
  const btnProximosPartidos = document.querySelector("#btn-proximos-partidos");
  btnProximosPartidos.addEventListener("click", obtenerProximosPartidos);
  
  const btnUltimosPartidos = document.querySelector("#btn-ultimos-partidos");
  btnUltimosPartidos.addEventListener("click", obtenerUltimosResultados);
  
  // Botones de competiciones
  const btnLiga = document.querySelector("#btn-liga");
  btnLiga.addEventListener("click", () => obtenerCompeticion(2014, "La Liga"));
  
  const btnChampions = document.querySelector("#btn-champions");
  btnChampions.addEventListener("click", () => obtenerCompeticion(2001, "Champions League"));
  
  // Botones de plantilla
  const btnPlantillaCompleta = document.querySelector("#btn-plantilla-completa");
  btnPlantillaCompleta.addEventListener("click", obtenerDatosRealMadrid);
  
  // Cargar datos iniciales
  obtenerDatosRealMadrid();
});
