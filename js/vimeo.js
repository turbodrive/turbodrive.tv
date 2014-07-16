$(document).ready(function () {
    var video = $("#video")[0];

    // Buttons
    var playButton = $("#play-pause");
    /*var muteButton = $("#mute");
    var fullScreenButton = $("#full-screen");

    // Sliders
    var seekBar = $("#seek-bar");
    var volumeBar = $("#volume-bar");*/
    
    video.muted = true; 
    
    playButton.on("click", function() {
      if (video.paused) {
          video.play();
          playButton.css("opacity", "0")
      } else {
          video.pause();
          playButton.css("opacity", "1")
      }
    });
});