$(document).ready(function () {
    //LOGGING
    $("#btnSubmit").click(() => {
        //SPINNER WHILE WAITING FOR RESPONSE OF SERVER
        $("#logHelp").html(`<div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>`);

        let username=$("#username").val().trim();
        let password= $("#password1").val();

        //CHECK IF USERNAME OR PASSWORD FIELDS ARE EMPTY
        if(!username || !password){
            $("#logHelp").html(`<div class="text-danger">All fields must be filled</div>`);
            return;
        }

        //CHECK IF USER EXISTS
        if(!users.map(el=>el['username']).includes(username)){
            $("#logHelp").html(`<div class="text-danger">Couldn't find your account</div>`);
            return;    
        }

        $.ajax({
            type: "POST",
            url: "/api/login",
            data: { username: username, password: password, rememberMe: $("#checkRemember").prop('checked')},
            success: function (data) {
                if (data!=null) 
                    window.location="/"
                else
                    $("#logHelp").html(`<div class="text-danger">Wrong password</div>`);
            },
            timeout: 6000
        })
        .catch((e) => {
                if (e.statusText == 'timeout'){
                    $("#logHelp").html(`<div class="text-danger">Something went wrong. Try again later</div>`);
                }
      });
    });
});