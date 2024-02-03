
document.addEventListener("DOMContentLoaded", function () {
    $('.preloader-background').delay(10).fadeOut('slow');
    const savedUsername = localStorage.getItem("username");
    // Si se encuentra la información de inicio de sesión, llenar los campos
    if (savedUsername) {
        document.getElementById("username").value = savedUsername;
        document.getElementById("check-1").checked = true;
    }
    var emailLabel = document.querySelector('label[for="username"]');
    if (emailLabel && savedUsername) {
        emailLabel.classList.add("active");
    }
    var passwordField = document.getElementById("password-field");
    if (passwordField) {
        passwordField.focus();
        var passwordLabel = document.querySelector('label[for="password-field"]');
        if (passwordLabel) {
            passwordLabel.classList.add("active");
        }
    }
    
});
$(document).ready(function () {
    $.ajaxSetup({ cache: false });
});
$(function () {
    $("#formLogin").each(function () {
        $(this)
            .find("input")
            .keypress(function (e) {
                // Enter pressed?
                if (e.which == 10 || e.which == 13) {
                    login();
                }
            });
    });
    $(this).find("button[type=submit]").hide();
});
$("#btn_login").click(function (event) {
    login();
});
function login() {
    event.preventDefault();
    var formData = {};
    var invalido = 0;
    // Obtener la etiqueta donde mostrar el progreso
    var progressMessage = document.getElementById('btn_login');
    $('.validate').each(function () {
        if ($(this).val() == "") {
            invalido = 1;
        } else {
            var value = $(this).val();
            var name = $(this).attr('name');
            formData[name] = value;
            console.log(name + ' -- ' + formData[name]);
        }
    });
    formData['rememberme'] = 0;
    if ($('#check-1').is(':checked')) {
        formData['rememberme'] = 1;
        // Guardar credenciales en cookies o localStorage
        localStorage.setItem('username', formData['username']);
    }
    if (invalido == 1) {
        alert("Complete the fields");
        return false;
    }
    if (navigator.onLine) {
        formData['version'] = '20231031';
        const loginurl = 'https://quattropy.com/valeria/s1/public/api/stock/login';
        // Mostrar mensaje de progreso
        progressMessage.innerText = "INGRESANDO...";
        let error = false
        $.ajax({
            type: 'POST',
            url: loginurl,
            data: formData,
            dataType: 'json',
            success: function (data) {
                if (data.status != "success") {
                    if (data.error == 'version') {
                        alert(data.msg);
                        return false;
                    }
                    if (data.error == 'servidor') {
                        alert(data.msg);
                        return false;
                    }
                    alert(data.message);
                    return false;
                }
                localStorage.login = data.data.token;
                localStorage.img = data.data.img;
                localStorage.user = data.data.user;
                localStorage.rol = data.data.rol;
                localStorage.idusu = data.data.id_usu;
                localStorage.permisos = JSON.stringify(data.data.permisos);
                let today = new Date().toISOString().slice(0, 10);
                localStorage.hoy = today;
                setCookie("login", data.data.token, 1);
                // Redireccionar después de un inicio de sesión exitoso
                window.location.href = "./index.html";
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("NO SE PUDO CONECTAR AL SERVIDOR" + JSON.stringify(xhr) + " " + xhr.statusText);
                error = true
                progressMessage.innerText = "INGRESAR";
            },
            complete: function () {
                // Eliminar el mensaje de progreso después de completar la petición AJAX
                if (error === false) {
                    progressMessage.innerText = "¡ÉXITO!";
            }
            }
        });
    } else {
        alert("Sin conexión a internet");
    }
}
function togglePassword() {
    var passwordField = document.getElementById("password-field");
    var showPasswordBtn = document.querySelector(".show-password");
    if (passwordField.type === "password") {
      passwordField.type = "text";
      showPasswordBtn.innerHTML = '<i class="mdi mdi-eye-off-outline"></i>';
    } else {
      passwordField.type = "password";
      showPasswordBtn.innerHTML = '<i class="mdi mdi-eye-outline"></i>';
    }
  }
  function setCookie(name, value, days) {
    var expires = new Date();
    expires.setDate(expires.getDate() + days);
    var cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
    document.cookie = cookie;
}
