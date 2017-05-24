/**
 * General.js
 *
 * contains the theme functionalities 
 */

jQuery.noConflict();
var get_scroll = 0;

jQuery(window).scroll(function() {
	"use strict";
	
	get_scroll = jQuery(window).scrollTop();	
});

jQuery(window).load(function() {
	
	jQuery('body').find(".pageloader").delay(1000).fadeOut("slow");
	
	nashville_initBlogGrid();
	nashville_initBlogInfiniteScroll();
	
	/* ======================================
	Scroll to Section if Hash exists
	====================================== */	
	if( window.location.hash ) {		
		setTimeout ( function () {
			jQuery.scrollTo( window.location.hash, 2000, { easing: 'easeInOutExpo', offset: 0, "axis":"y" } );
		}, 400 );
	}
});

jQuery(function(){
    
});

(function($) {
	"use strict";
	
	var NASHVILLE = window.NASHVILLE || {};
	window.NASHVILLE = NASHVILLE;
	
	NASHVILLE.CommonUtils = function() {
		$('a').hover(function() {
			$(this).attr('data-title', $(this).attr('title'));
			$(this).removeAttr('title');
		}, function() {
			$(this).attr('title', $(this).attr('data-title'));
		});
	};
	
	NASHVILLE.ReplaceSVG = function() {
		$('img.tpath-svg').each(function(){
			var $img = $(this);
			var imgID = $img.attr('id');
			var imgClass = $img.attr('class');
			var imgURL = $img.attr('src');
		
			$.get(imgURL, function(data) {
				// Get the SVG tag, ignore the rest
				var $svg = $(data).find('svg');
		
				// Add replaced image's ID to the new SVG
				if(typeof imgID !== 'undefined') {
					$svg = $svg.attr('id', imgID);
				}
				// Add replaced image's classes to the new SVG
				if(typeof imgClass !== 'undefined') {
					$svg = $svg.attr('class', imgClass +' replaced-svg');
				}
		
				// Remove any invalid XML tags as per http://validator.w3.org
				$svg = $svg.removeAttr('xmlns:a');
				
				// Check if the viewport is set, else we gonna set it if we can.
				if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
					$svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
				}
		
				// Replace image with new SVG
				$img.replaceWith($svg);
			}, 'xml');
			
		});
	};
	
	NASHVILLE.IsotopeLayout = function() {
		if( $('.tpath-isotope-layout').length > 0 ) {
			var isotopeContainersArray = [],
				typeGridArray = [],
				layoutGridArray = [],
				screenLgArray = [],
				screenMdArray = [],
				screenSmArray = [],
				transitionDuration = [],
				$filterItems = [],
				$filters = $('.tpath-isotope-filters'),
				$itemSelector = '.isotope-post',
				$items,
				itemMargin,
				correctionFactor = 0,
				firstLoad = true,
				isOriginLeft = $('body').hasClass('rtl') ? false : true;
				
			$('.tpath-isotope-layout').each(function() {
				var isoData = $(this).data(),
				$data_lg,
				$data_md,
				$data_sm;
				if (isoData.lg !== undefined) $data_lg = $(this).attr('data-lg');
				else $data_lg = '1000';
				if (isoData.md !== undefined) $data_md = $(this).attr('data-md');
				else $data_md = '600';
				if (isoData.sm !== undefined) $data_sm = $(this).attr('data-sm');
				else $data_sm = '480';
				screenLgArray.push($data_lg);
				screenMdArray.push($data_md);
				screenSmArray.push($data_sm);
				transitionDuration.push($('.post-inside-wrapper.animate_when_almost_visible', this).length > 0 ? 0 : '0.5s');
				if (isoData.type == 'metro') typeGridArray.push(true);
				else typeGridArray.push(false);
				if (isoData.layout !== undefined) layoutGridArray.push(isoData.layout);
				else layoutGridArray.push('masonry');
				isotopeContainersArray.push($(this));
			});
			
			var colWidth = function(index) {
					$(isotopeContainersArray[index]).width('');
					var isPx = $(isotopeContainersArray[index]).data('gutter'),
						widthAvailable = $(isotopeContainersArray[index]).width(),
						columnNum = 12,
						columnWidth = 0;
						
					columnWidth = ($('html.firefox').length) ? Math.floor(widthAvailable / columnNum) : widthAvailable / columnNum;
					
					$items = $(isotopeContainersArray[index]).find('.isotope-post');
					itemMargin = parseInt($(isotopeContainersArray[index]).find('.post-inside-wrapper').css("margin-top"));
					for (var i = 0, len = $items.length; i < len; i++) {
						var $item = $($items[i]),
							multiplier_w = $item.attr('class').match(/post-iso-w(\d{0,2})/),
							multiplier_h = $item.attr('class').match(/post-iso-h(\d{0,2})/);
						
						if (widthAvailable >= screenMdArray[index] && widthAvailable < screenLgArray[index]) {
							if (multiplier_w[1] !== undefined) {
								switch (parseInt(multiplier_w[1])) {
									case (5):
									case (4):
									case (3):
										if (typeGridArray[index]) multiplier_h[1] = (6 * multiplier_h[1]) / multiplier_w[1];
										multiplier_w[1] = 6;
										break;
									case (2):
									case (1):
										if (typeGridArray[index]) multiplier_h[1] = (3 * multiplier_h[1]) / multiplier_w[1];
										multiplier_w[1] = 3;
										break;
									default:
										if (typeGridArray[index]) multiplier_h[1] = (12 * multiplier_h[1]) / multiplier_w[1];
										multiplier_w[1] = 12;
										break;
								}
							}
						} else if (widthAvailable >= screenSmArray[index] && widthAvailable < screenMdArray[index]) {
							if (multiplier_w[1] !== undefined) {
								switch (parseInt(multiplier_w[1])) {
									case (5):
									case (4):
									case (3):
									case (2):
									case (1):
										if (typeGridArray[index]) multiplier_h[1] = (6 * multiplier_h[1]) / multiplier_w[1];
										multiplier_w[1] = 6;
										break;
									default:
										if (typeGridArray[index]) multiplier_h[1] = (12 * multiplier_h[1]) / multiplier_w[1];
										multiplier_w[1] = 12;
										break;
								}
							}
						} else if (widthAvailable < screenSmArray[index]) {
							if (multiplier_w[1] !== undefined) {
								//if (typeGridArray[index]) multiplier_h[1] = (12 * multiplier_h[1]) / multiplier_w[1];
								multiplier_w[1] = 12;
								if (typeGridArray[index]) multiplier_h[1] = 12;
							}
						}
						
						var gutterSize = parseInt($(isotopeContainersArray[index]).data('gutter'));
						
						var width = multiplier_w ? (columnWidth * multiplier_w[1] ) : columnWidth,
							height = multiplier_h ? Math['ceil']((2 * Math.ceil(columnWidth / 2)) * multiplier_h[1]) - itemMargin : columnWidth;
						
						if (width >= widthAvailable) {
							$item.css({
								width: widthAvailable,
								paddingRight: gutterSize
							});
						} else {
							$item.css({
								width: width,
								paddingRight: gutterSize
							});
						}
												
						$(isotopeContainersArray[index]).css({
							'margin-top': '-' + gutterSize + 'px',
							'margin-right': '-' + gutterSize + 'px'
						});
					}
					return columnWidth;
				},
				init_isotope = function() {
					for (var i = 0, len = isotopeContainersArray.length; i < len; i++) {
						var isotopeSystem = $(isotopeContainersArray[i]).closest( $('.tpath-isotope-system') ),
							isotopeId = isotopeSystem.attr('id'),
							$layoutMode = layoutGridArray[i];
							
						var gutterSize = parseInt($(isotopeContainersArray[i]).data('gutter'));
						
						var $filter = isotopeSystem.find('.tpath-isotope-filters'),
						filterValue = $filter.find('li a.active').data('filter');
						
						if( filterValue == '*' || filterValue === undefined ) {
							var $filterVal = '';
						} else {
							var $filterVal =  '.' + filterValue;
						}
						
						$(isotopeContainersArray[i]).isotope({
							itemSelector: $itemSelector,
							layoutMode: $layoutMode,
							transitionDuration: transitionDuration[i],
							masonry: {
								columnWidth: colWidth(i)
							},
							vertical: {
								horizontalAlignment: 0.5,
							},
							filter: $filterVal,
							sortBy: 'original-order',
							isOriginLeft: isOriginLeft
						}).on('layoutComplete', onLayout($(isotopeContainersArray[i]), 0));
					}
				},
				onLayout = function(isotopeObj, startIndex) {
					isotopeObj.css('opacity', 1);
					isotopeObj.closest('.tpath-isotope-system').find('.tpath-pagination-wrapper').css('opacity', 1);
					setTimeout(function() {
						window.dispatchEvent(NASHVILLE.boxEvent);
						$(isotopeObj).find("a[rel^='prettyPhoto'], a[data-rel^='prettyPhoto']").prettyPhoto({hook: 'data-rel', social_tools: false, deeplinking: false});
					}, 100);
				};
							
			$filters.on('click', 'a', function(evt) {
				var $filter = $(this),
					filterContainer = $filter.closest('.tpath-isotope-filters'),
					filterValue = $filter.attr('data-filter'),
					container = $filter.closest('.tpath-isotope-system').find($('.tpath-isotope-layout')),
					transitionDuration = container.data().isotope.options.transitionDuration,
					delay = 300,
					filterItems = [];
					
				if (!$filter.hasClass('active')) {
					if (filterValue !== undefined) {
						$.each($('> .isotope-post > .post-inside-wrapper', container), function(index, val) {
							var parent = $(val).parent(),
								objTimeout = parent.data('objTimeout');
							if (objTimeout) {
								$(val).removeClass('zoom-reverse').removeClass('start_animation')
								clearTimeout(objTimeout);
							}
						});
						setTimeout(function() {
							container.isotope({
								filter: function() {
									var block = $(this),
									filterable = (filterValue == '*') || block.hasClass(filterValue);
									if (filterable) {
										filterItems.push(block);
									}
									return filterable;
								}
							});
							$('.post-inside-wrapper.zoom-reverse', container).removeClass('zoom-reverse');
						}, delay);
						/** once filtered - start **/
						if (transitionDuration == 0) {
							container.isotope('once', 'arrangeComplete', function() {});
						}
						/** once filtered - end **/
					} else {
						$.each($('> .isotope-post > .post-inside-wrapper', container), function(index, val) {
							var parent = $(val).parent(),
								objTimeout = parent.data('objTimeout');
							if (objTimeout) {
								$(val).removeClass('zoom-reverse').removeClass('start_animation')
								clearTimeout(objTimeout);
							}
						});
						container.parent().addClass('isotope-loading');
					}
				}
				evt.preventDefault();
			});
			
			$filters.each(function(i, buttonGroup) {
				var $buttonGroup = $(buttonGroup);
				$buttonGroup.on('click', 'a', function() {
					$buttonGroup.find('.active').removeClass('active');
					$(this).addClass('active');
				});
			});
			
			window.addEventListener('boxResized', function(e) {
				$.each($('.tpath-isotope-layout'), function(index, val) {
					var $layoutMode = ($(this).data('layout'));
					if ($layoutMode === undefined) $layoutMode = 'masonry';
						
					if ($(this).data('isotope')) {
						$(this).isotope({
							itemSelector: $itemSelector,
							layoutMode: $layoutMode,
							transitionDuration: transitionDuration[index],
							masonry: {
								columnWidth: colWidth(index)	
							},
							vertical: {
								horizontalAlignment: 0.5,
							},
							sortBy: 'original-order',
							isOriginLeft: isOriginLeft
						});
						$(this).isotope('unbindResize');
					}
					$(this).find('.mejs-video,.mejs-audio').each(function() {
						$(this).trigger('resize');
					});
				});
			}, false);
			init_isotope();
		};
	};
		
	NASHVILLE.VcAnimations = function() {
		if( ! window.tpath_waypoint_animation ) {
			window.tpath_waypoint_animation = function() {
				$.each( $('.wpb_animate_when_almost_visible:not(.wpb_start_animation)'), function(index, val) {
					var run = true;
					if (run) {
						new Waypoint({
							element: val,
							handler: function() {
								var element = $(this.element),
									index = element.index(),
									delayAttr = element.attr('data-delay');
								if (delayAttr == undefined) delayAttr = 0;
								setTimeout(function() {
									element.addClass('wpb_start_animation');
								}, delayAttr);
								this.destroy();
							},
							offset: '90%'
						});
					}
				});
			}
		}
		setTimeout(function() {
			window.tpath_waypoint_animation();
		}, 100);	
	};
	
	NASHVILLE.VcProgressBar = function() {
		window.tpath_progressbar_animation = function() {
			$.each( $('.vc_progress_bar .vc_single_bar'), function(index, val) {
				var run = true;
				if (run) {
					new Waypoint({
						element: val,
						handler: function() {
							var element = $(this.element),
								index = element.index(),
								bar = element.find(".vc_bar"),
								val = bar.data("percentage-value");
								
							setTimeout(function() {
								bar.css({
									width: val + "%"
								});
							}, 200 * index);
							this.destroy();
						},
						offset: '85%'
					});
				}
			});
		}
		
		window.tpath_progressbar_animation();
	};
	
	NASHVILLE.VcCustomCss = function() {
		window.VcCustomCssInit = function() {
			var css = '';
			$.each( $('.tpath-vc-custom-css'), function() {
				 css += $(this).data( 'css' );
				 $(this).remove();
			});
			if( css !== null ) {
				$('head').append( '<style type="text/css" data-type="nashville_vc_custom_styles">' + css + '</style>');
			}
		}
		
		window.VcCustomCssInit();
	};
	
	NASHVILLE.VcEventSlider = function() {
		window.VcEventSliderInit = function() {
			$('.tpath-events-ticker-slider').each(function() {
				var visible = $(this).data('visible');
				var direction = $(this).data('direction');
				var interval = $(this).data('interval');
				var mousepause = $(this).data('mousepause');
				
				$(this).easyTicker({
					direction: direction,
					speed: 'slow',
					interval: interval,
					height: 'auto',
					visible: visible,
					mousePause: mousepause,
					controls: {
						up: '.ticker-next',
						down: '.ticker-prev',
					}
				});	
			});
		}
		
		window.VcEventSliderInit();
	};
	
	NASHVILLE.WooAddToCart = function() {
		window.WooAddToCartInit = function() {
			$('body').bind("added_to_cart", function (event, fragments, cart_hash, $thisbutton) {
                
                var is_single_product = $thisbutton.hasClass('single_add_to_cart_button');

                if( is_single_product ) return;

                var button         = $thisbutton,
                    buttonWrap     = button.parent(),
                    buttonViewCart = buttonWrap.find('.added_to_cart'),
                    addedTitle     = buttonViewCart.text(),
                    productWrap    = buttonWrap.parent().parent().parent().parent();

                button.remove();

                buttonViewCart.html('');

                setTimeout(function () {
                    $('.product .product-wrapper .product-buttons .added_to_cart').each(function() {
                        buttonWrap.tooltip('hide').attr('title', addedTitle).tooltip('fixTitle');
                    });
                }, 500);
            });
		}
		
		window.WooAddToCartInit();
	};
	
	NASHVILLE.init = function() {
		NASHVILLE.CommonUtils();
		NASHVILLE.ReplaceSVG();
		NASHVILLE.IsotopeLayout();
		NASHVILLE.VcAnimations();		
		NASHVILLE.VcProgressBar();
		NASHVILLE.VcCustomCss();
		NASHVILLE.VcEventSlider();
		NASHVILLE.WooAddToCart();
	}
	NASHVILLE.init();
	
	$(window).load(function() {
		NASHVILLE.IsotopeLayout();
	});
	
})(jQuery);

