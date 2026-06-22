document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".product-card");

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.style.transition = "0.3s ease";
        });

    });

document.querySelector(".next-btn").addEventListener("click", function () {
    window.location.href = "page2.html";
});

});

