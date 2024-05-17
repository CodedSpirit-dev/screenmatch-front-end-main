import getDatos from "./getDatos.js";

const params = new URLSearchParams(window.location.search);
const serieId = params.get('id');
const listaTemporadas = document.getElementById('temporadas-select');
const fichaSerie = document.getElementById('temporadas-episodios');
const fichaDescripcion = document.getElementById('ficha-descripcion');

// Function to load seasons
function cargarTemporadas() {
    getDatos(`/series/${serieId}/temporadas/todas`)
        .then(data => {
            console.log('Data received:', data);  // Debugging line

            const temporadasUnicas = [...new Set(data.map(episodio => episodio.season))];
            console.log('Unique seasons:', temporadasUnicas);  // Debugging line

            listaTemporadas.innerHTML = ''; // Clear existing options

            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Seleccione la temporada';
            listaTemporadas.appendChild(optionDefault);

            temporadasUnicas.forEach(temporada => {
                const option = document.createElement('option');
                option.value = temporada;
                option.textContent = `Temporada ${temporada}`;
                listaTemporadas.appendChild(option);
            });

            const optionTodos = document.createElement('option');
            optionTodos.value = 'todas';
            optionTodos.textContent = 'Todas las temporadas';
            listaTemporadas.appendChild(optionTodos);
        })
        .catch(error => {
            console.error('Error al obtener temporadas:', error);
        });
}

// Function to load episodes of a season
function cargarEpisodios() {
    getDatos(`/series/${serieId}/temporadas/${listaTemporadas.value}`)
        .then(data => {
            console.log('Episodes data received:', data);  // Debugging line

            const temporadasUnicas = [...new Set(data.map(season => season.season))];
            fichaSerie.innerHTML = ''; 
            temporadasUnicas.forEach(temporada => {
                const ul = document.createElement('ul');
                ul.className = 'episodios-lista';

                const episodiosTemporadaAtual = data.filter(serie => serie.season === temporada);

                const listaHTML = episodiosTemporadaAtual.map(serie => `
                    <li>
                        ${serie.episodeNumber} - ${serie.title}
                    </li>
                `).join('');
                ul.innerHTML = listaHTML;
                
                const paragrafo = document.createElement('p');
                const linha = document.createElement('br');
                paragrafo.textContent = `Temporada ${temporada}`;
                fichaSerie.appendChild(paragrafo);
                fichaSerie.appendChild(linha);
                fichaSerie.appendChild(ul);
            });
        })
        .catch(error => {
            console.error('Error al obtener episodios:', error);
        });
}

// Function to load series information
function cargarInfoSerie() {
    getDatos(`/series/${serieId}`)
        .then(data => {
            console.log('Series info received:', data);  // Debugging line

            fichaDescripcion.innerHTML = `
                <img src="${data.poster}" alt="${data.title}" />
                <div>
                    <h2>${data.title}</h2>
                    <div class="descricao-texto">
                        <p><b>Média de evaluaciones:</b> ${data.imdbRating}</p>
                        <p>${data.plot}</p>
                        <p><b>Actores:</b> ${data.actors}</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error al obtener informaciones de la serie:', error);
        });
}

// Add event listener for the select element
listaTemporadas.addEventListener('change', cargarEpisodios);

// Load series info and seasons when the page loads
cargarInfoSerie();
cargarTemporadas();
