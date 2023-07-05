function loadRegions(callback) { // загрузка данных через ajax (xmltttprequest)
    let xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', 'dataBase.json', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) { // проверка статуса
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(null);
}

const filterForRegions = (zones, searchText) =>{
    return zones.filter(function (zone) {
        return zone.name.toLowerCase().startsWith(searchText.toLowerCase()); // фильтрация регионов
    });
}

const displayRegions = (zones) =>{
    let zoneList = document.getElementById('zoneList');
    zoneList.innerHTML = '';
    zones.forEach(function (region) {
        let listItem = document.createElement('li');
        listItem.textContent = region.name;
        listItem.addEventListener('click', function () {
            addRegionInFavorites(region);
        });
        zoneList.appendChild(listItem);
    });
}

// добавляем регион в избранные
const  addRegionInFavorites = (region) => {
    let selectedZones = document.getElementById('selectedZones');
    // проверка на то то что регион уже находится в добавленных
    let existingZone = Array.from(selectedZones.children)
        .find(function (item) {
            return item.textContent === region.name;
    });
    // если такая область уже есть в добавленных уходим из функции
    if (existingZone) {
        alert(region.name + ' уже была добавленна ранее!' ); // сообщение на экран браузера
        return;
    }
    let listItem = document.createElement('li');
    listItem.textContent = region.name;
    listItem.addEventListener('click', function () {
        removeRegionFromFavorites(region);
    });
    selectedZones.appendChild(listItem);
    saveSelectedRegions();
}

// удаление из добавленных
const removeRegionFromFavorites = (region) => {
    let selectedZones = document.getElementById('selectedZones');
    let items = selectedZones.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        if (items[i].textContent === region.name) {
            selectedZones.removeChild(items[i]);
            saveSelectedRegions();
            break;
        }
    }
}

// сохранение в куки
const saveSelectedRegions = () => {
    let selectedZones = [];
    let items = document.getElementById('selectedZones')
        .getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        selectedZones.push(items[i].textContent);
    }
    document.cookie = 'selectedZones=' + JSON.stringify(selectedZones);
}

// выгрузка из куков
const loadSelectedZones = () => {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith('selectedZones=')) {
            let selectedZones = JSON.parse(cookie.substring('selectedZones='.length));
            selectedZones.forEach(function (zoneName) {
                let zone = { name: zoneName };
                addRegionInFavorites(zone);
            });
        }
    }
}

// вытягиваем из поля поиска текст и отправляем в функцию фильтрации затем в функцию отображения
let searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function () {
    let searchText = searchInput.value;
    let filteredZones = filterForRegions(regions, searchText);
    displayRegions(filteredZones);
});

// загружаем данные и отображаем их в списке
let regions = [];
loadRegions(function (data) {
    regions = data;
    displayRegions(regions);
    loadSelectedZones();
});