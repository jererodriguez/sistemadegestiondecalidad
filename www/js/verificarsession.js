document.addEventListener("DOMContentLoaded", verificarSession);

function verificarSession() {
    // Obtener el token almacenado en la cookie
    var token = getCookie("login");

    // Verificar si el token está presente
    if (!token) {
        // Redirigir a la página de inicio de sesión
        window.location.href = './login.html';
        return;
    }

    // Hacer una solicitud a la API para verificar el token
    var xhr = new XMLHttpRequest();
    var apiUrl = 'https://quattropy.com/valeria/s1/public/api/stock/session';
    xhr.open('GET', apiUrl);
    xhr.setRequestHeader('token', token);
    xhr.responseType = 'json';
    xhr.onload = function () {
        if (xhr.status === 200) {
            // El token es válido, se puede continuar
            // Guardar el valor del token en la cookie "login" por 1 día
            console.log('Token válido. Continuar con la sesión.');
        } else {
            // El token no es válido o ha expirado
            alert('Error al verificar el token de sesión');
            // Redirigir a la página de inicio de sesión
            window.location.href = '/login.html';
        }
    };
    xhr.onerror = function () {
        // Error en la solicitud
        alert('Error al verificar el token de sesión');
        // Redirigir a la página de inicio de sesión
        window.location.href = '/login.html';
    };
    xhr.send();
}

// Función para obtener el valor de una cookie por su nombre
function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

