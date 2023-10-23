"use strict";
$(document).ready(function () {
  //Basic alert
  // document.querySelector(".sweet-1").onclick = function () {
  //   swal("Here's a message!", "It's pretty, isn't it?");
  // };
  // //success message
  // document.querySelector(".alert-success-msg").onclick = function () {
  //   swal("Good job!", "You clicked the button!", "success");
  // };

  // //Alert confirm
  // document.querySelector(".alert-confirm").onclick = function () {
  //   swal(
  //     {
  //       title: "Are you sure?",
  //       text: "Your will not be able to recover this imaginary file!",
  //       type: "warning",
  //       showCancelButton: true,
  //       confirmButtonClass: "btn-danger",
  //       confirmButtonText: "Yes, delete it!",
  //       closeOnConfirm: false,
  //     },
  //     function () {
  //       swal("Deleted!", "Your imaginary file has been deleted.", "success");
  //     }
  //   );
  // };

  // //Success or cancel alert
  // document.querySelector(".alert-success-cancel").onclick = function () {
  //   swal(
  //     {
  //       title: "Are you sure?",
  //       text: "You will not be able to recover this imaginary file!",
  //       type: "warning",
  //       showCancelButton: true,
  //       confirmButtonClass: "btn-danger",
  //       confirmButtonText: "Yes, delete it!",
  //       cancelButtonText: "No, cancel plx!",
  //       closeOnConfirm: false,
  //       closeOnCancel: false,
  //     },
  //     function (isConfirm) {
  //       if (isConfirm) {
  //         swal("Deleted!", "Your imaginary file has been deleted.", "success");
  //       } else {
  //         swal("Cancelled", "Your imaginary file is safe :)", "error");
  //       }
  //     }
  //   );
  // };
  // //prompt alert
  // document.querySelector(".alert-prompt").onclick = function () {
  //   swal(
  //     {
  //       title: "An input!",
  //       text: "Write something interesting:",
  //       type: "input",
  //       showCancelButton: true,
  //       closeOnConfirm: false,
  //       inputPlaceholder: "Write something",
  //     },
  //     function (inputValue) {
  //       if (inputValue === false) return false;
  //       if (inputValue === "") {
  //         swal.showInputError("You need to write something!");
  //         return false;
  //       }
  //       swal("Nice!", "You wrote: " + inputValue, "success");
  //     }
  //   );
  // };

  //Ajax alert
  document.querySelector(".alert-ajax").onclick = function () {
    swal(
      {
        title: "Add New RTU",
        text: "Pastikan Data yang dimasukan sudah benar",
        type: "info",
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
      },
      function () {
        const data = {
          name: document.getElementsByName("name")[0].value,
          ipAddress: document.getElementsByName("ipAddress")[0].value,
          tipeKontrak: document.getElementsByName("tipeKontrak")[0].value,
          hargaKWH: document.getElementsByName("hargaKWH")[0].value,
          witelID: document.getElementById("witelList").value,
        };
        const headers = {
          "Content-Type": "application/json", // Specify the content type as JSON
          // Add any other headers as needed
        };
        const options = {
          method: "PUT",
          headers,
          body: JSON.stringify(data), // Convert the data to a JSON string
        };
        fetch("http://127.0.0.1:4000/retensis/insertRtu", options)
          .then((response) => response.json())
          .then((data) => {
            // console.log(data);
            if (data.success) {
              swal("RTU Added Succesfully");
            } else {
              swal("Error, Please check your input data");
            }
          });
      }
    );
  };

  // $("#openBtn").on("click", function () {
  //   $("#myModal").modal({
  //     show: true,
  //   });
  // });

  // $(document).on("show.bs.modal", ".modal", function (event) {
  //   var zIndex = 1040 + 10 * $(".modal:visible").length;
  //   $(this).css("z-index", zIndex);
  //   setTimeout(function () {
  //     $(".modal-backdrop")
  //       .not(".modal-stack")
  //       .css("z-index", zIndex - 1)
  //       .addClass("modal-stack");
  //   }, 0);
  // });
});
