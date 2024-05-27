const clear = document.getElementById('clear') as HTMLElement;

clear.addEventListener('click', () => {
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        console.error("Contexto no disponible");
    }
});
