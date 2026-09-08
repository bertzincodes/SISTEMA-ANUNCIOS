const CONFIG = {
  tempoFoto: 10,

  repetir: true,

  anuncios: [
    // EXEMPLO:
    // { arquivo: "anuncios/foto01.jpg", tipo: "imagem" },
    // { arquivo: "anuncios/video01.mp4", tipo: "video" }
  ]
};

const container = document.getElementById("mediaContainer");
const message = document.getElementById("message");

let indice = 0;
let timer = null;

function mostrarMensagem(texto) {
  message.textContent = texto;
  message.style.display = "flex";
}

function esconderMensagem() {
  message.style.display = "none";
}

function proximo() {
  clearTimeout(timer);

  if (CONFIG.anuncios.length === 0) {
    mostrarMensagem("Nenhum anúncio cadastrado.");
    return;
  }

  indice++;

  if (indice >= CONFIG.anuncios.length) {
    if (CONFIG.repetir) {
      indice = 0;
    } else {
      indice = CONFIG.anuncios.length - 1;
      return;
    }
  }

  reproduzir();
}

function reproduzir() {
  clearTimeout(timer);
  container.innerHTML = "";

  if (CONFIG.anuncios.length === 0) {
    mostrarMensagem("Nenhum anúncio cadastrado.");
    return;
  }

  const anuncio = CONFIG.anuncios[indice];

  esconderMensagem();

  if (anuncio.tipo === "video") {

    const video = document.createElement("video");

    video.src = anuncio.arquivo;
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.controls = false;

    video.addEventListener("ended", proximo);
    video.addEventListener("error", proximo);

    container.appendChild(video);

    video.play().catch(() => {
      mostrarMensagem("Clique na tela para iniciar o vídeo.");
    });

  } else {

    const imagem = document.createElement("img");

    imagem.src = anuncio.arquivo;
    imagem.alt = "Anúncio";

    imagem.addEventListener("error", proximo);

    container.appendChild(imagem);

    timer = setTimeout(
      proximo,
      Math.max(1, Number(CONFIG.tempoFoto) || 10) * 1000
    );
  }
}

document.addEventListener("click", () => {

  const video = container.querySelector("video");

  if (video && video.paused) {
    video.play().catch(() => {});
  }

});

document.addEventListener("keydown", event => {

  if (event.key === "ArrowRight" || event.key === " ") {
    proximo();
  }

});

reproduzir();