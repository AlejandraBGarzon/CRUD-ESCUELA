/* logica corta un logeo*/

const validar = () => {
    const nombre = document.getElementById("nombre").value;
    const clave = document.getElementById("clave").value;
    const mensaje = document.querySelector('h1');
    if(nombre == "Alejandra" && clave == "ber123"){
        mensaje.innerHTML = 'OTRA NUEVA PAGINA CON TABLA' +
                            'DEPORTISTAS';
    } else if (nombre == "cristian" && clave == "cris@90") {
        mensaje.innerHTML = 'OTRA NUEVA PAGINA CON TABLA' +
                            'DEPORTISTAS';
    } else if (nombre == "le1dy" && clave == "Le1dy@09") {
        mensaje.innerHTML = 'OTRA NUEVA PAGINA CON TABLA' +
                            'DEPORTISTAS';
    } else {
        alert('Tus datos no son correctos')
    }
}

