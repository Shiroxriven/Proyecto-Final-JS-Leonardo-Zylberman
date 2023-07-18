const precioDolar = 490;
let cotizaciones;

// Cargar las cotizaciones desde el archivo JSON
fetch('cotizaciones.json')
  .then(response => response.json())
  .then(data => {
    cotizaciones = data;
    console.log('Cotizaciones cargadas:', cotizaciones);
  })
  .catch(error => {
    console.error('Error al cargar las cotizaciones:', error);
  });

document.getElementById('ingresar-btn').addEventListener('click', verificarNombre);
document.getElementById('cotizar-btn').addEventListener('click', cotizar);
document.getElementById('buscar-btn').addEventListener('click', buscarCotizacionDesdeHTML);

function verificarNombre() {
  const nombre = document.getElementById('nombre').value.trim();

  if (/^[a-zA-Z]+$/.test(nombre)) {
    console.log('Bienvenido, ' + nombre + '! Ya puedes cotizar tu dólar.');

    // Almacenar el nombre de usuario en localStorage
    localStorage.setItem('nombreUsuario', nombre);

    document.getElementById('cotizacion-container').style.display = 'block';
    document.getElementById('resultado-container').style.display = 'none';
  } else {
    mostrarAdvertencia('Ingresa un nombre de usuario válido (solo letras)');
  }
}

// Recuperar el nombre de usuario almacenado en localStorage
const nombreUsuario = localStorage.getItem('nombreUsuario');
if (nombreUsuario) {
  document.getElementById('nombre').value = nombreUsuario;
}

function cotizar() {
  const monto = parseInt(document.getElementById('monto').value.trim());

  if (!isNaN(monto)) {
    const cotizacion = monto * precioDolar;

    console.log('La cotización es: ' + cotizacion);

    document.getElementById('resultado').textContent = 'La cotización es: ' + cotizacion + ' pesos argentinos';
    document.getElementById('resultado-container').style.display = 'block';

    // Almacenar la cotización pasada en localStorage
    guardarCotizacionPasada(getCurrentDate(), cotizacion);

    mostrarCotizacionesPasadas();
  } else {
    mostrarAdvertencia('Ingresa un monto válido');
  }
}

function buscarCotizacionDesdeHTML() {
  const fechaInput = document.getElementById('fechaInput').value.trim();

  if (fechaInput) {
    const cotizacion = cotizaciones.find(c => c.fecha === fechaInput);

    if (cotizacion) {
      console.log('La cotización para la fecha ' + fechaInput + ' es: ' + cotizacion.valor);

      document.getElementById('resultado').textContent = 'La cotización para la fecha ' + fechaInput + ' es: ' + cotizacion.valor + ' pesos argentinos';
      document.getElementById('resultado-container').style.display = 'block';

      mostrarCotizacionesPasadas();
    } else {
      mostrarAdvertencia('No se encontró una cotización para la fecha ' + fechaInput);
    }
  } else {
    mostrarAdvertencia('Ingresa una fecha válida');
  }
}

function mostrarAdvertencia(mensaje) {
  const advertencia = document.getElementById('advertencia');
  advertencia.textContent = mensaje;
  advertencia.style.display = 'block';

  // Ocultar la advertencia después de 6 segundos
  setTimeout(() => {
    advertencia.textContent = '';
    advertencia.style.display = 'none';
  }, 6000);
}

function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function guardarCotizacionPasada(fecha, cotizacion) {
  let cotizacionesPasadas = localStorage.getItem('cotizacionesPasadas');

  if (cotizacionesPasadas) {
    const cotizacionesArray = JSON.parse(cotizacionesPasadas);
    cotizacionesArray.push({ fecha: fecha, cotizacion: cotizacion });
    localStorage.setItem('cotizacionesPasadas', JSON.stringify(cotizacionesArray));
  } else {
    localStorage.setItem('cotizacionesPasadas', JSON.stringify([{ fecha: fecha, cotizacion: cotizacion }]));
  }
}

function mostrarCotizacionesPasadas() {
  const cotizacionesPasadas = localStorage.getItem('cotizacionesPasadas');
  const cotizacionesList = document.getElementById('cotizaciones-list');

  cotizacionesList.innerHTML = '';

  if (cotizacionesPasadas) {
    const cotizacionesArray = JSON.parse(cotizacionesPasadas);

    for (const cotizacion of cotizacionesArray) {
      const li = document.createElement('li');
      li.textContent = cotizacion.fecha + ': ' + cotizacion.cotizacion;
      cotizacionesList.appendChild(li);
    }
  }
}

mostrarCotizacionesPasadas();
