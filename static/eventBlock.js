document.addEventListener('touchend', function (event) {
    if (event.target.closest('button') || 
        event.target.closest('.hg-button') || 
        event.target.closest('#modal-input')) {
        
        return;
    }
    event.preventDefault();
}, { passive: false });