function Tpath_InitJs() {
    tpath_VcRowIsotope();
	jQuery(document).trigger("Tpath_InitJs");
}

"function" != typeof window.tpath_VcRowIsotope && ( window.tpath_VcRowIsotope = function() {
	function IsotopefullWidth() {
		var $elements = $('[data-vc-full-width="true"]').find('.tpath-isotope-system');
		$.each($elements, function(key, item) {
			var $el = $(this),
			scrollbarWidth;
			
			if( scrollbarWidth == undefined) {
				// Create the measurement node
				var scrollDiv = document.createElement("div");
				scrollDiv.className = "scrollbar-measure";
				var dombody = document.body;
				if (dombody != null) {
					dombody.appendChild(scrollDiv);
					// Get the scrollbar width
					scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
					// Delete the DIV
					dombody.removeChild(scrollDiv);
				}
			}
			
			var wwidth = window.innerWidth || document.documentElement.clientWidth;
			
			var elWidth = $el.offsetWidth,
				newWidth = 12 * Math.ceil((wwidth - scrollbarWidth) / 12);
			
			boxWidth = newWidth;
			boxLeft = Math.ceil(((newWidth) - wwidth) / 2);
			
			$el.css({
				width: wwidth + 'px',
				//marginLeft: '-' + (boxLeft + (scrollbarWidth / 2)) + 'px',
				//marginRight: '-' + (boxLeft + (scrollbarWidth / 2)) + 'px'
			});
		});
	}
	
	function TpathVcFullWidthRow() {
		var rtl = $('body').hasClass('rtl') ? true : false;
		
		if( rtl == true ) {
			var $elements = $('[data-vc-full-width="true"]');
			$.each($elements, function(key, item) {
				var $el = $(this);
				var $el_full = $el.next(".vc_row-full-width");
                $el_full.length || ($el_full = $el.parent().next(".vc_row-full-width"));
                var el_margin_right = parseInt($el.css("margin-right"), 10); 
					
				var offset = 0 - ( $(window).width() - ( $el_full.offset().left + $el_full.outerWidth() - el_margin_right ) );
				
				$el.css({                      
                	right: offset
                });
			});
		}
	}
	
	var $ = window.jQuery;
	$(window).off("resize.tpath_VcRowIsotope");
	$(window).on("resize.tpath_VcRowIsotope", IsotopefullWidth);
	$(window).on("resize.tpath_VcRowIsotope", TpathVcFullWidthRow);
	IsotopefullWidth();
	TpathVcFullWidthRow();
});

