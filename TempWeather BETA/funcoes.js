function agruparPrevisaoPorDia(listaPrevisoes) {
    const previsoesPorDia = {};
    const agora = new Date();

    listaPrevisoes.forEach(item => {
        const dataHora = item.dt_txt;
        const dataObjUTC = new Date(dataHora);
        const hojeLocal = new Date();
        const dataHoje = new Date(hojeLocal.getFullYear(), hojeLocal.getMonth(), hojeLocal.getDate());
        const dataLocal = new Date(
            dataObjUTC.getUTCFullYear(),
            dataObjUTC.getUTCMonth(),
            dataObjUTC.getUTCDate()
        );
        if (dataLocal.getTime() === dataHoje.getTime()) return;

        const data = dataObjUTC.toISOString().split("T")[0];

        if (!previsoesPorDia[data]) {
            previsoesPorDia[data] = {
                tempsMin: [],
                tempsMax: [],
                icone: item.weather[0].icon,
                descricao: item.weather[0].description,
                diaSemana: formatarDiaSemana(data)
            };
        }

        previsoesPorDia[data].tempsMin.push(item.main.temp_min);
        previsoesPorDia[data].tempsMax.push(item.main.temp_max);
    });

    return Object.entries(previsoesPorDia).map(([data, info]) => ({
        tempMin: Math.min(...info.tempsMin).toFixed(2),
        tempMax: Math.max(...info.tempsMax).toFixed(2),
        icone: info.icone,
        descricao: info.descricao,
        diaSemana: info.diaSemana
    })).slice(0, 5);
}

function formatarDiaSemana(data) {
    const dias = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
    const d = new Date(data);
    return dias[d.getDay()];
}

document.addEventListener("DOMContentLoaded", () => {
    const paisInput = document.getElementById("pais");
    const cidadeInput = document.getElementById("cidade");
    if (paisInput && cidadeInput) {
        paisInput.addEventListener("change", function () {
            const selected = capitaisPorPais[this.value];
            if (selected) cidadeInput.value = selected;
        });
    }
});

async function buscarEstadoEPais(lat, lon, paisCodigo) {
    try {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
        const data = await response.json();

        if (data.length > 0) {
            const estado = data[0].state || "";
            const paisNome = data[0].country || paisCodigo;
            return { estado, paisNome };
        } else {
            return { estado: "", paisNome: paisCodigo };
        }
    } catch (error) {
        console.error("Erro ao buscar estado e país:", error);
        return { estado: "", paisNome: paisCodigo };
    }
}

async function saveSearch(cidade, estado, pais) {
    const agora = new Date();
    const date = agora.toLocaleDateString("pt-BR");
    const time = agora.toLocaleTimeString("pt-BR");
    const temperatura = document.querySelector(".temperatura strong")?.textContent?.replace("°C", "") || "";

    const dados = {
        user_id: USER_ID, 
        city: cidade,
        state: estado,
        country: pais,
        temperature: parseFloat(temperatura),
        date,
        time
    };

    try {
        await fetch(`${BACKEND_URL}/save-search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });
    } catch (error) {
        console.error("❌ Erro ao salvar busca no servidor:", error);
    }
}

function formatarNomeCidade(cidade) {
    if (!cidade || typeof cidade !== 'string') return "Cidade Desconhecida";
    return cidade.toLowerCase()
        .split(" ")
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(" ");
}

function interpretarAQI(aqi) {
    const niveis = {
        1: { descricao: "Boa", cor: "#40ff00" },
        2: { descricao: "Razoável", cor: "#ffde33" },
        3: { descricao: "Moderada", cor: "#ff9933" },
        4: { descricao: "Ruim", cor: "#cc0033" },
        5: { descricao: "Péssima", cor: "#660099" }
    };
    return niveis[aqi] || { descricao: "Desconhecido", cor: "#999" };
}

function getCorTemperatura(temp) {
    if (temp <= 0) return "aqua";
    if (temp <= 5) return "royalblue";
    if (temp <= 10) return "blue";
    if (temp <= 15) return "#1a7534";
    if (temp <= 20) return "yellow";
    if (temp <= 25) return "orange";
    if (temp <= 30) return "orangered";
    
}

function mostrarMapa(lat, lon, cidade) {
    const divMapa = document.getElementById("mapa");
    divMapa.style.display = "block";

    otherinfo.addEventListener('click', function(){
        if(divMapa.style.display === 'block') {
            divMapa.style.display = 'none';
        }
    })

    if (mapa) {
        mapa.setView([lat, lon], 10);
        if (marcador) {
            marcador.setLatLng([lat, lon]).setPopupContent(`📍 ${cidade}`).openPopup();
        } else {
            marcador = L.marker([lat, lon]).addTo(mapa).bindPopup(`📍 ${cidade}`).openPopup();
        }
        setTimeout(() => {
            mapa.invalidateSize();
        }, 100);
        return;
    }

    mapa = L.map('mapa').setView([lat, lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
    }).addTo(mapa);

    marcador = L.marker([lat, lon]).addTo(mapa).bindPopup(`📍 ${cidade}`).openPopup();

    setTimeout(() => {
        mapa.invalidateSize();
    }, 200);
}

