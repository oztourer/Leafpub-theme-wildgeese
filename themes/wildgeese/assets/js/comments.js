$(function() {
    'use strict';
    
    var edit_html = `
	    <textarea id='old-comment-text' class='old-comment-text'></textarea>
	    <div class='old-comment-cancel'>Cancel</div>
	    <div class='old-comment-mod'>Update comment</div>
    `;
    
    //====================================================
    // Handle touchscreens approriately
    //====================================================

    var touchscreen = false;
    
    $('body').on('touchstart', function(){
	touchscreen = true;
    });
    
    // Reload the comments section after add or delete
    function reload_comments() {
	$('.div-comments').each(function() {
	    var data_src = $(this).attr('data-src');
	    var curr_page = $('data-pages').attr('data-current');
	    var prev_page = $('data-pages').attr('data-prev');
	    $(this).load(data_src + '/page/' + curr_page,
		function(responseText, textStatus, req) {
		    if (textStatus == "error") {
			if (prev_page)
			    $(this).load(prev_page);
			else
			    $(this).load(data_src);
		    }
		});
	});
    }
 
    //====================================================
    // Existing comment handling
    //====================================================

    // Close any open edit window
    function cancel_comment_mod() {
	$('.mod-comment-entry').fadeOut('fast', function(){
	    $('.mod-comment-entry').closest('.existing-comment').find('.current-comment').fadeIn('fast');
	});
    }

    // Load comments div
    $('.div-comments').each(function() {
	$(this).load($(this).attr('data-src'));
    });
    
    // Paging support
    $('.div-comments').on('click', '.older-comments, .newer-comments', function(event) {
	$('.div-comments').load($(this).attr('data-url'));
    });
    
    // Hide edit menu, show options icon
    $('.div-comments').on('mouseenter', '.existing-comment.editable', function(event) {
	$('.comment-menu-items').fadeOut('fast');
	$('.comment-options').fadeOut('fast');
	$(this).find('.comment-options').fadeIn('fast');
    });
    
    // Show/hide edit/delete menu for comments on click
    /*$('.div-comments').on('click', '.comment-options-icon', function(event) {
	cancel_comment_mod();
	$(this).siblings('.comment-menu-items').fadeToggle('fast');
    });*/
    
    // Show edit/delete menu for comments on mouseover
    $('.div-comments').on('mouseenter', '.comment-options-icon', function(event) {
	cancel_comment_mod();
	$(this).siblings('.comment-menu-items').fadeIn('fast');
    });
    
    // Toggle edit/delete menu on clicking (touching) a comment/menu block
    $('.div-comments').on('click', '.existing-comment.editable', function(event) {
	if ($(this).attr('id') !== $('.mod-comment-entry').closest('.existing-comment').attr('id')
		|| $('.mod-comment-entry').css('display') == 'none') {
	    cancel_comment_mod();
	    if ($(this).find('.comment-options').css('opacity') == 1)
		$(this).find('.comment-menu-items').fadeToggle('fast');
	    $(this).find('.comment-options').fadeIn('fast');
	}
    });
    
    // Hide edit/delete menu on moving the mouse out of a comment/menu block
    $('.div-comments').on('mouseleave', '.comment-menu-items', function(event) {
	$(this).fadeOut('fast');
    });
    
    // Hide menu and icon on moving the mouse out of a comment
    $('.div-comments').on('mouseleave', '.existing-comment.editable', function(event) {
	$(this).find('.comment-options').fadeOut('fast');
	$(this).find('.comment-menu-items').fadeOut('fast');
    });
    
    // On clicking to edit existing comment
    $('.div-comments').on('click', '.edit-comment', function(event) {
	var selectedcomment = $(this).closest('.existing-comment');
	var moddedcomment = $('.mod-comment-text').closest('.existing-comment');
	if (selectedcomment.attr('id') != moddedcomment.attr('id')) {
	    // Try not to replace last edit unless we have moved to another comment
	    selectedcomment.append($('.mod-comment-entry'));
	    $('.mod-comment-text').val(selectedcomment.find('.current-comment').text());
	}
	selectedcomment.find('.current-comment').fadeOut('fast', function(){
	    selectedcomment.find('.comment-menu-items').fadeOut('fast');
	    $('.mod-comment-entry').fadeIn('fast');
	    $('.mod-comment-text').focus();
	});
	// Prevent further processing of this click event
	event.stopImmediatePropagation();
    });

    // on starting modifying the comment activate the "add" button
    $('.div-comments').on('input propertychange', '.mod-comment-text', function() {
       var checklength = $(this).val().length;
       if (checklength) {
	   $(".old-comment-mod").css({opacity:1});
	   $(".old-comment-mod").css("visibility", "visible");
       }
       else {
	   $(".old-comment-mod").css({opacity:0.3});
	   $(".old-comment-mod").css("visibility", "hidden");
       }
    });
    
    // On clicking to delete existing comment
    $('.div-comments').on('click', '.delete-comment', function(event) {
	var existingcomment = $(this).closest('.existing-comment');
	var id = existingcomment.attr('id');

        if (confirm('Are you sure you would like to delete this comment?')) {
	    $.ajax({
		type: "DELETE",
		url: "api/comments/" + encodeURIComponent(id),
		data: {
		    properties: {
			author_slug: existingcomment.attr('data-author')
		    }
		}
	    })
	    .done(function(res) {
		if(res.success) {
		    //existingcomment.find('.comment-menu-items').fadeOut('fast');
		    //existingcomment.fadeOut('fast');
		    //cancel_comment_mod();
		    reload_comments();
		} else {
		    // Show errors
		    //Postleaf.highlightErrors('.settings-form', res.invalid);
		    //$.alertable.alert(res.message);
		    alert(res.message);
		}
	    });
	}
    });
    
    // On clicking to cancel modifying comment
    $('.div-comments').on('click', '.old-comment-cancel', function(event) {
	var existingcomment = $(this).closest('.existing-comment');
 	cancel_comment_mod();
	// reset edit text to original value
	$('.mod-comment-text').val(existingcomment.find('.current-comment').text());
   	existingcomment.find('.comment-menu-items').fadeOut('fast');
    });

    // on clicking the "Update comment" button 
    $('.div-comments').on('click', '.old-comment-mod', function() {
	var theCom = $('.mod-comment-text').val();
	var existingcomment = $(this).closest('.existing-comment');
	var id = existingcomment.attr('id');

	if (!theCom) { 
	    alert('You need to write a comment!');
	    $('.mod-comment-text').focus();
	} else {
            // Send request
	    $.ajax({
		type: "PUT",
		url: "api/comments/" + encodeURIComponent(id),
		data: {
		    properties: {
			comment: theCom,
			author_slug: existingcomment.attr('data-author')
		    }
		}
	    })
	    .done(function(res) {
		if(res.success) {
		    existingcomment.find('.current-comment').text(theCom);
		    cancel_comment_mod();
		} else {
		    // Show errors
		    //Postleaf.highlightErrors('.settings-form', res.invalid);
		    //$.alertable.alert(res.message);
		    alert(res.message);
		}
	    });
	}  
    });
    
    
    //====================================================
    // New comment handling
    //====================================================

    // on clicking on the new-comment placeholder
    $('.div-comments').on('click', '#new-comment-placeholder', function(event) {
	$('#new-comment-placeholder').fadeOut('fast', function() {
	    cancel_comment_mod();
	    $('.new-comment-entry').fadeIn('fast');
	    $('.new-comment-text').focus();
	    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
	});
    });

    // on starting writing the comment activate the "add" button
    $('.div-comments').on('input propertychange', '.new-comment-text', function() {
       var checklength = $(this).val().length;
       if (checklength) {
	   $(".new-comment-add").css({opacity:1});
	   $(".new-comment-add").css("visibility", "visible");
       }
       else {
	   $(".new-comment-add").css({opacity:0.3});
	   $(".new-comment-add").css("visibility", "hidden");
       }
    });

    // on clicking outside the new-comment DIV
    // Disable while debugging
    /*
    */
    $('.div-comments').on('focusout', '.comment-container', function() {
	$('.new-comment-entry').fadeOut('fast', function() {
	    $('#new-comment-placeholder').fadeIn('fast');
	    // Don't clear contents
	    //$('.new-comment-text').val('');
	});
    });
 
    // on clicking the cancel button
    $('.div-comments').on('click', '.new-comment-cancel', function() {
	$('.new-comment-entry').fadeOut('fast', function() {
	    $('#new-comment-placeholder').fadeIn('fast');
	    $('.new-comment-text').val('');
	});
    });

    // on clicking the "post comment" button 
    $('.div-comments').on('click', '.new-comment-add', function() {
	var theCom = $('.new-comment-text').val();

	if (!theCom) { 
	    alert('You need to write a comment!');
	    $('.new-comment-text').focus();
	} else {
            // Send request
	    $.ajax({
		type: "POST",
		url: "api/comments",
		data: {
		    properties: {
			comment: theCom,
			post: $('#new-comment-placeholder').attr('data-post')
		    }
		}
	    })
	    .done(function(res) {
		if(res.success) {
		    $('.new-comment-entry').hide('fast', function() {
			$('#new-comment-placeholder').show('fast');
			reload_comments();
		    });
		} else {
		    // Show errors
		    //Postleaf.highlightErrors('.settings-form', res.invalid);
		    //$.alertable.alert(res.message);
		    alert(res.message);
		}
	    });
	}  
    });
});