document.addEventListener('DOMContentLoaded', () => {
    const slidePage = document.querySelector(".slide-page");
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtnSec = document.querySelector(".prev-1");
    const prevBtnThird = document.querySelector(".prev-2");
    const bullets = document.querySelectorAll(".step .bullet");
    const deviceIcons = document.querySelectorAll('.device');
    const copyButtons = document.querySelectorAll('.btn-copy');

    let current = 1;

    nextBtns.forEach(button => {
        button.addEventListener("click", () => {
            slidePage.style.marginLeft = "-33.33%";
            bullets[current - 1].classList.add("active");
            current++;
        });
    });

    deviceIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const deviceType = icon.getAttribute('data-device');
            document.getElementById('login-title').textContent = `Your ${deviceType} Login Instructions`;
            document.querySelector('.device-name').textContent = deviceType;

            slidePage.style.marginLeft = "-66.66%";
            bullets[current - 1].classList.add("active");
            current++;
        });
    });

    prevBtnSec.addEventListener("click", () => {
        slidePage.style.marginLeft = "0%";
        bullets[current - 2].classList.remove("active");
        current--;
    });

    prevBtnThird.addEventListener("click", () => {
        slidePage.style.marginLeft = "-33.33%";
        bullets[current - 2].classList.remove("active");
        current--;
    });

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.getAttribute('data-copy');
            const textToCopy = document.getElementById(type).textContent;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalIcon = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    button.innerHTML = originalIcon;
                }, 2000);
            });
        });
    });
});
