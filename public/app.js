// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append(
      `<div class='articleResult'>
       <div class='articleTitle'>
          <h2 class='title' data-id=${data[i]._id}> ${data[i].title} </h2>
       </div>
        <br />
        <h5>Link:</h5>
        <a target="_blank" href=${data[i].link}>${data[i].link}</a>
        <br />
        <button class='btn writeNote m-3' data-id=${data[i]._id} id='writenote' data-toggle="modal" data-target="#exampleModal">Write Note</button>
      </div>`);
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "#writenote", function () {
  // Empty the notes from the note section
  $(".modal-body").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  console.log("====== ", thisId)
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $(".modal-body").append(
      `<form>
        <h2>${data.title}</h2>
        <div class="form-group">
          <label for="exampleFormControlInput1">Note Title:</label>
          <input type="text" class="form-control" name="title" id="titleinput" placeholder="">
        </div>
        <div class="form-group">
          <label for="exampleFormControlTextarea1">Type Note Below:</label>
          <textarea class="form-control" id="bodyinput" name="body" rows="3"></textarea>
        </div>
        <button class='btn btn-success' data-id=${data._id} id='savenote'>Save Note</button>
      </form>`);

      $(".modal-body").append(`<h3 class='mt-5'>Previous Notes:</h3>`);

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        // $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        // $("#bodyinput").val(data.note.body);
        $.ajax({
            method: "GET",
            url: "/notes/" + data.note
          })
          // With that done, add the note information to the page
          .then(function (data) {
            $(".modal-body").append(
              `<div id=${data._id} style='border: 1px solid #dddddd; border-radius: 5px; padding: 10px'>
                <p>${data.title}: ${data.body}</p>
                <button class = 'btn btn-danger btn-sm' data-id=${data._id} id='deletenote'>Delete Note</button>
              </div>`);
          });
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  event.preventDefault();
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      $.ajax({
          method: "GET",
          url: "/notes/" + data.note
        })
        // With that done, add the note information to the page
        .then(function (data) {
          $(".modal-body").append(
            `<div id=${data._id} style='border: 1px solid #dddddd; border-radius: 5px; padding: 10px; margin-top: 5px'>
              <p>${data.title}: ${data.body}</p>
              <button class = 'btn btn-danger btn-sm' data-id=${data._id} id='deletenote'>Delete Note</button>
            </div>`);
        });
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


$(document).on("click", "#deletenote", function () {

  var thisId = $(this).attr("data-id");

  $.ajax({
      method: "DELETE",
      url: "/notes/" + thisId,
    })
    // With that done
    .then(function (data) {
      // Log the response
      $("#" + thisId).remove();
      console.log(data);
    });
});