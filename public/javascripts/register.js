//GLOBAL JSON FOR VALIDATING FIELDS OF REGISTRATION
let check = { username: false, password: false, repassword: false };
//REGEX FOR PASSWORD VALIDATION
const regex = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])(?=.{8,}).*/
let username, password, repassword;
$(document).ready(function () {
   //CHANGING VIEW OF VALID/INVALID INPUT
   function GoodOrNot(selector, bool) {
      $(selector).attr("class", `form-control is-${bool ? "valid" : "invalid"}`)
   }

   //CHECKING USERNAME INPUT WHILE TYPING
   $("#usernameRegister").keyup(() => {
      username = $("#usernameRegister").val()
      let bool = !users.some((el) => el.username == username) && username.length > 5
      check.username = bool
      $("#userInvalid").text(username.length < 6 ? "Too short" : "Username taken")
      GoodOrNot("#usernameRegister", bool)
   });

   //CHECKING PASSWORD INPUT WHILE TYPING
   $("#password2").keyup(() => {
      password = $("#password2").val();
      const bool = regex.exec(password) != null;
      check.password = bool
      GoodOrNot("#password2", bool)
      confirmPasswd();
   });

   $("#repassword2").keyup(confirmPasswd);

   //CHECKING CONFIRM PASSWORD INPUT WHILE TYPING
   function confirmPasswd() {
      repassword = $("#repassword2").val();
      if (repassword != "") {
         let bool = check.password && (repassword == password);
         console.log(bool);
         check.repassword = bool;
         GoodOrNot("#repassword2", bool)
      }
   }

   //REGISTRATION
   $("#btnRegister").click(() => {
      //IF FIELDS ARE NOT EMPTY AND VALID, SEND USER FOR INSERTING
      if (username && password && repassword) {
         if (!Object.values(check).includes(false)) {
            $.post("/api/insert/user", { username: username, password: password }, (data) => {
               alert("You have been registered successfully")
               window.location = '/'
            }
            );
         }
      }
      else alert("All fields are required")
   })
});