<template>
	<div class="center">
		<div class="login">
			<div class="z-depth-0 login-container">

				<div class="row feedback-error" v-if="ukUser" style="background-color: transparent">
					<div class="col s12">
						<div class="card red darken-2">
							<div class="card-content white-text" id="connect-failed">
								<p>Vérifier le nom d'utilisateur et/ou le mot de passe</p>
							</div>
						</div>
					</div>
				</div>

				<form class="col s12" id="loginForm" onsubmit="return false">

					<div class='row'>
						<div class='input-field col s12'>
							<span v-if="empty && username === ''" class="left red-text">Champ obligatoire.</span>
							<input type='text' v-model="username" />
							<label class="input-label">Nom d'utilisateur</label>
						</div>
					</div>

					<div class='row'>
						<div class='input-field col s12'>
							<span v-if="empty && password === ''" class="left red-text">Champ obligatoire.</span>
							<input type='password' v-model="password" />
							<label class="right input-label">Mot de passe</label>
						</div>
					</div>

					<div class='row'>
						<div class="col s12">
							<button @click="signin()" class='col s12 btn btn-large waves-effect' >Connexion</button>
						</div>
					</div>
					<br />

				</form>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">

	import sha1			from 'sha1'
	import http			from 'axios'
	import Application		from '../utils/application'

	var application = new Application();

	export default {

		created() {
			if ((application.getParams('auth', window.location.href)) === "false")
				this.ukUser = true;
		},

		data() {
			return {
				username		: "",
				password		: "",
				confirmpassword	: "",
				ukUser		: false,
				fgPwd			: false,
				equals			: true,
				empty			: false
			}
		},
		methods: {
			signin() {
				var username = (this.username === "") ? null : this.username;
				var password = (this.password === "") ? null : sha1(this.password);

				if (username === null || password === null) {
					this.empty = true;
					return false;
				}
				var url = "http://localhost/campn-server/auth/login?user=" + window.btoa( username + ":" + password);
				window.location.href = url;
			},
			equalsPwd() {
				if (this.confirmpassword !== this.password) this.equals = false; else this.equals = true;
			}
		}
	}
</script>
