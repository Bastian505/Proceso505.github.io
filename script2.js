document.addEventListener("DOMContentLoaded", function () {
    var nombreInput = document.getElementById("nombreInput");
    var agregarNombreBtn = document.getElementById("agregarNombreBtn");
    var textarea = document.getElementById("inputTextarea");
    var container = document.getElementById("container");
    var nombresContainer = document.getElementById("nombresContainer");
    var procesarBtn = document.getElementById("procesarBtn");
    var guardarBtn = document.getElementById("guardarBtn");
    var totalesContainer = document.getElementById("totalesContainer");

    procesarBtn.addEventListener("click", procesarLista);
    guardarBtn.addEventListener("click", guardarSeleccion);
    agregarNombreBtn.addEventListener("click", agregarNombre);

    function agregarNombre() {
        var nombre = nombreInput.value.trim();
        if (nombre !== "") {
            var nombreElement = document.createElement("div");
            nombreElement.textContent = nombre.toUpperCase(); // Convertir el nombre a mayúsculas
            nombreElement.className = "nombre-element";
            nombreElement.addEventListener("click", function () {
                toggleSelection(nombreElement);
            });
            nombresContainer.appendChild(nombreElement);
            nombreInput.value = ""; // Limpiar el input después de agregar el nombre
        }
    }
    

    function procesarLista() {
        var lines = textarea.value.split("\n");
    
        container.innerHTML = "";
        guardarBtn.disabled = true;
    
        lines.forEach(function (line) {
            // Reemplazar 'l' con '1' al principio de la línea
            line = line.replace(/^l\s/, '1 ');
    
            if (line.trim() !== "") {
                var parts = line.split(' ');
                var firstPart = parseInt(parts[0]);
    
                // Extraer y limpiar la última parte
                var lastPartStr = parts[parts.length - 1];
                var cleanLastPartStr = lastPartStr.replace(/[$,.]/g, ''); // Remover $, . y ,
                var lastPart = parseFloat(cleanLastPartStr);
    
                var newLastPart = lastPart / firstPart;
                var newLine = line.replace(lastPartStr, newLastPart.toFixed(0));
    
                for (var i = 0; i < firstPart; i++) {
                    createButton(newLine);
                }
            }
        });
    
        // Vuelve a definir las variables después de crear nuevos elementos
        var selectedButtons = document.querySelectorAll(".line-button.selected");
        var selectedNames = document.querySelectorAll(".nombre-element.selected");
    
        // Habilitar el botón Guardar solo si hay botones o nombres seleccionados
        if (selectedButtons.length > 0 || selectedNames.length > 0) {
            guardarBtn.disabled = false;
        }
    }
    
    
    function createButton(text) {
        var button = document.createElement("div");
        button.textContent = text;
        button.className = "line-button";
        button.addEventListener("click", function () {
            toggleSelection(button);
        });
        container.appendChild(button);
    }
    
           
    function toggleSelection(element) {
        element.classList.toggle("selected");
        // Actualizar el estado del botón Guardar al seleccionar/deseleccionar un botón o un nombre
        guardarBtn.disabled = !(
            document.querySelector(".line-button.selected") ||
            document.querySelector(".nombre-element.selected")
        );
    }
    
    var totalGlobal = 0;
    var totalConImpuestoGlobal = 0;
    
    function guardarSeleccion() {
        var subtotal = 0;
        var total = 0;
    
        var selectedButtons = document.querySelectorAll(".line-button.selected");
        var selectedNames = document.querySelectorAll(".nombre-element.selected");
    
        if (selectedButtons.length === 0 && selectedNames.length === 0) {
            alert("Por favor, seleccione al menos un elemento antes de guardar.");
            return;
        }
    
        selectedButtons.forEach(function (button) {
            var parts = button.textContent.split(' ');
            var lastPart = parts[parts.length - 1];
            subtotal += parseFloat(lastPart);
            button.classList.add("disabled");
            button.classList.remove("selected");  // Deseleccionar el botón
        });
    
        selectedNames.forEach(function (name) {
            name.classList.add("disabled");
            name.classList.remove("selected");  // Deseleccionar el nombre
        });
    
        // Crear la tabla si aún no existe
        var tabla = document.getElementById("tablaTotales");
        if (!tabla) {
            tabla = document.createElement("table");
            tabla.id = "tablaTotales";
            totalesContainer.appendChild(tabla);
    
            // Crear la fila de encabezado solo si no existe
            if (tabla.getElementsByTagName('th').length === 0) {
                var encabezado = document.createElement("tr");
                ["Nombre", "Subtotal", "Total"].forEach(function (titulo) {
                    var celdaEncabezado = document.createElement("th");
                    celdaEncabezado.textContent = titulo;
                    encabezado.appendChild(celdaEncabezado);
                });
                tabla.appendChild(encabezado);
            }
        }
    
        // Asegurémonos de que haya al menos un nombre seleccionado
        if (selectedNames.length > 0) {
            // Obtén el valor del nombre desde el botón seleccionado
            var nombre = selectedNames[selectedNames.length - 1].textContent.trim();
    
            if (nombre === "") {
                alert("Nombre no válido. La selección no se guardará.");
                return;
            }
    
            total = subtotal * 1.1; // Sumar el 10% al total
    
            // Crear una nueva fila para los totales
            var fila = document.createElement("tr");
            [nombre, "$" + subtotal.toFixed(0), "$" + total.toFixed(0)].forEach(function (valor) {
                var celda = document.createElement("td");
                celda.textContent = valor;
                fila.appendChild(celda);
            });
            var filaTotal = document.getElementById("filaTotal");
            tabla.insertBefore(fila, filaTotal); // Insertar la nueva fila antes de la fila "TOTAL"
    
            totalGlobal += subtotal;
            totalConImpuestoGlobal += total;
    
            guardarBtn.disabled = true;
        } else {
            alert("No se encontró ningún nombre seleccionado.");
        }
    
        // Agregar la fila TOTAL al final de la tabla
        var filaTotal = document.getElementById("filaTotal");
        if (filaTotal) {
            // Si la fila TOTAL ya existe, actualizar los valores
            filaTotal.children[1].textContent = "$" + totalGlobal.toFixed(0);
            filaTotal.children[2].textContent = "$" + totalConImpuestoGlobal.toFixed(0);
        } else {
            // Si la fila TOTAL no existe, crearla
            filaTotal = document.createElement("tr");
            filaTotal.id = "filaTotal";
            ["TOTAL", "$" + totalGlobal.toFixed(0), "$" + totalConImpuestoGlobal.toFixed(0)].forEach(function (valor) {
                var celda = document.createElement("td");
                celda.textContent = valor;
                filaTotal.appendChild(celda);
            });
            tabla.appendChild(filaTotal);
        }
    }
    
});  
    