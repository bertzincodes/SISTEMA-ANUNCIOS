let db;

const $ = (id) => document.getElementById(id);

async function refresh() {
  db = await window.api.getDb();
  $("photoSeconds").value = db.settings.photoSeconds;
  $("seconds").textContent = db.settings.photoSeconds;
  $("total").textContent = db.items.length;
  $("active").textContent = db.items.filter(x => x.active).length;
  render();
}

function render() {
  const list = $("list");
  list.innerHTML = "";
  $("empty").style.display = db.items.length ? "none" : "block";

  db.items.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "item " + (item.active ? "" : "off");

    const thumb = document.createElement(item.type === "video" ? "video" : "img");
    thumb.className = "thumb";
    thumb.src = "file://" + location.pathname.replace(/\\/g,"/").replace(/\/[^/]*$/,"") + "/media/" + item.file;
    if (item.type === "video") { thumb.muted = true; thumb.preload = "metadata"; }

    const info = document.createElement("div");
    info.innerHTML = `<div class="name">${escapeHtml(item.name)}</div>
      <div class="meta">${item.type === "video" ? "Vídeo" : "Imagem"} • ${item.active ? "Ativo" : "Desativado"}</div>`;

    const actions = document.createElement("div");
    actions.className = "actions";
    actions.innerHTML = `
      <button data-action="up" ${i===0?"disabled":""}>↑</button>
      <button data-action="down" ${i===db.items.length-1?"disabled":""}>↓</button>
      <button data-action="toggle">${item.active?"Desativar":"Ativar"}</button>
      <button data-action="delete">Excluir</button>`;
    actions.querySelectorAll("button").forEach(btn => {
      btn.onclick = async () => {
        const a = btn.dataset.action;
        if (a === "delete" && !confirm("Excluir esta mídia?")) return;
        if (a === "up" || a === "down") db = await window.api.moveMedia(item.id, a);
        if (a === "toggle") db = await window.api.toggleMedia(item.id);
        if (a === "delete") db = await window.api.deleteMedia(item.id);
        refresh();
      };
    });

    row.append(thumb, info, actions);
    list.appendChild(row);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

$("addBtn").onclick = async () => { db = await window.api.importMedia(); refresh(); };
$("saveBtn").onclick = async () => {
  db = await window.api.saveSettings({ photoSeconds: $("photoSeconds").value });
  refresh();
  alert("Configuração salva.");
};
$("playerBtn").onclick = () => window.api.openPlayer();

refresh();