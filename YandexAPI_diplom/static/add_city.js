    // Создаем массив с названиями полей
var fields = ["country", "region", "city"];
var placeholders = ["Страна", "Регион", "Город"];
// Функция, которая добавляет поля для ввода еще одного города
function addCity() {
    // Получаем ссылку на fieldset, куда будем добавлять поля
    var fieldset = document.querySelector("fieldset:last-of-type");
    var inputs = fieldset.querySelectorAll("input").length;
    // Проверяем, что количество полей меньше девяти (максимальное количество для трех городов)
    if (inputs < 9) {
      // Создаем счетчик для генерации уникальных id и name
      var counter = inputs / 3 + 3;
    
    // Проходим по массиву с названиями полей
    for (var i = 0; i < fields.length; i++) {
        // Создаем элемент input
        var input = document.createElement("input");
        // Задаем атрибуты input
        input.id = fields[i].toLowerCase() + "-input-" + counter;
        input.name = fields[i].toLowerCase() + "-" + counter;
        input.type = "text";
        input.setAttribute("list",fields[i].toLowerCase() + "-list");
        input.placeholder = placeholders[i];
        input.required = true;
        // Добавляем input в fieldset
        fieldset.appendChild(input);
    }


     // Добавляем элемент button для убирания полей
     var button = document.createElement("button");
     // Задаем атрибуты button
     button.id = "remove-" + counter;
     button.type="remove";
     button.textContent = "X";
     button.onclick = function() { removeCity(counter) }; // передаем параметр с номером города
     // Добавляем button в fieldset
     fieldset.appendChild(button);
   }
}
   // Функция для убирания полей для ввода
   function removeCity(number) {
     // Получаем ссылку на fieldset, откуда будем убирать поля
     var fieldset = document.querySelector("fieldset:last-of-type");
     // Проходим по массиву с названиями полей
     for (var i = 0; i < fields.length; i++) {
         // Получаем элемент input по id
         var input = document.getElementById(fields[i].toLowerCase() + "-input-" + number);
         // Убираем элемент input из fieldset
         fieldset.removeChild(input);
     }
     
     // Убираем элемент button по id
     var button = document.getElementById("remove-" + number);
     fieldset.removeChild(button);
}


