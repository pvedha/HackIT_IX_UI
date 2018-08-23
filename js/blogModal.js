//// Get the modal
var modal; // = document.getElementById('myModal');
var about;

$(document)
    .ready(
        function () {
            modal = document.getElementById('myModal');
            //btn = document.getElementById("myBtn");
            var span = document.getElementsByClassName("close")[0];

            about = document.getElementById('aboutProject');

            $("#showSignUp").click(
                function () {
                    getUserIds();
                    //console.log("Open form");
                    modal.style.display = "block";
                });
            $("#close-signup-form").click(
                function () {
                    modal.style.display = "none";
                });



            $("#showAbout").click(
                function () {
                    getUserIds();
                    //console.log("Open form");
                    about.style.display = "block";
                });
            $("#close-about").click(
                function () {
                    about.style.display = "none";
                });


        });


window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == about) {
        about.style.display = "none";
    }
}
