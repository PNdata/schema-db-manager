class Application{

	constructor() {
		this.token = "";
	}

	isConnect() {
		return (!this.readCookie('token') || !this.readCookie("username") || !this.readCookie('password')) ? false : true;
	}

	readCookie(name) {
		var nameEQ 	= name + "=";
		var ca 		= document.cookie.split(';');
		var c;
		for(var i = 0; i < ca.length; i++) {
			c 	= ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return (c.substring(nameEQ.length, c.length));
		}
		return (null);
	}

	deleteCookie( name ) {
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}

	getParams(name, url) {
		if (!url) url 	= location.href;
		name 		= name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS 	= "[\\?&]"+name+"=([^&#]*)";
		var regex 	= new RegExp( regexS );
		var results 	= regex.exec( url );
		return ((results == null) ? null : results[1]);
	}
}

export { Application as default }
