(function($) {
	$.extend($.fn, {
		jsTemplate: function( template, jsonObjects, prop ) {
			if(!template || !jsonObjects) {
				var errorMsg = '';
				if(!template) {
					errorMsg += 'template is required.\n';
				}
				if(!jsonObjects) {
					errorMsg += 'jsonObjects is required.';
				}
				
				if(window.console) {
					console.error ? console.error( errorMsg ) : console.log( errorMsg );
					return;
				}
				alert( errorMsg );
				return;
			}

			var constructedTemplate = [];

			$( jsonObjects ).each(function(index, item) {
				var templateClone = $( "<div></div>" ).html( template ).html();
				if($.type(item) == "object") {
					$.each(item, function(k, v) {
						var templateKey = "{@:" + k + "}",
						regEx = new RegExp(templateKey, "g");
						
						if(template.indexOf( templateKey ) != -1) {
							templateClone = templateClone.replace( regEx, v );
						}
					});
				}
				else if(prop != null) {
					var templateKey = "{@:" + prop + "}",
					regEx = new RegExp(templateKey, "g");
					
					if(template.indexOf( templateKey ) != -1) {
						templateClone = templateClone.replace( regEx, item );
					}
				}
				constructedTemplate.push( templateClone );
			});

			return constructedTemplate;
		}
	});
})(jQuery);
