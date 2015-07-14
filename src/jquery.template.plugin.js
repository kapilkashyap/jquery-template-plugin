/*
 * jQuery Template Plugin
 * Copyright (c) 2015 Kapil Kashyap
 *
 * Depends:
 *   - jQuery 1.6+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   - http://www.opensource.org/licenses/mit-license.php
 *   - http://www.gnu.org/licenses/gpl.html
 */
(function($) {
	$.extend($.fn, {
		jsTemplate: function( config ) {
			if(!config.template || !config.jsonObjects) {
				var errorMsg = '';
				if(!config.template) {
					errorMsg += 'template is required.\n';
				}
				if(!config.jsonObjects) {
					errorMsg += 'jsonObjects is required.';
				}
				
				if(window.console) {
					console.error ? console.error( errorMsg ) : console.log( errorMsg );
					return;
				}
				alert( errorMsg );
				return;
			}

			config.highlight = $.extend({
				apply: false,
				markup: "<u>,</u>",
				value: ""
			}, config.highlight || {});

			var constructedTemplate = [],
				matchedText = null,
	    		highlightedText = null,
	    		singleValue = (config.highlight.value.length === 1),
	    		escapedRegExp = config.highlight.value.replace(/[\-\[\]{}()*+?.\\\^$#\s]/g,"\\$&"),
	    		highlightRegExp = new RegExp(escapedRegExp, "ig"),
	    		highlightTextMarkup = config.highlight.markup.split(","),
	    		highlightQueryText = function(text) {
		    		highlightedText = "";
	    			matchedText = text.match(highlightRegExp);
	    			if(matchedText && matchedText.length > 0) {
	    				matchedText = singleValue ? matchedText[0].toLowerCase() : matchedText[0];
	    				highlightedText = highlightTextMarkup[0] + matchedText + highlightTextMarkup[1];
						text = text.replace(highlightRegExp, highlightedText);
	    			}
	    			return text;
	    		};

			$( config.jsonObjects ).each(function(index, item) {
				var templateClone = $( "<div></div>" ).html( config.template ).html();
					
				if($.type(item) == "object") {
					$.each(item, function(k, v) {
						var templateKey = "{@:" + k + "}",
							escapeHighlightTemplateKey = "{!@:" + k + "}",
							regEx = new RegExp(templateKey, "g"),
							templateCloned = false;
						
						if(config.template.indexOf( templateKey ) != -1) {
							templateClone = templateClone.replace( regEx, config.highlight.apply ? highlightQueryText(v) : v );
							templateCloned = true;
						}
						if(!templateCloned && config.template.indexOf( escapeHighlightTemplateKey ) != -1) {
							templateClone = templateClone.replace( escapeHighlightTemplateKey, v );
						}
					});
				}
				else if(config.prop != null) {
					var templateKey = "{@:" + config.prop + "}",
						escapeHighlightTemplateKey = "{!@:" + config.prop + "}",
						regEx = new RegExp(templateKey, "g"),
						templateCloned = false;
					
					if(config.template.indexOf( templateKey ) != -1) {
						templateClone = templateClone.replace( regEx, config.highlight.apply ? highlightQueryText(item) : item );
						templateCloned = true;
					}
					if(!templateCloned && config.template.indexOf( escapeHighlightTemplateKey ) != -1) {
						templateClone = templateClone.replace( escapeHighlightTemplateKey, item );
					}
				}
				constructedTemplate.push( templateClone );
			});

			return constructedTemplate;
		}
	});
})(jQuery);