jQuery(document).ready(function($){
								
	window.Tpath_InitJs();
	
	$(".tpath-tooltip").tooltip();	
	$(".tpath-popover").popover();
	
	$('.tpath-features-list li:last-child').addClass('last-feature');

	/* =============================
	Active Onepage Nav Navigation
	============================= */	
	(function($) {
		"use strict"; 
  
		$('.main-nav').each(function() {  
			$(this).find('a[href]').each(function(i,a){
				var $a = $(a);
				var href = $a.attr('href');
				var target;
				
				// Get Splitted ID from page's URI in href tag
				target = href.substring(href.indexOf('#') + 1); 
				
				// update anchors TARGET with new one
				if(target.indexOf('section-') == 0) {  
					$a.attr('data-target', '#' + target);
				} else {
					$a.addClass('external-link');
				}
							
			});
		});
		
		if( $('body').hasClass('header-sticky-enabled') ) {
			if( $(".header-section").hasClass( 'header-styletwo' ) ) {
				var sticky_height = '100px';
			} else {
				var sticky_height = '140px';
			}
			
			var scroll_offset = sticky_height.match(/\d+/);
			
			if( scroll_offset !== null && scroll_offset != 0 ) {
				scroll_offset = scroll_offset - 2;
			}
		} else {
			var scroll_offset = -2;
		}
		
		$('.main-nav').onePageNav({
			currentClass: 'active',
			filter: ':not(.external-link)',
			scrollSpeed: 1100,
			scrollOffset: scroll_offset,
			scrollThreshold: 0.1,
			easing: 'easeInOutExpo',
		});
  
 	})(jQuery);	
	
	(function($) {
		"use strict";	
	
		/* ======================== VC Column Match Height ======================== */
		var TpathVcColumnMatchHeight = {
			Init: function() {
				$('.tpath-row-inner-wrapper').each(function() {
					if( $(this).hasClass('vc-match-height-row') ) {	
						if( ! ( $(this).find('.wpb_column.vc_main_column.vc_column_container').hasClass( 'vc-match-height-content' ) ) ) {
							$(this).find('.wpb_column.vc_main_column.vc_column_container').addClass( 'vc-match-height-content' );
						}
					}
				});
				
				$('.footer-match-height-column').each(function() {
					if( ! ( $(this).find('.footer-match-column').hasClass( 'footer-match-height-content' ) ) ) {
						$(this).find('.footer-match-column').addClass( 'footer-match-height-content' );
					}
				});
		
				/* ======================== Match Height ======================== */
				if(Modernizr.mq('only screen and (min-width: 768px)')) { 
					$('.vc-match-height-row').each(function() {
						if( $(this).find( '.vc-match-height-content' ).hasClass( 'vc_col-sm-12' ) ) {
							$(this).find( '.vc-match-height-content' ).matchHeight({ byRow: false });
						} else {
							$(this).find( '.vc-match-height-content' ).matchHeight({ byRow: true });	
						}
						//$(this).find( '.vc-match-height-content' ).matchHeight({ byRow: true });
					});
					
					$('.footer-match-height-column').each(function() {
						$(this).find( '.footer-match-height-content' ).matchHeight({ byRow: true });
					});
				}
		
				if(Modernizr.mq('only screen and (max-width: 767px)')) {
					$('.vc-match-height-row').each(function() {
						$(this).find( '.vc-match-height-content' ).matchHeight({ byRow: false });
					});
					
					$('.footer-match-height-column').each(function() {
						$(this).find( '.footer-match-height-content' ).matchHeight({ byRow: false });
					});
				}
				
				if( $('.footer-match-height-column').find('.wpcf7').length > 0 ) {
					$(document).on('wpcf7:submit', function() {
						$.fn.matchHeight._maintainScroll = true;
						$.fn.matchHeight._throttle = 60;
						$.fn.matchHeight._update();
					});
				}
			}
		};
		TpathVcColumnMatchHeight.Init();
		$(window).smartresize( function() {
			TpathVcColumnMatchHeight.Init();	
		});
		
	})(jQuery);
	
	initBlogSlider();
	// Circle Counter	
	initCircleCounter();
	nashville_CartRemoveItem();
	stickyHeaderInit();
	
	(function($) {
		"use strict";
		
		/* Check Slider Enable */
		var slider_class = $('#tpath_wrapper').find('.slider-section').attr('class');
		if( slider_class !== null && slider_class == 'slider-section' ) {
			$('body').addClass('revslider_active');
		}
		
		/* =============================
		ScrollUp
		============================= */
		
		$.scrollUp({
			scrollName: 'back-to-top',      // Element ID
			scrollDistance: 500,         // Distance from top/bottom before showing element (px)
			scrollFrom: 'top',           // 'top' or 'bottom'
			scrollSpeed: 800,            // Speed back to top (ms)
			easingType: 'easeInOutExpo',        // Scroll to top easing (see http://easings.net/)
			animation: 'slide',           // Fade, slide, none
			animationSpeed: 500,         // Animation speed (ms)
			scrollTrigger: false,        // Set a custom triggering element. Can be an HTML string or jQuery object
			scrollTarget: false,         // Set a custom target element for scrolling to. Can be element or number
			scrollText: '<i class="fa fa-heart-o"></i>', // Text for element, can contain HTML
			scrollTitle: false,          // Set a custom <a> title if required.
			scrollImg: false,            // Set true to use image
			activeOverlay: false,        // Set CSS color to display scrollUp active point, e.g '#00FFFF'
			zIndex: 999           		 // Z-Index for the overlay
		});
		
		/* =============================
		Progress Bar
		============================= */
		var bar = $('.progress-bar');
		$(bar).appear(function() {
			bar_width = $(this).attr('aria-valuenow');
			$(this).width(bar_width + '%');
			$(this).find('span').fadeIn(4000);
		});
		
		/* =============================
		Counter Section
		============================= */
		$(".tpath-count-number").appear(function(){
			$(this).each(function(){
				$(this).find('.counter').countTo();
			});
		});
		
		/* ==========================================
		Append Modal Outside all Containers
		========================================== */
		$(".tpath-modal").each( function() {
			$(".wrapper-class").append( jQuery(this) );
		});
		
		/* Nav Search Bar */
		$(document).on( 'click', '.header-search-form .btn-trigger', function( event ){
			event.preventDefault();
			$(this).parent('.header-search-form').find('.search-form').fadeToggle("slow");
			$(this).toggleClass('ion-ios-search', 0);
			$(this).toggleClass('ion-ios-close-empty');
		});
		
		$('.tpath-header-main-bar .search-nav-toggle .btn-search-trigger').on('click', function() {
			$(this).parents('.tpath-header-main-bar').find('#header-toggle-search').fadeToggle("fast");
			$(this).parents('.tpath-header-main-bar').find('#header-toggle-search input.form-control').focus();
			$(this).parents('#header-main').addClass("header-search-visible");
			$(this).parents('#header-logo-bar').addClass("header-search-visible");
		});
		
		$('.btn-search-close').on('click', function() {
			$(this).parent().parent('.header-toggle-content').fadeToggle("fast");
			$(this).parents('#header-main').removeClass("header-search-visible");
			$(this).parents('#header-logo-bar').removeClass("header-search-visible");
		});	
		
		/* PrettyPhoto */
		$('a[rel^="prettyPhoto"], a[data-rel^="prettyPhoto"]').prettyPhoto({
			hook: 'data-rel', 
			social_tools: false, 
			deeplinking: false
		});
		
		/* Entry Date */
		$( '.posted-date .entry-date' ).each(function(){
			var post_date = $(this).text();
			var date_arr = post_date.split(/ +/);
			if(typeof date_arr !== 'undefined' && date_arr.length > 0) {
				$(this).html("");
				
				if( date_arr[0] !== undefined ) {
					$(this).append('<span class="date">' + date_arr[0] + '</span>');
				}
				
				if( date_arr[1] !== undefined ) {
					$(this).append('<span class="month">' + date_arr[1] + '</span>');
				}
				
				if( date_arr[2] !== undefined ) {
					$(this).append('<span class="year">' + date_arr[2] + '</span>');
				}
			}
		});
		
		/* Testimonial */
		$(".tpath-testimonial.slide").find(".item:first").addClass("active");
		$(".tpath-testimonial.slide").find(".carousel-indicators li:first").addClass("active");
			
		$('.widget_categories').find("ul:not(.children)").each(function() {
			$(this).addClass("categories");
		});	
	
		var cat_item = 1;	
		$('.sidebar .widget_categories').find("ul.categories > li").each(function() {
			if( cat_item == 5 ) {
				cat_item = 1;
			}
			$(this).addClass("category-item-" + cat_item);
			cat_item++;
			
			if( ! $(this).hasClass( "current-cat-parent" ) ) {
				if( $(this).find("ul.children > li").hasClass( "current-cat" ) ) {
					$(this).addClass( "current-parent" );
				}
			}
		});
			
		/* Animation */	
		$('.animated').appear(function() {
			var elem = $(this);
			var animation = elem.data('animation');		
			if ( !elem.hasClass('visible') ) {
				var animationDelay = elem.data('animation-delay');
				if ( animationDelay ) {
		
					setTimeout(function(){
						elem.addClass( animation + " visible" );					
					}, animationDelay);			
		
				} else {
					elem.addClass( animation + " visible" );
				}
			}		
		});	
		
		// Contact Form
		$('.tpath-contact-form').each(function(){
			var contact_form_id = $(this).attr('id');
			$('#' + contact_form_id).bootstrapValidator({
				container: 'tooltip',
				message: 'This value is not valid',
				feedbackIcons: {
					valid: 'glyphicon glyphicon-ok',
					invalid: 'glyphicon glyphicon-remove',
					validating: 'glyphicon glyphicon-refresh'
				},
				fields: {				
					contact_name: {                
						validators: {
							notEmpty: {
								message: $(this).data('name_not_empty')
							}
						}
					},
					contact_last_name: {                
						validators: {
							notEmpty: {
								message: $(this).data('name_not_empty')
							}
						}
					},
					contact_email: {
						validators: {
							notEmpty: {
								message: $(this).data('email_not_empty')
							},
							emailAddress: {
								message: $(this).data('email_valid')
							}
						}
					},
					contact_phone: {
						validators: {					
							digits: {
								message: $(this).data('phone_valid')
							}
						}
					},
					contact_message: {
						validators: {
							notEmpty: {
								message: $(this).data('msg_not_empty')
							}                    
						}
					}
				}
			}).on('success.form.bv', function(e) {
												
				e.preventDefault();
				
				var $form        = $(e.target),
					validator    = $form.data('bootstrapValidator'),
					submitButton = validator.getSubmitButton();
				
				$('#' + contact_form_id).addClass('ajax-loader');
				
				var data = $('#' + contact_form_id).serialize();
				
				$.ajax({
					url: ajaxurl,
					type: "POST",
					dataType: 'json',
					data: data + '&action=nashville_sendmail',
					success: function (msg) {
						$('#' + contact_form_id).removeClass('ajax-loader');
						if( msg.status == 'true' ) {
							$('.tpath-form-success').html( '<i class="glyphicon glyphicon-ok"></i> ' + msg.data );
							$('.tpath-form-success').show();
							submitButton.removeAttr("disabled");
							resetForm( $('#' + contact_form_id));
						} else if( msg.status == 'false' ) {
							$('.tpath-form-error').html( '<i class="glyphicon glyphicon-remove"></i> ' + msg.data );
							$('.tpath-form-error').show();
							submitButton.removeAttr("disabled");
							resetForm( $('#' + contact_form_id) );
						}
					}
				});
				return false;
			});
		});
		
		// Mailchimp Form
		$('.tpath-vc-mailchimp-form').each(function(){
			$(this).bootstrapValidator({
				container: 'tooltip',
				message: '',
				feedbackIcons: {
					valid: 'fa fa-check',
					invalid: 'fa fa-times',
					validating: 'fa fa-refresh'
				},
				fields: {            
					subscribe_email: {
						validators: {
							notEmpty: {
								message: 'The email address is required'
							},
							emailAddress: {
								message: 'The input is not a valid email address'
							},
							regexp: {
								regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
								message: 'The value is not a valid email address'
							}
						}
					}			
				}
			}).on('success.form.bv', function(e) {
				
				e.preventDefault();
			
				var $form        = $(e.target),
					validator    = $form.data('bootstrapValidator'),
					submitButton = validator.getSubmitButton();
				
				var getid = $('.tpath-vc-mailchimp-form').attr('id');
				var data = $('#' + getid).serialize();
				
				$.ajax({
					url: ajaxurl,
					type: "POST",
					dataType: 'json',
					data: data + '&action=nashville_mailchimp_subscribe',
					success: function (msg) {
						if( msg.data !== '' ) {
							$('#' + getid).parent().find('.tpath-form-success').html( msg.data );
							$('#' + getid).parent().find('.tpath-form-success').show();
							submitButton.removeAttr("disabled");
							resetForm( $('#' + getid) );
						}
					},
					error: function(msg) {}
				});
			
				return false;        
			});
		});
		
		if(Modernizr.mq('only screen and (max-width: 991px) and (min-width: 768px)')) {
			$('.main-section').find('.woocommerce-products.products').each(function() {
				if( $(this).hasClass( 'products-4' ) || $(this).hasClass( 'products-5' ) ) {
					$(this).each(function(){
						var currentTallest = 0;
						$(this).children().each(function(){
							if( $(this).height() > currentTallest) { currentTallest = $(this).height() + 2; }
						});
						if( Number.prototype.pxToEm ) {
							currentTallest = currentTallest.pxToEm(); //use ems unless px is specified
						}
						// for ie6, set height since min-height isn't supported
						if( $.browser.msie && $.browser.version === 6.0 ) {
							(this).children().css({'height': currentTallest});
						}
						$(this).children().css({'min-height': currentTallest});
					});
				}
			});
		}
	
	})(jQuery);
	
	/* ===================
	Video Script
	=================== */
	$('.wrapper-class').find(".tpath-yt-player").each(function(){
		$(this).mb_YTPlayer();
	});
	
	/* ======================== Day Counter ======================== */
	(function($) { 
		"use strict";
		$('.tpath-daycounter').each(function(){
			var counter_id = $(this).attr('id');
			var counter_type = $(this).data('counter');
			var year = $(this).data('year');
			var month = $(this).data('month');
			var date = $(this).data('date');
			
			var countDay = new Date();
			countDay = new Date(year, month - 1, date);
			
			if( counter_type == "down" ) {
				$("#"+counter_id).countdown({
					labels: ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
					labels1: ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'],
					format: 'odHMS',
					until: countDay
				});
			} else if( counter_type == "up" ) {
				$("#"+counter_id).countdown({
					labels: ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
					labels1: ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'],
					format: 'odHMS',
					since: countDay
				});
			}
			
		});
	})(jQuery);	
	
}); //End document ready function

