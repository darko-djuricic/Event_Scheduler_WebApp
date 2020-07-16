//GENERATING YEAR RANGE
function generate_year_range(start, end) {
  var years = "";
  for (var year = start; year <= end; year++) {
    years += "<option value='" + year + "'>" + year + "</option>";
  }
  return years;
}
//ENABLING BOOTSTRAP'S POPOVER 
$(function () {
  $('[data-toggle="popover"]').popover()
})

var today = new Date();
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();
var selectYear = document.getElementById("year");
var selectMonth = document.getElementById("month");


var createYear = generate_year_range(1970, 2050);

document.getElementById("year").innerHTML = createYear;

var calendar = document.getElementById("calendar");
var lang = calendar.getAttribute('data-lang');

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var dayHeader = "<tr>";
for (day in days) {
  dayHeader += "<th data-days='" + days[day] + "'>" + days[day] + "</th>";
}
dayHeader += "</tr>";

document.getElementById("thead-month").innerHTML = dayHeader;


monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


//NEXT MONTH CALENDAR
function next() {
  currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}

//PREVIOUS MONTH CALENDAR
function previous() {
  currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}
//JUMPIN ON PICKED YEAR AND MONTH
function jump() {
  currentYear = parseInt(selectYear.value);
  currentMonth = parseInt(selectMonth.value);
  showCalendar(currentMonth, currentYear);
}

//SHOWING CALENDAR FOR GIVEN MONTH OR YEAR
function showCalendar(month, year) {
  var firstDay = (new Date(year, month)).getDay();
  tbl = document.getElementById("calendar-body");
  tbl.innerHTML = "";

  monthAndYear.innerHTML = months[month] + " " + year;
  selectYear.value = year;
  selectMonth.value = month;

  //CREATING ALL CELLS
  var date = 1;
  for (var i = 0; i < 6; i++) {
    var row = document.createElement("tr");

    for (var j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cell = document.createElement("td");
        cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
      } else if (date > daysInMonth(month, year)) {
        break;
      } else {
        cell = document.createElement("td");
        cell.setAttribute("data-day", date);
        cell.setAttribute("data-month", month + 1);
        cell.setAttribute("data-year", year);
        cell.setAttribute("data-month_name", months[month]);
        let finalDate = new Date(`${year}-${month + 1}-${date}`);
        cell.addEventListener('click', function () {
          dateOnClick(finalDate.toISOString().substring(0, 10))
        });
        finalDate.setUTCDate(finalDate.getUTCDate() + 1)
        cell.setAttribute("data-date", finalDate.toISOString().substring(0, 10))
        cell.className = "date-picker";
        cell.innerHTML = "<span>" + date + "</span>";

        if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
          cell.className = "date-picker selected";
        }
        row.appendChild(cell);
        date++;
      }
    }

    tbl.appendChild(row);
  }
  fillEvents()
}

//RETURNS DAYS OF GIVEN MONTH AND YEAR
function daysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth, 32).getDate();
}

//FILLING CALENDAR WITH EVENTS AND POPOVERS
function fillEvents() {
  console.log(eventsForLogged);
  eventsForLogged.forEach(el => {
    let selector = `[data-date=${el.date}]`;
    let date=new Date(el.date)
    let today=new Date()
    let isUpcoming = date.getTime() > today.getTime();
    let isToday = date.getUTCDate() == today.getUTCDate()
                  && date.getMonth() == today.getMonth();
    $(selector)
      .css("background-color", isToday || isUpcoming ? '#28B463' : '#77b9d4')
      .css('color', 'white')
      .popover('dispose')
      .popover({
        trigger: 'hover',
        title: el.title,
        content: el.description,
        placement: 'top'
      })
      .addClass('event')
  });
  allEvents()
}

