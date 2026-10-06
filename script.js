function togglePassword(id){

let input=document.getElementById(id);

if(input.type==="password")
input.type="text";
else
input.type="password";

}

function signup(){

let firstName=document.getElementById("firstName").value.trim();

let lastName=document.getElementById("lastName").value.trim();

let dob=document.getElementById("dob").value;

let email=document.getElementById("email").value.trim();

let phone=document.getElementById("phone").value.trim();

let password=document.getElementById("password").value;

let confirm=document.getElementById("confirmPassword").value;

if(firstName==""||lastName==""||dob==""||email==""||phone==""||password==""||confirm==""){

alert("Please fill all fields");

return;

}

let emailPattern=/^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

if(!email.match(emailPattern)){

alert("Invalid Email");

return;

}

let phonePattern=/^[0-9]{10}$/;

if(!phone.match(phonePattern)){

alert("Phone must be 10 digits");

return;

}

if(password.length<6){

alert("Password must be at least 6 characters");

return;

}

if(password!=confirm){

alert("Passwords do not match");

return;

}

let user={

firstName,

lastName,

dob,

email,

phone,

password

};

localStorage.setItem("user",JSON.stringify(user));

alert("Signup Successful");

window.location.href="index.html";

}

function login(){

let email=document.getElementById("loginEmail").value;

let password=document.getElementById("loginPassword").value;

let user=JSON.parse(localStorage.getItem("user"));

if(user==null){

alert("No account found");

return;

}

if(email==user.email && password==user.password){

localStorage.setItem("loggedInUser",JSON.stringify(user));

alert("Login Successful");

window.location.href="home.html";

}

else{

alert("Invalid Email or Password");

}

}