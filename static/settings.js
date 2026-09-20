let settings = null;
let defaultSettings = {
            "shiftPressed": false,
            "langPressed": false,
            "layoutType": "keyboard",
        }

init()

function init(){
    const raw = localStorage.getItem("settings");
    settings = raw ? JSON.parse(raw) : defaultSettings
}

function GetSettings(key){
    return settings[key];
}

function SetSettings(key, value){
    settings[key] = value
    localStorage.setItem("settings", JSON.stringify(settings))
}