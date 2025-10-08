// Variables para Scroll Infinito
let currentPage = 1;  // Página actual para personajes
let maxPages = null;  // Máximo de páginas (determinado por la API)
let loading = false;  // Evita solicitudes simultáneas

// Funciones para manejar la API

// Buscar personajes con scroll infinito
function buscarScrollInfinito(url) {
    if (loading || (maxPages !== null && currentPage > maxPages)) return;

    loading = true;

    $.ajax({
        url: url.includes('?') ? `${url}&page=${currentPage}` : `${url}?page=${currentPage}`,
        method: "GET",
        success: function (data) {
            if (maxPages === null) maxPages = data.info.pages;

            data.results.forEach(element => {
                $("#contenido").append(`
                    <div>
                        <img src='${element.image}'>
                        <p>Nombre: ${element.name}</p>
                        <p>Estado: ${element.status}</p>
                        <p>ID personaje: ${element.id}</p>
                        <p>Especie del personaje: ${element.species}</p>
                        <p>Localización: ${element.location.name}</p>
                    </div>
                `);
            });

            currentPage++;
            loading = false;
        },
        error: function () {
            loading = false;
            console.log("Error cargando personajes");
        }
    });
}

// Buscar episodios
function buscarEp(url) {
    $.ajax({
        url: url,
        method: "GET",
        success: function (data) {
            console.log(data);
            $("#contenido").html("");
            data.results.forEach(element => {
                $("#contenido").append(`
                    <div>
                        <p>Episodio: ${element.episode}</p>
                        <p>Publicado en: ${element.air_date}</p>
                        <button class="btnEp" data-pj='${JSON.stringify(element.characters)}'>Buscar personajes</button>
                    </div>
                `);
            });
        },
        error: function () {
            console.log("Error cargando episodios");
        }
    });
}

// Buscar personajes por episodio
function buscarPjxEp(url) {
    $.ajax({
        url: url,
        method: "GET",
        success: function (data) {
            $("#contenido").append(`
                <div>
                    <img src='${data.image}'>
                    <p>Nombre: ${data.name}</p>
                    <p>Estado: ${data.status}</p>
                    <p>ID personaje: ${data.id}</p>
                    <p>Especie del personaje: ${data.species}</p>
                    <p>Localización del personaje: ${data.location.name}</p>
                </div>
            `);
        },
        error: function () {
            console.log("Error cargando personaje del episodio");
        }
    });
}

// Eventos

// Buscar todos los episodios
$(".buscarEp").on("click", function () {
    var urlEp = `https://rickandmortyapi.com/api/episode`;
    buscarEp(urlEp);
});

// Mostrar personajes del episodio seleccionado
$("#contenido").on("click", ".btnEp", function () {
    $("#contenido").empty(); // Borra personajes anteriores
    let personajesUrls = JSON.parse($(this).attr("data-pj"));
    personajesUrls.forEach(urlPj => buscarPjxEp(urlPj));
});

// Buscar personajes filtrados o generales
$(".buscarPj").on("click", function () {
    $("#contenido").empty();
    currentPage = 1;
    maxPages = null;

    var valInpt = $("input").val().trim();
    var valSelect = $("select").val().trim();
    
    // Base URL
    var url = 'https://rickandmortyapi.com/api/character/';

    // Condiciones para agregar filtros si existen
    if (valInpt || valSelect) {
        url += `?name=${valInpt}&status=${valSelect}`;
    }

    buscarScrollInfinito(url);
});

// Scroll infinito para cargar personajes
$(window).on("scroll", function () {
    if ($(window).scrollTop() + $(window).height() >= $(document).height() - 50) {
        buscarScrollInfinito('https://rickandmortyapi.com/api/character');
    }
});
