let logo = document.getElementsByClassName('logo');
let motor_works = document.getElementsByClassName('motor_works');


logo[0].addEventListener('click',web1_);
motor_works[0].addEventListener('click',web2_);


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