// ======================================================
// AIRBOOK - Conexión con el motor de Apps Script
// Lee la dirección desde config.js (WEBAPP_URL).
// ======================================================

(function () {

  var PAGINAS = {
    dashboard: "./",
    reserva: "reserva.html",
    calendario: "calendario.html",
    fdv: "fdv.html"
  };

  function urlApi() {
    var cfg = window.AIRBOOK_CONFIG || {};
    return String(cfg.WEBAPP_URL || "").trim();
  }

  function llamar(accion, datos) {

    var url = urlApi();

    if (!url) {
      return Promise.reject(
        new Error("Falta WEBAPP_URL en config.js.")
      );
    }

    // text/plain evita la verificación previa (CORS) del navegador;
    // Apps Script lee igual el cuerpo en e.postData.contents.
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ accion: accion, datos: datos || {} })
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("El servidor respondió con el código " + res.status + ".");
        }
        return res.json();
      })
      .then(function (json) {
        if (!json || !json.ok) {
          throw new Error((json && json.error) || "Respuesta inválida del servidor.");
        }
        return json.data;
      })
      .catch(function (err) {
        if (err instanceof TypeError) {
          throw new Error("No hay conexión con AIRBOOK. Revisa tu internet e intenta de nuevo.");
        }
        throw err;
      });
  }

  function escapar(valor) {
    return String(valor == null ? "" : valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  window.airbook = {
    llamar: llamar,
    escapar: escapar,
    paginas: PAGINAS,
    ir: function (pagina) {
      window.location.href = PAGINAS[pagina] || pagina;
    }
  };

})();
