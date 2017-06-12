<template>

	<div id="app">

		<div v-if="!isLogged">
			<login></login>
		</div>

		<div v-if="isLogged">

			<div class="navb">
				<div class="navb-container">
					<ul class="row no-padding">
						<router-link :to="{name: 'list'}">
							<li class="col s4 no-padding">
								<i class="fa fa-home fa-2x"></i><hr>
							</li>
						</router-link>
						<router-link :to="{name: 'account'}">
							<li class="col s4 no-padding">
								<i class="fa fa-user fa-2x"></i><hr>
							</li>
						</router-link>
						<li class="col s4 no-padding" @click="signout()">
							<i class="fa fa-sign-out fa-2x"></i><hr>
						</li>
					</ul>
				</div>
			</div>

			<div class="col-sm-12" id="title">
				<h1>{{title}}</h1>
			</div>

			<div style="clear: both"></div>

			<div class="main">

				<router-view></router-view>

				<div class="top" @click="top()">
					<i class="fa fa-chevron-up"></i>
				</div>

			</div>

		</div>

	</div>

</template>

<script type="text/javascript">

	import http 			from 'axios'
	import Login 			from './components/login'
	import Store 			from './utils/store'
	import Application		from './utils/application'

	var application = new Application();

	export default {
		name : 'app',

		data() {
			return {
				schemas 	: Store.schemas,
				isLogged	: false,
				login 		: "",
				username	: "",
				password	: "",
				title 		: 'Schema manager'
			}
		},
		created() {
			if ((application.isConnect() !== false)) {
				this.isLogged 	= true;
				var username	= application.readCookie('username');
				this.login 	= username;
			}
		},
		methods: {

			top() {
				$("html, body").animate({"scrollTop": 0}, 'slow');
			},

			signout() {
				var username = application.readCookie('username');
				var password = application.readCookie('password');
				http.get("http://localhost/campn-server/auth/login/out?user=" + window.btoa(username + ":" + password)).then(response => {
					application.deleteCookie('username');
					application.deleteCookie('password');
					application.deleteCookie('token');
					window.location.reload();
				})
			}
		},
		components : {
			Login
		}
	}
</script>

<style type="text/css" src="./assets/styles/main.css"></style>
<style type="text/css" src="./assets/styles/login.css"></style>
<style type="text/css" src="./assets/styles/navbar.css"></style>
<style type="text/css" src="./assets/styles/home.css"></style>
<style type="text/css" src="./assets/styles/elements.css"></style>
<style type="text/css" src="./assets/styles/forms.css"></style>
<style type="text/css" src="./assets/styles/feedback.css"></style>
<style type="text/css" src="./assets/styles/modal.css"></style>
<style type="text/css" src="./assets/styles/account.css"></style>
