// Initialize Firebase
var config = {
  apiKey: "AIzaSyCv_79yyFucWQt-23EiJBrzib5RYhIYVW4",
  authDomain: "mandiesproject1.firebaseapp.com",
  databaseURL: "https://mandiesproject1.firebaseio.com",
  projectId: "mandiesproject1",
  storageBucket: "mandiesproject1.appspot.com",
  messagingSenderId: "1041153786279"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destName = $("#destination-input").val().trim();
  var startTime = $("#first-train-input").val().trim();
  var minsBetween = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    trainName: trainName,
    destName: destName,
    startTime: startTime,
    minsBetween: minsBetween
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.destName);
  console.log(newTrain.startTime);
  console.log(newTrain.minsBetween);

  alert("Train successfully added.");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});


  // 3. Create Firebase event for adding train info to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var destName = childSnapshot.val().destName;
    var startTime = childSnapshot.val().startTime;
    var minsBetween = childSnapshot.val().minsBetween;

    // Train Info
    console.log(trainName);
    console.log(destName);
    console.log(startTime);
    console.log(minsBetween);

    // Prettify starting train time.
    var startTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
    console.log("startTimeConverted: " + startTimeConverted);

    // Difference between the times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart remainder
    var tRemainder = diffTime % minsBetween;
    console.log(tRemainder);

    // Minutes until the next train
    var tMinutesTillTrain = minsBetween - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // next arrival calculation
    var nextArrival = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));

    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destName),
      $("<td class='text-center'>").text(minsBetween + " minutes"),
      $("<td class='text-center'>").text(moment(nextArrival).format("hh:mm A")),
      $("<td class='text-center'>").text(tMinutesTillTrain + " minutes"),
    );

    // Append the new row to the table
    $("#trains-table > tbody").append(newRow);
  });