function resetForm(form) {
	form.find('input:text, input:password, input, input:file, select, textarea').val('');
	form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');		
	form.find('input:text, input:password, input, input:file, select, textarea, input:radio, input:checkbox').parent().find('.form-control-feedback').hide();
}

function stickyHeaderInit(){
	if( jQuery('body').hasClass('header-sticky-enabled') ) {
		var spacing = 0,
		stickyHeader = jQuery('.sticky-header-wrap'),
		headerWrap = jQuery('.header-section');

		if(jQuery('#wpadminbar').length > 0) {
			spacing = 32;
		}
		
		stickyHeader.sticky({
			topSpacing: spacing
		});

		jQuery(window).smartresize( function() {
			stickyHeader.sticky('update');
		});
		
		if( jQuery(".header-section").hasClass( 'header-styleone' ) ) {
			stickyHeader.on('sticky-start', function() {
				if(Modernizr.mq('only screen and (max-width: 767px)')) {
					var sticky_height = '80px';
				} else {
					var sticky_height = '142px';
				}
				stickyHeader.parent('.sticky-wrapper').css({ "height": sticky_height });
			});
		} else {
			stickyHeader.on('sticky-start', function() {
				if(Modernizr.mq('only screen and (max-width: 767px)')) {
					var sticky_height = '80px';
				} else {
					var sticky_height = '100px';
				}
				stickyHeader.parent('.sticky-wrapper').css({ "height": sticky_height });
			});
		}

		if( jQuery('body').hasClass('boxed') ) {
			jQuery('.sticky-header-wrap').css('max-width', headerWrap.width());
			jQuery(window).smartresize( function() {
				jQuery('.sticky-header-wrap').css('max-width', headerWrap.width());
			});
		}
		
		// Sticky Header Hiding
		if( jQuery('body').hasClass('header-sticky-hide') ) {
			var lastTop = 0;
			
			jQuery(window).scroll(function(event){
				var currentTop = jQuery(this).scrollTop();
				var headerHide = 800;
				
				if( currentTop > lastTop && currentTop > headerHide ){
					jQuery('.sticky-header-wrap').addClass('sticky-header-hide');
				} else if( jQuery('.sticky-header-wrap').hasClass('sticky-header-hide') ) {
					jQuery('.sticky-header-wrap').removeClass('sticky-header-hide');
				}
				lastTop = currentTop;
			});
		}
		
	}
}

