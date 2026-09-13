function sendFile(file) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const reader = new FileReader();
    
    reader.onload = function(e) {
        const fileBytes = new Uint8Array(e.target.result);
        
        const nameBytes = textEncoder.encode(file.name);
        const nameLen = nameBytes.length;
        
        const totalSize = 2 + 2 + nameLen + fileBytes.length;
        const buffer = new ArrayBuffer(totalSize);
        const view = new DataView(buffer);
        
        view.setInt16(0, 7, true);
        
        view.setInt16(2, nameLen, true);
        
        const destNameArray = new Uint8Array(buffer, 4, nameLen);
        destNameArray.set(nameBytes);
        
        const destFileArray = new Uint8Array(buffer, 4 + nameLen);
        destFileArray.set(fileBytes);
        
        ws.send(buffer);
        console.log(`Файл ${file.name} отправляется на ПК...`);
    };

    reader.readAsArrayBuffer(file);
}

// <input type="file" id="file-input">
document.getElementById("file-input").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
        sendFile(file);
    }
});
