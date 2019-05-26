$(function() {

  $('#index-button.kill').on('click', function() {
    $.ajax({
      url: '/kill',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
      }
    });
  });

  $('#index-button.rain').on('click', function() {
    $.ajax({
      url: '/rainbow',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
      }
    });
  });

  $('#index-button.alfie').on('click', function() {
    $.ajax({
      url: '/alfie',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
      }
    });
  });

  $('#index-button.chirag').on('click', function() {
    $.ajax({
      url: '/chirag',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
      }
    });
  });

  $('#index-button.john').on('click', function() {
    $.ajax({
      url: '/john',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
      }
    });
  });

  $('#index-button.white').on('click', function() {
    $.ajax({
      url: '/white',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
      }
    });
  });

  $('#index-button.blue').on('click', function() {
    $.ajax({
      url: '/blue',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
      }
    });
  });

  $('#index-button.image').on('click', function() {
    $.ajax({
      url: '/image',
      contentType:'application/json',
      success: function(response) {
        console.log(response);
      }
    });
  });
  

  $('#index-button.create').on('click', function() {
    $.ajax({
	contentType:'html',
      	success:function(response){
          var request = new XMLHttpRequest();
          request.onreadystatechange = function(){
              if(this.readyDtate == 4 && this.status == 200){
                   $(this).load("/javascripts/ImageCreator");
              }
          }
          request.open("GET","/javascripts/ImageCreator.html");
          request.send();
          window.location.href = "/javascripts/ImageCreator.html"
      }
    });
  });
});