function initBlogSlider() {
    "use strict";
	
	var isRTL = jQuery('body').hasClass( 'rtl' ) ? true : false;
	
	jQuery('.owl-carousel.blog-carousel-slider').each( function() {
		var $carousel = jQuery( this );
		$carousel.owlCarousel( {
			rtl				: isRTL,
			dots            : false,
			items           : 1,
			slideBy         : 1,
			loop            : false,			
			nav             : true,
			autoplay        : $carousel.data( "autoplay" ),
			autoplayTimeout : $carousel.data( "autoplay-timeout" ),
			navText         : [ '<span class="tpath-owl-prev"></span>', '<span class="tpath-owl-next"></span>' ],
			animateOut 		: $carousel.data( "animate-out" ),
			animateIn 		: $carousel.data( "animate-in" ),
			smartSpeed 		: $carousel.data( "smart-speed" ),
			fallbackEasing 	: 'easeInOutExpo',
			responsive      : {
				0: {
					items   : 1
				},
				480: {
					 items  : 1
				},
				768: {
					items   : 1
				},
				980: {
					items   : 1
				}
			}
		} );
	} );
	
	window.dispatchEvent(new Event('resize'));
}

function nashville_initBlogGrid() {
		
	if(Modernizr.mq('only screen and (min-width: 1025px)')) {
		jQuery('.grid-col-2').imagesLoaded( function() {
			var gridwidth = Math.floor( jQuery('.grid-col-2').width() / 2 );
			//var masonryWidth = Math.floor( gridwidth - 15 );
			jQuery('.grid-col-2 .grid-posts').css('width', gridwidth);
					
			jQuery('.grid-col-2').masonry({
				itemSelector: '.grid-posts',
				columnWidth: gridwidth,
				gutter: 0
				//gutter: 30
			});
			
			jQuery('.grid-col-2').find('.owl-carousel.blog-carousel-slider').each(function(){
				initBlogSlider();
			});
			jQuery('.grid-col-2').masonry();
		});	
		
		jQuery('.grid-col-3').imagesLoaded( function() {
			var gridwidth = Math.floor( jQuery('.grid-col-3').width() / 3 );
			//var masonryWidth = Math.floor( gridwidth - 20 );	
			jQuery('.grid-col-3 .grid-posts').css('width', gridwidth);
			
			jQuery('.grid-col-3').masonry({
				itemSelector: '.grid-posts',
				columnWidth: gridwidth,
				gutter: 0
				//gutter: 30
			});			
			
			jQuery('.grid-col-3').find('.owl-carousel.blog-carousel-slider').each(function(){
				initBlogSlider();
			});
			jQuery('.grid-col-3').masonry();
		});
		
		jQuery('.grid-col-4').imagesLoaded( function() {
			var gridwidth = Math.floor( jQuery('.grid-col-4').width() / 4 );
			//var masonryWidth = Math.floor( gridwidth - 22.5 );
			jQuery('.grid-col-4 .grid-posts').css('width', gridwidth);
			
			jQuery('.grid-col-4').masonry({
				itemSelector: '.grid-posts',
				columnWidth: gridwidth,
				gutter: 0
				//gutter: 30
			});
		
			jQuery('.grid-col-4').find('.owl-carousel.blog-carousel-slider').each(function(){
				initBlogSlider();
			});
			jQuery('.grid-col-4').masonry();
		});
	}
	
	if(Modernizr.mq('only screen and (max-width: 1024px) and (min-width: 768px)')) {
		if( jQuery('body').hasClass( 'three-col-middle' ) || jQuery('body').hasClass( 'three-col-right' ) || jQuery('body').hasClass( 'three-col-left' ) ) {
			jQuery('.three-col-middle .grid-col-2 .grid-posts, .three-col-right .grid-col-2 .grid-posts, .three-col-left .grid-col-2 .grid-posts, .three-col-middle .grid-col-3 .grid-posts, .three-col-right .grid-col-3 .grid-posts, .three-col-left .grid-col-3 .grid-posts, .three-col-middle .grid-col-4 .grid-posts, .three-col-right .grid-col-4 .grid-posts, .three-col-left .grid-col-4 .grid-posts').imagesLoaded( function() {
				jQuery('.three-col-middle .grid-col-2 .grid-posts, .three-col-right .grid-col-2 .grid-posts, .three-col-left .grid-col-2 .grid-posts, .three-col-middle .grid-col-3 .grid-posts, .three-col-right .grid-col-3 .grid-posts, .three-col-left .grid-col-3 .grid-posts, .three-col-middle .grid-col-4 .grid-posts, .three-col-right .grid-col-4 .grid-posts, .three-col-left .grid-col-4 .grid-posts').css('width', '100%');
				jQuery('.three-col-middle .grid-col-2, .three-col-right .grid-col-2, .three-col-left .grid-col-2, .three-col-middle .grid-col-3, .three-col-right .grid-col-3, .three-col-left .grid-col-3, .three-col-middle .grid-col-4, .three-col-right .grid-col-4, .three-col-left .grid-col-4').isotope({
					resizable: false,
					masonry: {
						columnWidth: '.grid-posts',
						gutter: 0
					}
				});
				
				jQuery('.three-col-middle .grid-col-2, .three-col-right .grid-col-2, .three-col-left .grid-col-2, .three-col-middle .grid-col-3, .three-col-right .grid-col-3, .three-col-left .grid-col-3, .three-col-middle .grid-col-4, .three-col-right .grid-col-4, .three-col-left .grid-col-4').find('.owl-carousel.blog-carousel-slider').each(function(){
					initBlogSlider();
				});
				jQuery('.three-col-middle .grid-col-2, .three-col-right .grid-col-2, .three-col-left .grid-col-2, .three-col-middle .grid-col-3, .three-col-right .grid-col-3, .three-col-left .grid-col-3, .three-col-middle .grid-col-4, .three-col-right .grid-col-4, .three-col-left .grid-col-4').masonry();
			});
		} else {
			
			jQuery('.grid-col-2 .grid-posts, .grid-col-3 .grid-posts, .grid-col-4 .grid-posts').imagesLoaded( function() {
				var gridwidth = Math.floor( jQuery('.grid-col-2, .grid-col-3, .grid-col-4').width() / 2 );
				//var masonryWidth = Math.floor( gridwidth - 15 );
				
				jQuery('.grid-col-2 .grid-posts, .grid-col-3 .grid-posts, .grid-col-4 .grid-posts').css('width', gridwidth);
				jQuery('.grid-col-2, .grid-col-3, .grid-col-4').masonry({
					itemSelector: '.grid-posts',
					columnWidth: gridwidth,
					gutter: 0
					//gutter: 30
				});
				
				jQuery('.grid-col-2, .grid-col-3, .grid-col-4').find('.owl-carousel.blog-carousel-slider').each(function(){
					initBlogSlider();
				});
				
				jQuery('.grid-col-2, .grid-col-3, .grid-col-4').masonry();
			});
			
		}
	}	
	
	if(Modernizr.mq('only screen and (max-width: 767px)')) {
		jQuery('.grid-col-2 .grid-posts, .grid-col-3 .grid-posts, .grid-col-4 .grid-posts').imagesLoaded( function() {
			jQuery('.grid-col-2 .grid-posts, .grid-col-3 .grid-posts, .grid-col-4 .grid-posts').css('width', '100%');
			jQuery('.grid-col-2, .grid-col-3, .grid-col-4').masonry({
				itemSelector: '.grid-posts',
				columnWidth: '.grid-posts',
				gutter: 0
			});
			
			jQuery('.grid-col-2, .grid-col-3, .grid-col-4').find('.owl-carousel.blog-carousel-slider').each(function(){
				initBlogSlider();
			});
			jQuery('.grid-col-2, .grid-col-3, .grid-col-4').masonry();
		});
	}
}

