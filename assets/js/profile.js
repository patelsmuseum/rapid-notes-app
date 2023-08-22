var id = window.location.href;
id = id.substring(id.indexOf('profile')+8);
console.log(id);
window.localStorage.setItem("user_id", id);