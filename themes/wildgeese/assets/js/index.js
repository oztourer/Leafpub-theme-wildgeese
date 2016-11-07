/**
 * Main JS file for WildGeese behaviours
 */

/* globals jQuery, document */
(function ($, undefined) {
    "use strict";
    
    var $document = $(document);

    $document.ready(function () {

        var $postContent = $(".post-content");
        $postContent.fitVids();
	// Make sure that the menu is closed on page load
        $("body").removeClass("nav-opened").addClass("nav-closed");

        $(".scroll-down").arctic_scroll();

        $(".nav-cover, .nav-close").click(function(e){
            e.preventDefault();
            $("body").removeClass("nav-opened").addClass("nav-closed");
        });

        $(".menu-button, .nav-cover").mouseover(function(e){
            e.preventDefault();
            $("body").toggleClass("nav-opened nav-closed");
        });

	// Use event.swipe by Stephen Band
	$document.on("movestart", function(e){
	    // If the movestart is heading off in an upwards or downwards
	    // direction, prevent it so that the browser scrolls normally.
	    if ((e.distX > e.distY && e.distX < -e.distY) ||
		(e.distX < e.distY && e.distX > -e.distY)) {
		e.preventDefault();
	    }
	});
	$document.on("swipeleft swiperight", function(e){
	    $("body").toggleClass("nav-opened nav-closed");
        });
	
	// Cause archived site to be opened in a new window (or tab)
	$( '.nav-archive [href^="http://"]' ).attr('target','_blank');
	
	// Close the slide-out menu on click target=_blank;
	
	// Generate <hr> from empty paragraph
	//$('<p></p>').replaceWith('<hr>');
	$('article.post').each(function() {
	    var text = $(this).html();
	    //$(this).html(text.replace('<p><br data-mce-bogus="1"></p>', '<hr>')); 
	    $(this).html(text.replace('<p>&nbsp;</p>', '<hr>')); 
	    //$(this).replaceWith()
	});

    });

    // Arctic Scroll by Paul Adam Davis
    // https://github.com/PaulAdamDavis/Arctic-Scroll
    $.fn.arctic_scroll = function (options) {

        var defaults = {
            elem: $(this),
            speed: 500
        },

        allOptions = $.extend(defaults, options);

        allOptions.elem.click(function (event) {
            event.preventDefault();
            var $this = $(this),
                $htmlBody = $('html, body'),
                offset = ($this.attr('data-offset')) ? $this.attr('data-offset') : false,
                position = ($this.attr('data-position')) ? $this.attr('data-position') : false,
                toMove;

            if (offset) {
                toMove = parseInt(offset);
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top + toMove) }, allOptions.speed);
            } else if (position) {
                toMove = parseInt(position);
                $htmlBody.stop(true, false).animate({scrollTop: toMove }, allOptions.speed);
            } else {
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top) }, allOptions.speed);
            }
        });

    };
    
    //setInterval( "slideSwitch()", 5000 );

})(jQuery);