function nashville_initBlogInfiniteScroll() {
	
	var curPage = 1;
	var pagesNum = jQuery('ul.pagination').find("a.page-numbers:not('.current, .next, .prev'):last").text();
	
	jQuery('.tpath-posts-container.scroll-infinite').each(function() {
		var $infinite_container = jQuery(this);
		
		jQuery( $infinite_container ).infinitescroll({
			navSelector  : "ul.pagination",	
			nextSelector : "ul.pagination li a.next",
			itemSelector : "article.post",
			loading	  	 : {
							finishedMsg: '<span class="all-loaded">'+ nashville_js_vars.nashville_scroll_text +'</span>',
							msg: null,
							img: nashville_js_vars.nashville_template_uri + "/images/ajax-loader.gif",
							msgText: "",
			},
			errorCallback: function() {
				jQuery( $infinite_container ).masonry();
			}
		}, function( newPosts ) {
			
			var $newPosts = jQuery( newPosts );
			
			curPage++;

			if(curPage == pagesNum) {
				jQuery(window).unbind('.infscr');
			}
			
			$newPosts.hide();
			$newPosts.imagesLoaded(function() {
				$newPosts.fadeIn();
				
				// Relayout Masonry
				if( $infinite_container.hasClass('grid-layout') ) {
					$infinite_container.masonry('appended', $newPosts);
				}
			});
			
			// Relayout Masonry Columns
			if(Modernizr.mq('only screen and (min-width: 1025px)')) {
				var gridwidth = ( jQuery('.grid-layout.grid-col-2').width() / 2 );
				jQuery('.grid-layout.grid-col-2 .grid-posts').css('width', gridwidth);
	
				var gridwidth = ( jQuery('.grid-layout.grid-col-3').width() / 3 );
				jQuery('.grid-layout.grid-col-3 .grid-posts').css('width', gridwidth);
	
				var gridwidth = ( jQuery('.grid-layout.grid-col-4').width() / 4 );
				jQuery('.grid-layout.grid-col-4 .grid-posts').css('width', gridwidth);
			}
			
			if(Modernizr.mq('only screen and (max-width: 1024px) and (min-width: 768px)')) {
				if( jQuery('body').hasClass( 'three-col-middle' ) || jQuery('body').hasClass( 'three-col-right' ) || jQuery('body').hasClass( 'three-col-left' ) ) {
					
					jQuery('.three-col-middle .grid-layout.grid-col-2 .grid-posts, .three-col-right .grid-layout.grid-col-2 .grid-posts, .three-col-left .grid-layout.grid-col-2 .grid-posts, .three-col-middle .grid-layout.grid-col-3 .grid-posts, .three-col-right .grid-layout.grid-col-3 .grid-posts, .three-col-left .grid-layout.grid-col-3 .grid-posts, .three-col-middle .grid-layout.grid-col-4 .grid-posts, .three-col-right .grid-layout.grid-col-4 .grid-posts, .three-col-left .grid-layout.grid-col-4 .grid-posts').css('width', '100%');
				} else {			
					var gridwidth = ( jQuery('.grid-col-2, .grid-col-3, .grid-col-4').width() / 2 );
					jQuery('.grid-layout.grid-col-2 .grid-posts, .grid-layout.grid-col-3 .grid-posts, .grid-layout.grid-col-4 .grid-posts').css('width', gridwidth);						
				}
			}
			
			if(Modernizr.mq('only screen and (max-width: 767px)')) {
				jQuery('.grid-layout.grid-col-2 .grid-posts, .grid-layout.grid-col-3 .grid-posts, .grid-layout.grid-col-4 .grid-posts').css('width', '100%');
			}
			
			if( typeof jQuery.fn.mediaelementplayer !== 'undefined' && jQuery.isFunction( jQuery.fn.mediaelementplayer ) ) {
				$newPosts.find('audio, video').mediaelementplayer();
			}
			
			$newPosts.find("a[rel^='prettyPhoto'], a[data-rel^='prettyPhoto']").prettyPhoto({hook: 'data-rel', social_tools: false, deeplinking: false});
			
			setTimeout(function() {
				$newPosts.find('.owl-carousel.blog-carousel-slider').each( function() {
					initBlogSlider();
				});
			}, 600);
		});
	});
}

