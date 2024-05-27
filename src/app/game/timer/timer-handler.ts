let timeLeft: number = 99;

function countdown() {
    timeLeft--;
    const timeElement = document.getElementById("time");
    if (timeElement) {
        timeElement.innerHTML = String(timeLeft);
    } else {
        console.error("Elemento 'time' no encontrado");
    }
    if (timeLeft > 0) {
        setTimeout(countdown, 1000);
    }
}

setTimeout(countdown, 1000);
