       async function previewDias() {

        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=-22.0&lon=-55.0&appid=${API_KEY}&units=metric&lang=pt`);
        const forecastData = await forecastRes.json();

        // Previsão dos próximos dias
        const previsoesPorDia = agruparPrevisaoPorDia(forecastData.list);

        const diasHtml = previsoesPorDia.map(previsao => `
            <div class="card-dias">
                <p class="dia-nome">${previsao.diaSemana}</p>
                <img src="https://openweathermap.org/img/wn/${previsao.icone}.png" alt="${previsao.descricao}" class="icone" />
                <p class="min-max"> Min: ${previsao.tempMin}°C / Max: ${previsao.tempMax}°C</p>
            </div>
        `).join("");

        document.getElementById("previsaoDias2").innerHTML = `
            <h5><span class="nextdias">📆 Previsão dos próximos dias:</span></h5>
            <div class="dias">${diasHtml}</div>
        `;
        document.getElementById("previsaoDias2").style.display = "";
       }

       window.onload = previewDias();

