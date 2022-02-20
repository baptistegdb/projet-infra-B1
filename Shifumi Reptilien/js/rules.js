function displayRules() {
    document.getElementsByClassName("popup-background")[0].classList.remove("hidden");
    document.getElementById("welcome").classList.add("popup-opened");
}

function closeRules() {
    document.getElementsByClassName("popup-background")[0].classList.add("hidden");
    document.getElementById("welcome").classList.remove("popup-opened");
}