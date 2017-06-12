	import http 	from 	'axios'
	import Store 	from 	'./store'

	export default class Api{
		constructor(url){
			if (!this.readCookie('token'))
				return;
			this.token 	= this.readCookie('token')
			this.url 	= (url) ? url : "http://localhost/campn-server/schemas";
			this.schemas 	= [];
		}
		getParams(name, url) {
			if (!url) url 	= location.href;
			name 		= name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
			var regexS 	= "[\\?&]"+name+"=([^&#]*)";
			var regex 	= new RegExp( regexS );
			var results 	= regex.exec( url );
			return ((results == null) ? null : results[1]);
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
		post(datas) {

			return new Promise((resolve, reject) => {
				http({
					method 	: 'post',
					url 		: this.url + '?token='+this.token,
					data 		: datas
				}).then(response => {
					resolve(response.data);
				}).catch(error => {
					reject(error)
				});
			});

		}
		get() {

			if (!this.url)
				return new Promise((resolve, reject) => {
					resolve(false);
				})
			return new Promise((resolve, reject) => {

				http.get(this.url + '?token='+this.token).then(response=> {
					this.schemas = response.data.data;
					resolve(this.schemas);
				}).catch(error => {
					reject(error)
				});
			})

		}
		findOneByName(name) {
			return new Promise((resolve, reject) => {

				http.get('http://localhost/campn-server/schema/' + name + '?token='+this.token).then(response=> {
					resolve(response.data.data);
				}).catch(error => {
					reject(error)
				});
			})

		}
		put(id, datas) {
			return new Promise((resolve, reject) => {
				http({
					method 	: 'put',
					/*url 		: 'http://localhost/campn-server/schemas/' + id + '?token='+this.token,*/
					url 		: this.url + '/' + id + '?token='+this.token,
					data 		: datas
				}).then(response => {
					resolve(true);
				}).catch(error => {
					reject(error)
				});
			})
		}
		delete(id) {

			return new Promise((resolve, reject) => {
				http({
					method 	: 'delete',
					/*url 		: 'http://localhost/campn-server/schemas/' + id + '?token=' + this.token*/
					url 		: this.url + '/' + id + '?token='+this.token
				}).then(response => {
					var index 	= 0;
					var schemas 	= Store.schemas;
					schemas.forEach(function(schema){
						if (schema.id === id)
							schemas.splice(index, 1);
						index++;
					})
					resolve(schemas);
				}).catch(error => {
					reject(error)
				});
			});

		}
	}
