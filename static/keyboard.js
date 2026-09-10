const Keyboard = window.SimpleKeyboard.default;
let shiftPressed = false;
let langPressed = false;

let buttonStates = {};

const layoutTypes = {
    keyboard: "keyboard",
    navigation: "navigation",
    nums: "nums"
}

const layoutsList = [layoutTypes.keyboard, layoutTypes.navigation, layoutTypes.nums];

let layoutType = layoutTypes.keyboard;

const keyboard = new Keyboard({
    onChange: input => { },
    onKeyPress: button => {
        handleKeyboardInput(button);
    },
    layout: {
        default: [
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "z x c v b n m",
            "{lang} {shift} {space} {bksp} {enter}"
        ],
        default_shift: [
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "Z X C V B N M",
            "{lang} {shift} {space} {bksp} {enter}"
        ],
        russian: [
            "й ц у к е н г ш щ з х ъ",
            "ф ы в а п р о л д ж э",
            "я ч с м и т ь б ю",
            "{lang} {shift} {space} {bksp} {enter}"],
        russian_shift: [
            "Й Ц У К Е Н Г Ш Щ З Х Ъ",
            "Ф Ы В А П Р О Л Д Ж Э",
            "Я Ч С М И Т Ь Б Ю",
            "{lang} {shift} {space} {bksp} {enter}"],
        navigation: [
            "{up}",
            "{left} {space} {right}",
            "{down}"
        ],
        nums:[
            "7 8 9 +",
            "4 5 6 {enter}",
            "1 2 3 0",
        ]
    },
    display: {
        "{enter}": "⏎",
        "{bksp}": "⌫",
        "{shift}": "⇧",
        "{space}": "␣",
        "{lang}": "🌐",
        "{up}": "▲",
        "{down}": "▼",
        "{left}": "◀",
        "{right}": "▶"
    }
});

function handleKeyboardInput(button) {
    let sendKey = button;
    let sendType = "text";

    console.log(JSON.stringify({ type: sendType, key: sendKey }));

    switch (button) {
        case "{shift}":
            handleShiftToggle();
            return;

        case "{lang}":
            handleLangSwich();
            return;

        // Клавиши управления текстом
        case "{bksp}":
            sendKey = "BackSpace";
            sendType = "key";
            break;

        case "{space}":
            sendKey = "space";
            sendType = "key";
            break;

        case "{enter}":
            sendKey = "Return";
            sendType = "key";
            break;

        // Стрелочки навигации
        case "{up}":
            sendKey = "Up";
            sendType = "key";
            break;

        case "{down}":
            sendKey = "Down";
            sendType = "key";
            break;

        case "{left}":
            sendKey = "Left";
            sendType = "key";
            break;

        case "{right}":
            sendKey = "Right";
            sendType = "key";
            break;

        // Все остальные кнопки (буквы) по умолчанию остаются text
        default:
            break;
    }

    let modes = getActiveModifiers()

    if(modes){
        sendType = "key";
        sendKey = modes + "+" + sendKey;
    }

    console.log(JSON.stringify({ type: sendType, key: sendKey }));
    ws.send(JSON.stringify({ type: sendType, key: sendKey }));
}

function handleShiftToggle() {
    shiftPressed = !shiftPressed;
    setLayout();
}

function handleLangSwich() {
    langPressed = !langPressed;
    setLayout();
}

function swapLayoutType(){
    let currentLayoutIndex = layoutsList.indexOf(layoutType)

    currentLayoutIndex = (currentLayoutIndex + 1) % layoutsList.length;

    layoutType = layoutsList[currentLayoutIndex];
    setLayout();
}

function setLayout() {
    if (layoutType == layoutTypes.keyboard) {
        keyboard.setOptions({
            layoutName: (langPressed ? "russian" : "default") + (shiftPressed ? "_shift" : "")
        })
        return;
    }

    keyboard.setOptions({
        layoutName: (layoutType)
    })
};

document.querySelectorAll(".pad-btn").forEach(btn => {
    const id = btn.id;
    buttonStates[id] = false; 

    btn.addEventListener("touchstart", e => {
        e.preventDefault();  
        e.stopPropagation(); 
        buttonStates[id] = true;
        btn.classList.add("active");
    }, { passive: false });

    btn.addEventListener("touchend", e => {
        e.preventDefault();
        e.stopPropagation();
        buttonStates[id] = false;
        btn.classList.remove("active");
    }, { passive: false });
});

function getActiveModifiers() {
    return Object.entries(buttonStates)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join("+");
}