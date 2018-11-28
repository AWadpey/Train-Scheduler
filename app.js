
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyArNHW7CMDpRcLOMr-UMHODe6fZ5m1fZKs",
    authDomain: "train-timer-eaa94.firebaseapp.com",
    databaseURL: "https://train-timer-eaa94.firebaseio.com",
    projectId: "train-timer-eaa94",
    storageBucket: "train-timer-eaa94.appspot.com",
    messagingSenderId: "931545718416"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();

  var tMinutesTillTrain = 0;

  //Show and update current time. Use setInterval method to update time.
  function displayRealTime() {
  setInterval(function(){
      $('#current-time').html(moment().format('hh:mm:ss A'))
    }, 1000);
  }
  displayRealTime();

// button for adding train
$("#submit-btn").on("click", function(event) {
    event.preventDefault();
    collectData();
});
    // grab the user input
    // var trainName = $("#trainName").val().trim();
    // var sendLocation = $("#userDestination").val().trim();
    // var firstSend = $("#1stTrain").val().trim();
    // var trainInterval = $("#frequent").val().trim();


    // temporary data holder
    function collectData() {
    var newTrain = {
        name: $("#trainName").val().trim(),
        destination: $("#userDestination").val().trim(),
        start: $("#1stTrain").val().trim(),
        freq: $("#frequent").val().trim()
    };

// upload the train data to database:
    database.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.freq);

    alert("Train has successfully been added!");

    // clear text boxes
    $("#trainName").val("");
    $("#userDestination").val("");
    $("#1stTrain").val("");
    $("#frequent").val("");
};

database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    var newTrain = childSnapshot.val();
    // var trainName = childSnapshot.val().name;
    // var sendLocation = childSnapshot.val().destination;
    // var firstSend = childSnapshot.val().start;
    // var trainInterval = childSnapshot.val().freq;

    // console.log(trainName);
    // console.log(sendLocation);
    // console.log(firstSend);
    // console.log(trainInterval);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(newTrain.start, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % newTrain.freq;
    console.log(tRemainder);

    // Minute Until Train
    var minutesAway = newTrain.freq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Next Train
    var upcomingTrain = moment().add(minutesAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(upcomingTrain).format("hh:mm"));


    // create the table based on entry
    var newRow = $("<tr>").append(
        $("<td>").text(newTrain.name),
        $("<td>").text(newTrain.destination),
        $("<td>").text(newTrain.freq),
        $("<td>").text(upcomingTrain),
        $("<td>").text(minutesAway)
    );

    // append the new row to the table 
    $("#train-table").append(newRow);


});