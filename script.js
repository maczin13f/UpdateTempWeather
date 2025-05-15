const paisinput = document.getElementById('pais');
const inputbusca = document.getElementById('cidade');
const fechar = document.getElementById('fechar');
const divMapa = document.getElementById("mapa");

inputbusca.addEventListener('keydown', function(event){
    if (event.key === 'Enter') {
        if (cidade) {
            buscarPrevisao(cidade);
        }
    }
})

const otherinfo = document.getElementById('otherinfo');
const resu = document.getElementById('resultado');
const resu3 = document.getElementById('resultado3');
 const resu1 = document.getElementById('resultado1');
const resu2 = document.getElementById('resultado2');
const alertas = document.getElementById('alertasClimaticos');
const nextdias = document.getElementById('previsaoDias');

otherinfo.addEventListener('click', function(){
    resu.style.display = 'none';
    resu3.style.display = 'none';
    resu1.style.display = 'block';
    resu2.style.display = 'block';
    alertas.style.display = 'none';
    nextdias.style.display = 'none';
    otherinfo.style.bottom = '4.3em';
    fechar.style.top = '-35.7em';
    divMapa.style.display = "block";
    paisinput.style.top = '-11.45em';
    paisinput.style.left = '49em';
})



fechar.addEventListener('click', function(){
    resu.style.display = 'none';;
    resu1.style.display = 'none';
    resu2.style.display = 'none';
    resu3.style.display = 'none';
    divMapa.style.display = 'none';
    alertas.style.display = 'none';
    nextdias.style.display = 'none';
    otherinfo.style.display = 'none';
})

