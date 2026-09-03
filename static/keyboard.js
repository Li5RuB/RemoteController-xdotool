const Keyboard = window.SimpleKeyboard.default;
let shiftPressed = false;
let langPressed = false;

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
            "ф ы в а п р о л д ж",
            "я ч с м и т ь б ю",
            "{lang} {shift} {space} {bksp} {enter}"],
        russian_shift: [
            "Й Ц У К Е Н Г Ш Щ З Х Ъ",
            "Ф Ы В А П Р О Л Д Ж Э",
            "Я Ч С М И Т Ь Б Ю",
            "{lang} {shift} {space} {bksp} {enter}"]
    },
    display: {
        "{enter}": "⏎",
        "{bksp}": "⌫",
        "{shift}": "⇧",
        "{space}": "␣",
        "{lang}": "🌐"
    }
});

function handleKeyboardInput(button) {
    let payload = null;

    let sendKey = button;
    let sendType = "text";

    console.log(JSON.stringify({ type: sendType, key: sendKey }))

    if (button === "{bksp}") { sendKey = "BackSpace"; sendType = "key"; }
    if (button === "{space}") { sendKey = "space"; sendType = "key"; }
    if (button === "{shift}") {
        handleShiftToggle();
        return;
    };
    if (button === "{enter}") { sendKey = "Return"; sendType = "key"; }
    if (button === "{lang}") {
        handleLangSwich()
        return;
    };

    console.log(JSON.stringify({ type: sendType, key: sendKey }))
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

function setLayout() {
    keyboard.setOptions({
        layoutName: (langPressed ? "russian" : "default") + (shiftPressed ? "_shift" : "")
    });
};
