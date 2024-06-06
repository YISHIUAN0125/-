let Media = document.getElementsByClassName('Media');
let Food = document.getElementsByClassName('Food');
let Money = document.getElementsByClassName('Money');
let Travel = document.getElementsByClassName('Travel');
let Fashion = document.getElementsByClassName('Fashion');
let logo = document.getElementsByClassName('logo');
let motor_works = document.getElementsByClassName('motor_works');

function randomRedirect() {
    var pages = ['/media', '/food', '/travel', '/fashion'];
    var randomPage = pages[Math.floor(Math.random() * pages.length)];
    window.location.href = randomPage;
}


Food[0].addEventListener('click',food_);
Money[0].addEventListener('click',web2_);
Travel[0].addEventListener('click',travel_);
Fashion[0].addEventListener('click',fashion_);
logo[0].addEventListener('click',web1_);
motor_works[0].addEventListener('click',web2_);

function randomMediaRedirect() {
    var mediaPages = [
        'https://gpss3.tipo.gov.tw/gpsskmc/gpssbkm?@@0.9417913543552274',
        'https://www.epo.org/en',
        "/food",
        "/travel",
        "https://www.gfbzb.gov.cn/"

    ];
    var randomPage = mediaPages[Math.floor(Math.random() * mediaPages.length)];
    window.location.href = randomPage;
}

function food_(){
    window.location.href="/food";
}

function travel_(){
    window.location.href="/travel";
}

function fashion_(){
    window.location.href="/fashion";
}


function web2_(){
    window.location.href = "/web_2";
}
function web1_(){
    window.location.href = "/";
}
function login(){
    window.location.href = "/login";
}
function signup(){
    window.location.href = "/signup";
}