/* ======================== Circle Counter ======================== */

var rart = rart || {};
	
var isMobile = function() {
	var check = false;
	(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

function initCircleCounter(barcolor) {	
	
	function tpath_Piechart(target, barcolor){
		if(target === undefined) {
			target = jQuery('.tpath-piechart');
		}
		
		if( target.length != 0 && jQuery().easyPieChart ) {
			
			if(barcolor === undefined) {
				var barcolor = target.data('barcolor');
			}
			
			var trackcolor = target.data('trackcolor');
			if(trackcolor === undefined) {
				var trackcolor = false;
			}
			
			var size = target.parents('.tpath-piechart-counter').data('circle');
			if(size === undefined) {
				var size = 152;
			}
			var linewidth = target.parents('.tpath-piechart-counter').data('linewidth');
			if(linewidth === undefined) {
				var linewidth = 6;
			}
			
			target.easyPieChart({
				animate: 3000,
				barColor: barcolor,
				trackColor: trackcolor,
				easing: 'easeOutBounce',
				size: size,
				lineWidth: linewidth,
				rotate: -90,
				lineCap: 'rectAngle', // rectAngle or round
				scaleColor: false,
				onStep: function(from, to, percent) {
					jQuery(this.el).find('span.piechart-count').text( Math.round(percent) );
				}
			});
		}	
	}
	
	if( !isMobile() && jQuery().appear )
	{
		jQuery('.tpath-piechart').appear(function() {
			tpath_Piechart(jQuery(this), barcolor);
		});
	}
	else{
		jQuery('.tpath-piechart').appear(function() {
			tpath_Piechart(jQuery(this), barcolor, '');
		});
	}	
}

jQuery(document).ajaxComplete(function(event, xhr, settings) {
	nashville_ajax_complete();
	
	jQuery('a[rel^="prettyPhoto"], a[data-rel^="prettyPhoto"], a.prettyphoto').prettyPhoto({
		hook: 'data-rel', 
		social_tools: false, 
		deeplinking: false,
		modal: false
	});
});

function nashville_ajax_complete() {	
	nashville_CartRemoveItem();
}

/* ======================== Woocommerce Ajax Mini Cart Remove ======================== */

function nashville_CartRemoveItem() {
	jQuery('.woo-cart-item .remove-cart-item').unbind('click').click(function(){
		var $this = jQuery(this);
		var cart_id = $this.data("cart_id");
		$this.parent().find('.ajax-loading').show();

		jQuery.ajax({
			type: 'POST',
			dataType: 'json',
			url: nashville_js_vars.nashville_ajax_url,
			data: { action: "nashville_product_remove",
				cart_id: cart_id
			},success: function( response ) {
				var fragments = response.fragments;
				var cart_hash = response.cart_hash;

				if ( fragments ) {
					jQuery.each(fragments, function(key, value) {
						jQuery(key).replaceWith(value);
					});
				}
			}
		});
		return false;
	});
}
/* ======================== Google Map ======================== */
window.onload = MapLoadScript;
var google;
function GmapInit() {
	  Gmap = jQuery('.gmap_canvas');
	  Gmap.each(function() {		
		var $this           = jQuery(this),
			zoom            = 12,
			scrollwheel     = false,
			zoomcontrol 	= true,
			draggable       = true,
			mapType         = google.maps.MapTypeId.ROADMAP,
			title           = '',
			contentString   = '',
			dataAddress     = $this.data('address'),
			dataZoom        = $this.data('zoom'),
			dataType        = $this.data('type'),
			dataStyleType   = $this.data('styletype'),
			dataScrollwheel = $this.data('scrollwheel'),
			dataZoomcontrol = $this.data('zoomcontrol'),
			dataHue         = $this.data('hue'),
			dataSaturation  = $this.data('saturation'),
			dataLightness   = $this.data('lightness');
			
		var latlngArray = dataAddress.split(',');
		var lat = parseFloat(latlngArray[0]);
		var lng = parseFloat(latlngArray[1]);
				
		if( dataZoom !== undefined && dataZoom !== false ) {
			zoom = parseFloat(dataZoom);
		}
		if( dataScrollwheel !== undefined && dataScrollwheel !== null ) {
			scrollwheel = dataScrollwheel;
		}
		if( dataZoomcontrol !== undefined && dataZoomcontrol !== null ) {
			zoomcontrol = dataZoomcontrol;
		}
		if( dataType !== undefined && dataType !== false ) {
			if( dataType == 'satellite' ) {
				mapType = google.maps.MapTypeId.SATELLITE;
			} else if( dataType == 'hybrid' ) {
				mapType = google.maps.MapTypeId.HYBRID;
			} else if( dataType == 'terrain' ) {
				mapType = google.maps.MapTypeId.TERRAIN;
			}		  	
		}
		
		if( navigator.userAgent.match(/iPad|iPhone|Android/i) ) {
			draggable = false;
		}
		
		var mapOptions = {
		  zoom        : zoom,
		  scrollwheel : scrollwheel,
		  zoomControl : zoomcontrol,
		  draggable   : draggable,
		  center      : new google.maps.LatLng(lat, lng),
		  mapTypeId   : mapType
		};		
		var map = new google.maps.Map($this[0], mapOptions);
		
		var show_marker = $this.data('marker');
		var image = $this.data('markerimg');
		
		var contents    = $this.data('content');
		var titles 		= $this.data('title');
		
		if( ( contents !== undefined && contents !== false ) || ( titles !== undefined && titles !== false ) ) {
			var contentArray = contents.split('|');
			var titleArray   = titles.split(',');
		}
		
		var addresses    = $this.data('addresses');
		if( show_marker !== undefined && show_marker == 'yes' ) {
			if( addresses !== undefined && addresses !== '' ) {
				var addressArray = addresses.split('|');
				var address = [];
				
				for (var i = 0; i < addressArray.length; i++) {
					address[i] = addressArray[i];
					var latlngArray = address[i].split(',');
					var lat1 = parseFloat(latlngArray[0]);
					var lng1 = parseFloat(latlngArray[1]);
					
					var marker = new google.maps.Marker({
					  position : new google.maps.LatLng(lat1, lng1),
					  map      : map,
					  icon     : image,
					  title    : titleArray[i]
					});
					
					if( contents !== undefined && contents !== '' ) {
						marker.content = '<div class="map-data">';
						marker.content += '<h6>' + titleArray[i] + '</h6>';
						marker.content += '<div class="map-content">';
						var contentNew = contentArray[i].split(',');
						
						for (var j = 0; j < contentNew.length; j++) {
							if( j == 0 ) {
								marker.content += contentNew[j];
							} else {
								marker.content += '<br>' + contentNew[j];
							}
						}
						marker.content += '</div>' + '</div>';
						
						marker.info = new google.maps.InfoWindow();
						google.maps.event.addListener(marker, 'click', function() {
							marker.info.setContent(this.content);
							marker.info.open(this.getMap(), this);
						});
					}
				}
			} else {
				var marker = new google.maps.Marker({
				  position : new google.maps.LatLng(lat, lng),
				  map      : map,
				  icon     : image
				});
				
				if( contents !== undefined && contents !== '' ) {
					marker.content = '<div class="map-data">' + '<h6>' + titles + '</h6>' + '<div class="map-content">' + contents + '</div>' + '</div>';
				}
				var d_infowindow = new google.maps.InfoWindow();
				
				if( contents !== undefined && contents !== '' ) {
					google.maps.event.addListener(marker, 'click', function() {
						d_infowindow.setContent(this.content);
						d_infowindow.open(this.getMap(), this);
					});
				}
			}
		}
		
		if( dataStyleType !== undefined && dataStyleType === 'theme_style' ) {
			var styles = [
						{
							"featureType": "administrative",
							"elementType": "geometry.stroke",
							"stylers": [
								{
									"lightness": 35
								},
								{
									"visibility": "on"
								}
							]
						},
						{
							"featureType": "administrative",
							"elementType": "labels",
							"stylers": [
								{
									"saturation": -100
								}
							]
						},
						{
							"featureType": "administrative.neighborhood",
							"elementType": "labels.text",
							"stylers": [
								{
									"lightness": -40
								}
							]
						},
						{
							"featureType": "landscape",
							"elementType": "geometry",
							"stylers": [
								{
									"color": "#e5f0f0"
								}
							]
						},
						{
							"featureType": "landscape.man_made",
							"elementType": "geometry",
							"stylers": [
								{
									"saturation": 30
								},
								{
									"lightness": 40
								},
								{
									"visibility": "on"
								}
							]
						},
						{
							"featureType": "landscape.natural",
							"elementType": "labels.icon",
							"stylers": [
								{
									"saturation": 30
								}
							]
						},
						{
							"featureType": "landscape.natural",
							"elementType": "labels.text.fill",
							"stylers": [
								{
									"saturation": 35
								},
								{
									"lightness": -35
								}
							]
						},
						{
							"featureType": "landscape.natural",
							"elementType": "labels.text.stroke",
							"stylers": [
								{
									"saturation": 30
								},
								{
									"lightness": 100
								},
								{
									"weight": 2
								}
							]
						},
						{
							"featureType": "poi",
							"elementType": "geometry",
							"stylers": [
								{
									"saturation": -100
								},
								{
									"lightness": 80
								}
							]
						},
						{
							"featureType": "poi",
							"elementType": "labels",
							"stylers": [
								{
									"saturation": -100
								},
								{
									"lightness": 5
								}
							]
						},
						{
							"featureType": "poi.attraction",
							"elementType": "geometry",
							"stylers": [
								{
									"saturation": -100
								},
								{
									"lightness": -5
								}
							]
						},
						{
							"featureType": "poi.park",
							"elementType": "geometry",
							"stylers": [
								{
									"color": "#aadfde"
								},
								{
									"saturation": 20
								},
								{
									"lightness": 20
								},
								{
									"visibility": "on"
								}
							]
						},
						{
							"featureType": "poi.park",
							"elementType": "labels",
							"stylers": [
								{
									"lightness": 20
								},
								{
									"visibility": "on"
								}
							]
						},
						{
							"featureType": "road",
							"stylers": [
								{
									"lightness": 20
								}
							]
						},
						{
							"featureType": "road",
							"elementType": "labels",
							"stylers": [
								{
									"saturation": -100
								}
							]
						},
						{
							"featureType": "road",
							"elementType": "labels.icon",
							"stylers": [
								{
									"saturation": -100
								}
							]
						},
						{
							"featureType": "road.highway",
							"elementType": "geometry",
							"stylers": [
								{
									"color": "#ffffff"
								},
								{
									"saturation": -100
								}
							]
						},
						{
							"featureType": "road.highway",
							"elementType": "geometry.stroke",
							"stylers": [
								{
									"lightness": -15
								}
							]
						},
						{
							"featureType": "water",
							"stylers": [
								{
									"color": "#b3fffe"
								},
								{
									"visibility": "on"
								}
							]
						},
						{
							"featureType": "water",
							"elementType": "geometry",
							"stylers": [
								{
									"saturation": 55
								}
							]
						},
						{
							"featureType": "water",
							"elementType": "labels.text.fill",
							"stylers": [
								{
									"saturation": 15
								},
								{
									"lightness": -60
								}
							]
						},
						{
							"featureType": "water",
							"elementType": "labels.text.stroke",
							"stylers": [
								{
									"lightness": 60
								}
							]
						}
					];
			map.setOptions({styles: styles});
		}
		else {
			if( dataHue !== undefined && dataHue !== '' ) {
			  var styles = [
				{
				  stylers : [
					{ hue : dataHue },
					{ saturation: dataSaturation },
					{ lightness: dataLightness }
				  ]
				}
			  ];
			  map.setOptions({styles: styles});
			}
		}
	 });
}
	
function MapLoadScript() {
	if( typeof google !== 'undefined' && typeof google === 'object' ) {
		if( typeof google.maps === 'object' ) {
			GmapInit();
		}
	}
}