//FILLING USER'S EVENTS AND UPCOMING USER'S EVENTS
function allEvents() {
  //FILTERING UPCOMING EVENTS
  let upcoming = eventsForLogged.filter(el => new Date(el.date).getTime() > new Date().getTime())
  let allEvents=eventsForLogged.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  let print = ""
  $("#today").html("");
  $("#upcomingEvents").html("")
  $("#myEvents").html("");
  //MY EVENTS
  allEvents.forEach(el => {
    let date = new Date(el.date);
    let today = new Date()
    let dateBool = date.getTime() > today.getTime();
    let todayBool = date.getUTCDate() == today.getUTCDate()
                  && date.getMonth() == today.getMonth();
    let color = todayBool || dateBool ? "success" : "info";

    if(todayBool){
      $("#today").html(`
      <a href='#' onclick='linkEvent("${el.date}",${date.getMonth()}, ${date.getFullYear()})'>
        <li>
            <h5 class='font-weight-bold'>${el.title}<br>${date.toLocaleDateString()}</h5>
            <p>${el.description}</p>
        </li>
      </a>`)
    }
    print += `<div id='s' class="container p-3 border">
              <h5 class="font-weight-bold">
              ${el.title} - ${el.date}
              <div class="float-none mr-2 float-md-right text-${color}">
                  <i class='text-center'>
                    ${todayBool?"Today":dateBool ? "Upcoming" : "Recent"}
                  </i>
              </div>
              </h5>
              <div class='row'>
                <div class='col-md-8'>
                  <p>${el.description}</p>
                </div>
                <div class='col-md-4'>
                  <div class="float-none float-md-right">
                    <button onclick="dateOnClick('${el.date}')" class='btn btn-outline-secondary mt-5' type='button'>
                      Delete / Update
                    </button>
                  </div>
                </div>
              </div>
            </div>`
  })
  $("#myEvents").html(print)
  print = ""
  //UPCOMING EVENTS
  upcoming.forEach(el => {
    let date = new Date(el.date);
    print += `<a href='#' onclick='linkEvent("${el.date}",${date.getMonth()}, ${date.getFullYear()})'>
              <li>
                  <h5 class='font-weight-bold'>${el.title}<br>${date.toLocaleDateString()}</h5>

                  <p>${el.description}</p>
              </li>
            </a>`
  });
  $("#upcomingEvents").html(
    `<ul>${print}</ul>`
  )

}

//ON CLICK OF LINK EVENT, THIS METHOD DISPLAYS CERTAIN EVENT
function linkEvent(date, month, year) {
  $(`[data-date]`).popover('dispose')
  showCalendar(month, year)
  $(`[data-date=${date}]`)
    .popover('show')
}

//ADDING CERTAIN BUTTONS ON EVENT MODAL BASED ON THEIR PURPOSE
function eventFunctionalites(insert = true) {
  isInsert = insert;
  $("#btnEventModal").html(
    `<button class="btn btn-primary" type="button">
        ${insert ? "Add event" : "Update event"}
      </button>`
  )
  $("#btnDeleteEvent").html(
    insert ? ""
      : `<button class="btn btn-secondary" type="button">Delete event</button>`
  )
}
let pickedDate = "";
let isInsert = false;
let foundedEvent = null;

//FILLING FORM OF EVENT MODAL IF IT'S EXISTING EVENT
function dateOnClick(date) {
  pickedDate = date
  foundedEvent = eventsForLogged.find(el => el.date == pickedDate)
  $("#eventTitle").val(!foundedEvent ? "" : foundedEvent.title)
  $("#eventDesc").val(!foundedEvent ? "" : foundedEvent.description)
  eventFunctionalites(foundedEvent ? false : true)
  $('#eventModal').modal('show')
};

//INSERT OR UPDATE EVENT
$("#btnEventModal").click(() => {
  let title = $("#eventTitle").val()
  let description = $("#eventDesc").val();
  //CHECK IF TITLE IS INSERETD
  if (title) {
    $("#eventTitle").removeClass(`is-invalid`)
    let object = { title: title, description: description, date: pickedDate };
    //CHECK IF WE NEED TO INSERT OR UPDATE
    if (isInsert) {
      //EXECUTE INSERT
      $.get("/api/insert/event", object, (data, status) => {
        eventsForLogged.push(object)
        fillEvents();
        $("#eventModal").modal('hide')
        return alert(data);
      })
    }
    //UPDATE
    else {
      //CHECK IF CHANGES HAVE BEEN MADED
      if (title.trim() == foundedEvent.title.trim() && description.trim() == foundedEvent.description.trim())
        return alert("No changes have been made")
      else {
        $.get("/api/update/event", object, (data, status) => {
          let index = eventsForLogged.findIndex(el => el.date == foundedEvent.date)
          eventsForLogged[index] = object;
          fillEvents();
          $("#eventModal").modal('hide')
          return alert(data);
        })
      }
    }
  }
  else
    $("#eventTitle").addClass(`is-invalid`)

});

//DELETE EVENT
$("#btnDeleteEvent").click(function () {
  $.get('/api/delete/event', foundedEvent, (data, status) => {
    let index = eventsForLogged.findIndex(el => el.title == foundedEvent.title && el.date == foundedEvent.date)
    eventsForLogged.splice(index, 1)
    $(`[data-date=${foundedEvent.date}]`)
      .css("background-color", "white")
      .css('color', 'gray')
      .popover('dispose')
      .removeClass('event');
    fillEvents()
    alert(data);
    $("#eventModal").modal('hide')
  })

});
