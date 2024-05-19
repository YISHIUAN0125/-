let Media = document.getElementsByClassName('Media');
let Food = document.getElementsByClassName('Food');
let Money = document.getElementsByClassName('Money');
let Travel = document.getElementsByClassName('Travel');
let Fashion = document.getElementsByClassName('Fashion');
let logo = document.getElementsByClassName('logo');

Media[0].addEventListener('click',web2_);
Food[0].addEventListener('click',web2_);
Money[0].addEventListener('click',web2_);
Travel[0].addEventListener('click',web2_);
Fashion[0].addEventListener('click',web2_);
logo[0].addEventListener('click',web1_);

function web2_(){
    window.location.href = "/web_2";
}
function web1_(){
    window.location.href = "/web_1";
}
function login(){
    window.location.href = "/login";
}
function signup(){
    window.location.href = "/signup";
}