function toggleModal(show) {
    const modal = document.getElementById("text-modal");
    const input = document.getElementById("modal-input");

    if (show) {
        modal.classList.remove("hidden");
        input.focus();
    } else {
        modal.classList.add("hidden");
        input.value = "";
        input.blur();
    }
}

function sendModalText() {
    const input = document.getElementById("modal-input");
    const text = input.value;

    if (text.length > 0) {
        sendBinaryEvent(EVENTS.TEXT, String(text), sendType.string);
    }

    toggleModal(false);
}

document.getElementById("modal-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        sendModalText();
    }
});