window.addEvent('domready', function() {
	/* Hides the label of an input when selected. */
	$$('#headerSearch input').each(function(input) {
		var fieldId = input.get('id');
		if (fieldId) {
			var theValue = $$('#' + fieldId).get('value');
			$$('#' + fieldId).filter(function(item) { return ['text', 'password'].contains(item.get('type').toLowerCase()); }).each(function(field) {
				field.addEvents({
					focus: function() {
						if(field.value == theValue){
							field.value = '';
						}
					},
					blur: function() {
						if(field.value == ''){
							field.value = theValue;
						}
					}
				});
			});
		}
	});
	
	// Add a class to the first last element explanation
	//$$('.formbody').getFirst('div').addClass('first');
	if($$('.explanation').getLast())
	{
		$$('.explanation').getLast().addClass('last');
	}
});