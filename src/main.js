// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue 		from 'vue'
import Router 	from 'vue-router'
import App 		from './App'
import Error 		from './components/error'
import Api 		from './utils/api'
import routes 	from './utils/routes'
import store 		from './utils/store'

Vue.use(Router)

let api = new Api();

api.get().then(response=>{

	store.schemas 	= response;
	/* eslint-disable no-new */
	let app = new Vue({
		el: '#app',
		template: '<App/>',
		components: { App },
		router: new Router({ routes })
	})
	app.$router.push({ name : 'list'})
}).catch(error=> {
	let apperror = new Vue({
		el: '#app',
		template: '<Error/>',
		components: { Error },
		router: new Router({ routes })
	})
	apperror.$router.push({ name : 'error', params: {'type': 400} })
	document.body.innerHTML += (error.response) ? error.response.data : '';
	document.body.style.backgroundImage = 'none';
	document.body.style.padding = '0';
	console.error('Error', error.message);
})
