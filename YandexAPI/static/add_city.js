// Функция, которая добавляет поля для ввода еще одного города
function addCity() {
    // Получаем ссылку на fieldset, куда будем добавлять поля
    var fieldset = document.querySelector("fieldset:last-of-type");
    // Создаем счетчик для генерации уникальных id и name
    var counter = fieldset.querySelectorAll("input").length / 3 + 3;
    // Создаем массив с названиями полей
    var fields = ["country", "region", "city"];
    var placeholders = ["Страна", "Регион", "Город"];
    // Проходим по массиву с названиями полей
    for (var i = 0; i < fields.length; i++) {
        // Создаем элемент input
        var input = document.createElement("input");
        // Задаем атрибуты input
        input.id = fields[i].toLowerCase() + "-input-" + counter;
        input.name = fields[i].toLowerCase() + "-" + counter;
        input.type = "text";
        // input.list = fields[i].toLowerCase() + "-list";
        input.setAttribute("list",fields[i].toLowerCase() + "-list");
        input.placeholder = placeholders[i];
        input.required = true;
        // Добавляем input в fieldset
        fieldset.appendChild(input);
    }
    // Добавляем элемент <br> для переноса строки
    var br = document.createElement("br");
    fieldset.appendChild(br);
}
