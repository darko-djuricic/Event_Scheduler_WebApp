var users = [];
var accessToken = ""
var eventsForLogged = [];
var loggedUser = null;

$(document).ready(function () {
  $.get("/api/get/users", (data) => {
    //GETING ALL USERS
    users = data

    //GETTING LOGGED USER
    $.get("/api/logged", (data) => {
      $(".container").toggleClass("disableCalendar");
      loggedUser = data;
      //ALL EVENTS OF LOGGED USER SORT ASC BY DATE
      eventsForLogged = users.filter(
                  el => el.username == loggedUser.username 
                  && el._id == loggedUser._id)[0].events
      fillEvents()
      $("#formLogin").html(`
          <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle mr-3" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            ${data.username}
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" href="#myEvents">My Events</a>
              <button id="#bntLogout" class="dropdown-item" type='submit'>Logout</a>
          </div>
        </div>`)
    })
      .catch((result) => {
        //MESSAGE IF USER IS NOT LOGGED AND HIDING MY EVENTS SECTION
        $(".disableCalendar")
          .before("<div class='h2 container mt-5 text-center text-danger p-3'>You need to login to user event scheduler</div>");
        $("#myEventsSection").hide();
      })
  })

});