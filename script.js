const baseDeDatos = Array.from({ length: 25 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    titulo: `Recuerdo N°${id}`,
    fecha: `Momento especial #${id}`,
    imagen: id === 1 ? `imagenes/foto1.jpg` : `imagenes/foto${id}.jpeg`,
    descripcion:
      `Este fue uno de esos días que se quedan para siempre en mi alma. ` +
      `Si cierro los ojos todavía puedo sentir tu sonrisa, tu voz y la magia de estar contigo en este recuerdo ${id}.`,
    cancionRuta: `musica/track${id}.mp3`,
    cancionNombre: `Canción ${id} (editar nombre real)`,
    letra:
      `"Aquí puedes escribir una letra especial, un mensaje íntimo o una parte de la canción ` +
      `que representa este momento. Reemplázalo por tu texto real para que Jennifer lo sienta aún más personal."`
  };
});

const vistaInicio = document.getElementById("vista-inicio");
const vistaCatalogo = document.getElementById("vista-catalogo");
const catalogoGrid = document.getElementById("catalogo-grid");
const buscador = document.getElementById("buscador");
const audioPrincipal = document.getElementById("audio-principal");
const audioEspecifico = document.getElementById("audio-especifico");

const modal = document.getElementById("modal-detalle");
const modalCarta = document.getElementById("modal-carta");

const modalImg = document.getElementById("modal-img");
const modalFecha = document.getElementById("modal-fecha");
const modalTitulo = document.getElementById("modal-titulo");
const modalId = document.getElementById("modal-id");
const modalDesc = document.getElementById("modal-desc");
const modalCancionNombre = document.getElementById("modal-cancion-nombre");
const modalLetra = document.getElementById("modal-letra");

const btnIniciar = document.getElementById("btn-iniciar");
const btnSorpresa = document.getElementById("btn-sorpresa");
const btnCarta = document.getElementById("btn-carta");
const btnAudio = document.getElementById("btn-audio");
const closeBtns = document.querySelectorAll(".close-btn");

function renderCatalogo(listado) {
  catalogoGrid.innerHTML = "";

  listado.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.imagen}" alt="${item.titulo}" onerror="this.src='https://via.placeholder.com/600x400/171d3c/f7f8ff?text=Recuerdo+${item.id}'">
      <div class="card-body">
        <h3>${item.titulo}</h3>
        <p>${item.fecha}</p>
      </div>
    `;

    card.addEventListener("click", () => abrirDetalle(item));
    catalogoGrid.appendChild(card);
  });
}

function abrirCatalogo() {
  vistaInicio.hidden = true;
  vistaCatalogo.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
  window.location.hash = "catalogo";
  renderCatalogo(baseDeDatos);
}

function abrirDetalle(item) {
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");

  modalImg.src = item.imagen;
  modalFecha.textContent = item.fecha;
  modalTitulo.textContent = item.titulo;
  modalId.textContent = `Recuerdo #${item.id}`;
  modalDesc.textContent = item.descripcion;
  modalCancionNombre.textContent = item.cancionNombre;
  modalLetra.textContent = item.letra;

  audioPrincipal.pause();
  audioEspecifico.src = item.cancionRuta;
  audioEspecifico.load();
  audioEspecifico.play().catch(() => {});
}

function cerrarModales() {
  modal.classList.remove("active");
  modalCarta.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  modalCarta.setAttribute("aria-hidden", "true");
  audioEspecifico.pause();
  audioEspecifico.currentTime = 0;
}

function manejarHash() {
  if (window.location.hash === "#catalogo") {
    abrirCatalogo();
    return;
  }

  vistaInicio.hidden = false;
  vistaCatalogo.hidden = true;
}

btnIniciar.addEventListener("click", abrirCatalogo);
btnSorpresa.addEventListener("click", () => {
  modalCarta.classList.add("active");
  modalCarta.setAttribute("aria-hidden", "false");
});
btnCarta.addEventListener("click", () => {
  modalCarta.classList.add("active");
  modalCarta.setAttribute("aria-hidden", "false");
});

btnAudio.addEventListener("click", () => {
  if (audioPrincipal.paused) {
    audioPrincipal.volume = 0.45;
    audioPrincipal.play().catch(() => {});
    btnAudio.innerHTML = '<i class="fa-solid fa-pause"></i>';
    return;
  }

  audioPrincipal.pause();
  btnAudio.innerHTML = '<i class="fa-solid fa-music"></i>';
});

closeBtns.forEach((btn) => btn.addEventListener("click", cerrarModales));

[modal, modalCarta].forEach((container) => {
  container.addEventListener("click", (event) => {
    if (event.target === container) cerrarModales();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") cerrarModales();
});

buscador.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  const filtrados = baseDeDatos.filter((item) => {
    return (
      item.titulo.toLowerCase().includes(query) ||
      item.fecha.toLowerCase().includes(query)
    );
  });

  renderCatalogo(filtrados);
});

window.addEventListener("hashchange", manejarHash);
window.addEventListener("load", () => {
  document.getElementById("total-recuerdos").textContent = String(baseDeDatos.length);
  document.getElementById("total-canciones").textContent = String(baseDeDatos.length);

  manejarHash();
  audioPrincipal.volume = 0.35;

  audioPrincipal.play().then(() => {
    btnAudio.innerHTML = '<i class="fa-solid fa-pause"></i>';
  }).catch(() => {});
});