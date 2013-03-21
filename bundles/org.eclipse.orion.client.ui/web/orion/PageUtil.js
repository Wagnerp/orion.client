/*******************************************************************************
 * @license
 * Copyright (c) 2012 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
/*global define console window document*/

define(function(){

	var legalURICharacters = /^(?:[a-zA-Z0-9-_.!~*'()#;,\/?:@&=+$\[\]]|%[0-9A-F][0-9A-F])*$/;
	
	function matchResourceParameters(optURIText) {
		optURIText = optURIText || window.location.toString();
		var result = {resource:""};
		var hashIndex = optURIText.indexOf("#"); //$NON-NLS-0$
		if (hashIndex !== -1) {
			var text = optURIText.substring(hashIndex + 1);
			if (text.length !== 0) {
				var params = text.split(","); //$NON-NLS-0$
				Object.defineProperty(result, "resourceRaw", {value: params[0]});
				result.resource = decodeURIComponent(params[0]);
				// FF and Safari can decode the hash
				// this a best effort to detect and correct problems
				if (!result.resource.match(legalURICharacters)) {
					result.resource = encodeURI(result.resource).replace(/%5B/g, '[').replace(/%5D/g, ']'); //$NON-NLS-1$ //$NON-NLS-0$
				}
				for (var i = 1; i < params.length; i++) {
					//We can not use params[i].split("=") here because a param's value may contain "=", which is not encoded.
					var pair = params[i];
					var parsed = /([^=]*)(=?)(.*)/.exec(pair);
					var name = decodeURIComponent(parsed[1] || ""); //$NON-NLS-0$
					var value = decodeURIComponent(parsed[3] || ""); //$NON-NLS-0$
					if(name !== "" && name !== "resource"){ //$NON-NLS-0$ //$NON-NLS-0$
						result[name] = value;
					}
				}
			}			
		}
		return result;
	}
	
	var httpOrHttps = new RegExp("^http[s]?","i");

	function validateURLScheme(url, optAllowedSchemes) {
		var absoluteURL = url;
		if (url.indexOf("://") === -1) { //$NON-NLS-0$
			var temp = document.createElement('a'); //$NON-NLS-0$
			temp.href = url;
	        absoluteURL = temp.href;
		}
		var match = false;
		if (optAllowedSchemes) {
			match = optAllowedSchemes.some(function(scheme){
				return new RegExp("^" + scheme + ":", "i").test(absoluteURL);
			});
		} else {
			match = httpOrHttps.test(absoluteURL);
		}
		if (match) {
			return url;
		} else {
			console.log("Illegal URL Scheme: '" + url + "'");
			return "";
		}
	}
	return {
		matchResourceParameters: matchResourceParameters,
		validateURLScheme: validateURLScheme	
	};
});