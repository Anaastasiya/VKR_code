<script>
    
    var countrySelect = document.getElementById("country");
    var fromSelect = document.getElementById("from");
    var toSelect = document.getElementById("to");
    var inputField = document.getElementById("stations");
    var ulField = document.getElementById("suggestions");
    var stations;
    
    inputField.addEventListener("input", changeAutoComplete);
    
    countrySelect.addEventListener("change", function() {
      
      var countryCode = countrySelect.value;
      console.log("countryCode: "+countryCode);
      
      if (countryCode) {

        
        var xhr = new XMLHttpRequest();        
        xhr.open("GET", "/stations?country_code=" + countryCode, true);
        
        xhr.onload = function() {
          
        if (xhr.status === 200) {            
            stations = JSON.parse(xhr.responseText);
            console.log(stations)
        }
        else {        
        console.error("Ошибка при получении списка станций: " + xhr.status);
        }
  };
  
    xhr.send();
}
else {
  
  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";
}
});

function changeAutoComplete({ target }) {

let data = target.value;


ulField.innerHTML = "";


if (data.length) {
 
  let autoCompleteValues = [];

  
  for (let key of Object.keys(stations)) {
    
    if (key.toLowerCase().startsWith(data.toLowerCase())) {
      console.log(key);
      autoCompleteValues.push(key);
    }
  }

 
  if (autoCompleteValues.length) {
    for (let value of autoCompleteValues) {
      
      let li = document.createElement("li");
      li.textContent = value;
      li.setAttribute("data-city", stations[value]);

      
      ulField.appendChild(li);
    }
  }
}
}


function selectItem({ target }) {
// Если кликнули по элементу li, то заполняем поле ввода его текстом и выводим город в консоль
if (target.tagName === "LI") {
  inputField.value = target.textContent;
  console.log(target.getAttribute("data-city"));
}
}


document.querySelector("form").addEventListener("submit", function(event) {

event.preventDefault();

var fromCode = fromSelect.value;
var toCode = toSelect.value;
var date = document.getElementById("date").value;

if (fromCode && toCode && date) {
  
  var xhr = new XMLHttpRequest();
  
  xhr.open("GET", "/results?from=" + fromCode + "&to=" + toCode + "&date=" + date, true);
  
  xhr.onload = function() {
    
    if (xhr.status === 200) {
      
      var trains = JSON.parse(xhr.responseText);
      
      console.log(trains)
      var table = document.getElementById("table");
      
      table.innerHTML = "";
      
      var headerRow = document.createElement("tr");
      var headerCells = ["Номер поезда", "Отправление", "Прибытие", "Время в пути"];
      for (var i = 0; i < headerCells.length; i++) {
        var headerCell = document.createElement("th");
        headerCell.textContent = headerCells[i];
        headerRow.appendChild(headerCell);
      }
      table.appendChild(headerRow);
      
      for (var i = 0; i < trains.length; i++) {
        var train = trains[i];
        var row = document.createElement("tr");
        var cells = [train.thread.number, train.departure, train.arrival, train.duration];
        for (var j = 0; j < cells.length; j++) {
          var cell = document.createElement("td");
          cell.textContent = cells[j];
          row.appendChild(cell);
        }
        table.appendChild(row);
      }
    }
    else {
      
      console.error("Ошибка при получении списка поездов: " + xhr.status);
    }
  };
  
  xhr.send();
}
});
</script>
