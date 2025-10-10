const slidePage = document.querySelector(".slide-page");
const nextBtnFirst = document.querySelectorAll(".next-btn");
const prevBtnSec = document.querySelector(".prev-1");
const nextBtnSec = document.querySelector(".next-1");
const prevBtnThird = document.querySelector(".prev-2");
const nextBtnThird = document.querySelector(".next-2");
const submitBtn = document.querySelector(".submit");
const progressText = document.querySelectorAll(".step p");
const progressCheck = document.querySelectorAll(".step .check");
const bullet = document.querySelectorAll(".step .bullet");
let current = 1;

nextBtnFirst.forEach(button => {
    button.addEventListener("click", function(event){
      event.preventDefault();
      slidePage.style.marginLeft = "-33.33%";
      bullet[current - 1].classList.add("active");
      current += 1;
    });
});


const deviceIcons = document.querySelectorAll('.device');
deviceIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        const deviceType = icon.getAttribute('data-device');
        document.getElementById('login-title').textContent = `Your ${deviceType} Login Instructions`;
        document.querySelector('.device-name').textContent = deviceType;

        slidePage.style.marginLeft = "-66.66%";
        bullet[current - 1].classList.add("active");
        current += 1;
    });
});


prevBtnSec.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "0%";
  bullet[current - 2].classList.remove("active");
  current -= 1;
});

prevBtnThird.addEventListener("click", function(event){
  event.preventDefault();
  slidePage.style.marginLeft = "-33.33%";
  bullet[current - 2].classList.remove("active");
  current -= 1;
});

const copyButtons = document.querySelectorAll('.btn-copy');
copyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.getAttribute('data-copy');
        const textToCopy = document.getElementById(type).textContent;

        navigator.clipboard.writeText(textToCopy).then(() => {
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });
    });
});
