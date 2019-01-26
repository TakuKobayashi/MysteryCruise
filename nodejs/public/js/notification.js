$(function(){
	$(document).on('click touchstart', function(e){
		if ($('#notification').is(':visible') && $(e.target).closest('.modal').length==0) {
			$('#notification').fadeOut();
		}
	});
  $('.bottom_left').on('click touchstart', function(){
    $('#notification').fadeOut();
  });
});
