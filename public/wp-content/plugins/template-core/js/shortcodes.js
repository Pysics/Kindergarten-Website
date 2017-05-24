jQuery(document).ready(function($) {
	// Testimonial Ticker Slider
	$('.testimonial-ticker-slider').each(function() {
		$('.testimonial-ticker-slider').easyTicker({
			direction: 'up',
			speed: 'slow',
			interval: 3000,
			height: 'auto',
			visible: 2,
			mousePause: 0
		});	
	});
	
	// Twitter Feed Slider
	$('.tpath-twitter-slide').each(function() {
		var visible = $(this).data('visible');
		$('.tpath-twitter-slide').easyTicker({
			direction: 'up',
			speed: 'slow',
			interval: 3000,
			height: 'auto',
			visible: visible,
			mousePause: 0
		});	
	});
	
	/* =============================
	Text Slider
	============================= */
	$('.tpath-text-slider').each(function() {

		var text_id = $(this).attr('id');
		var direction = $('#'+text_id+'').data('direction');
		var interval = $('#'+text_id+'').data('interval');
		
		$('#'+text_id+'').easyTicker({
			direction: direction,		
			speed: 'slow',
			interval: interval,
			height: 'auto',
			visible: 1,
			mousePause: 0
		});
		
	});
								
	// Mailchimp Form
	$('.tpath-mailchimp-form').each(function(){
		$(this).bootstrapValidator({
			container: 'tooltip',
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
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
				},
			}
		}).on('success.form.bv', function(e) {
											
			e.preventDefault();
			
			var $form        = $(e.target),
				validator    = $form.data('bootstrapValidator'),
				submitButton = validator.getSubmitButton();
			
			$('.tpath-mailchimp-form').addClass('ajax-loader');
			var getid = $('.tpath-mailchimp-form').attr('id');
			var data = $('#' + getid).serialize();
			
			$.ajax({
					url: nashville_js_vars.nashville_ajax_url,
					type: "POST",
					dataType: 'json',
					data: data + '&action=template_core_mailchimp_subscribe',
					success: function (msg) {
						$('.tpath-mailchimp-form').removeClass('ajax-loader');
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
	
	function resetForm($form) {
		$form.find('input:text, input:password, input, input:file, select, textarea').val('');
		$form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');		
		$form.find('input:text, input:password, input, input:file, select, textarea, input:radio, input:checkbox').parent().find('.form-control-feedback').hide();
	}
});