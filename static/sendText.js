function toggleModal(show) {
    const modal = document.getElementById("text-modal");
    const input = document.getElementById("modal-input");

    if (show) {
        modal.classList.remove("hidden");
        setTimeout(() => {
            input.focus();
        }, 100);
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
        console.log(JSON.stringify({ type: "text", key: text }));
        ws.send(JSON.stringify({ type: "text", key: text }));
    }

    //toggleModal(false);
}

document.getElementById("modal-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        sendModalText();
    }
});