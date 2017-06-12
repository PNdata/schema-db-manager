<template>
	<div>
		<div class="profile-container card">
			<div class="card-image waves-effect waves-block waves-light">
				<img class="activator" src="../../assets/pf.png">
				<i class="fa fa-user fa-5x"></i>
				<div class="username">
					<h4>{{username}}</h4>
				</div>
			</div>
			<div class="card-content">
				<span class="card-title activator grey-text text-darken-4">Informations de compte <i class="fa fa-ellipsis-v right"></i></span>
			</div>
			<div class="card-reveal">
				<div class="card-reveal-header">
					<span class="card-title grey-text text-darken-4">Informations de compte <i class="fa fa-close right"></i></span>
				</div>
				<div class="row">
					<form class="col s12" onsubmit="return false">
						<div class="row">
							<div class="col s12">
								<label for="username">Nom d'utilisateur</label>
								<input placeholder="Nom d'utilisateur" id="username" type="text" class="validate" v-model="username">
								<span v-if="empty && username === ''" class="left red-text">Champ obligatoire.</span>
							</div>
						</div>
						<div class="row">
							<div class="col s12">
								<label for="password">Mot de passe</label>
								<input id="password" type="password" class="validate" v-model="password" @focus="changePassword">
								<span v-if="empty && password === ''" class="left red-text">Champ obligatoire.</span>
							</div>
						</div>
						<div class="row" v-if="change">
							<div class="col s12">
								<label for="password">Confirmer mot de passe</label>
								<input id="password" type="password" class="validate" v-model="cpassword">
								<span v-if="password !== cpassword" class="left red-text">Les mots de passe ne correspondent pas.</span>
							</div>
						</div>
						<div class="row">
							<div class="col s6 no-padding">
								<button type="submit" class="btn btn-block" @click="setUser">Enregistrer</button>
							</div>
							<div class="col s6">
								<button class="btn btn-block " @click="cancel">Annuler</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import http 			from 'axios'

	/*import Store			from '../../utils/store'*/

	import sha1			from 'sha1'
	import Api			from '../../utils/api'
	import Application		from '../../utils/application'

	var api = new Api("http://localhost/campn-server/account");
	var application = new Application();

	export default {

		data() {
			return {
				username	: '',
				oldusername	: '',
				password	: '',
				cpassword	: '',
				oldpassword	: '',

				token		: null,
				change 	: false,
				empty 		: false,
			}
		},
		created() {
			this.username = application.readCookie('username');
			this.password = application.readCookie('password');
			this.token = application.readCookie('token');
			this.oldusername = this.username;
			this.oldpassword = this.password;

		},

		methods: {
			changePassword() {
				this.password = '';
				this.change = true;
			},

			cancel() {
				this.username = this.oldusername;
				this.password = this.oldpassword;
				this.change = false;
			},

			setUser() {
				var username = (this.username === "") ? null : this.username;
				var password = (this.password === this.oldpassword) ? this.password : (this.password === '' || this.password !== this.cpassword) ? null : sha1(this.password);

				if (!username || !password) {
					this.empty = true;
					return (false);
				}

				var url = "http://localhost/campn-server/account?token="+ this.token +"&user=" + window.btoa(this.oldusername + ":" + this.oldpassword) + "&new=" + window.btoa(username + ":" + password);
				window.location.href = url;
			}
		}
	}
</script>
