<template>
	<div class="container form-container" v-if="size()">
		<div class="row">
			<div class="col s12">
				<h5>Ajouter un schéma</h5>
			</div>
			<div class="col s12">
				<feedback :msgSaved="msgSaved" :msgFailed="msgFailed" :add="true"></feedback>
			</div>
			<div class="col s12">
				<form id="form_addSchema">
					<div class="form-group row">
						<div class="col-sm-2">
							<label>Nom* : </label>
						</div>
						<div class="col-sm-10">
							<input v-model="name" class="form-control" placeholder="Nom du schéma"/>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-sm-2">
							<label>Libellé* : </label>
						</div>
						<div class="col-sm-10">
							<input v-model="label" class="form-control" placeholder="Libellé du schéma"/>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-sm-2">
							<label>Sqlname : </label>
						</div>
						<div class="col-sm-10">
							<input v-model="sqlname" class="form-control" placeholder="Sqlname du schéma"/>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-sm-2">
							<label>Clé primaire automatique </label>
						</div>
						<div class="col-sm-10">
							<input type="checkbox" v-model="autoPk" @click="!autoPk">
						</div>
					</div>
					<div class="form-group row">
						<div class="col-sm-12">
							<button class="btn pull-right blue-grey lighten-5" @click="addSchema">
								Ajouter
							</button>
						</div>
					</div>
				</form>
			</div>

			<div class="row" v-if="addSuccess">
				<div class="col s6">
					<router-link :to="{name: 'list'}">
						<div class="add-options tonton">
							<div class="overlay overlay-pink"></div>
							Retourner à l'accueil
							<span class="icon-add-options">
								<i class="fa fa-home fa-5x"></i>
							</span>
						</div>
					</router-link>
				</div>
				<div class="col s6">
					<router-link :to="{name: 'create_element'}">
						<div class="add-options">
							<div class="overlay overlay-blue"></div>
							Ajouter un élément au schéma {{schema.label}}
							<span class="icon-add-options">
								<i class="fa fa-arrow-circle-right fa-4x"></i>
							</span>
						</div>
					</router-link>
				</div>

				<div class="col s6">
					<router-link :to="{name: 'create_attribute'}">
						<div class="add-options">
							<div class="overlay overlay-green"></div>
							Ajouter un attribut au schéma {{schema.label}}
							<span class="icon-add-options">
								<i class="fa fa-arrow-circle-right fa-4x"></i>
							</span>
						</div>
					</router-link>
				</div>
			</div>
		</div>
		<div class="wait-form" v-if="sending">
			<div class="wait-form-icon">
				<i class="fa fa-spin fa-circle-o-notch fa-3x fa-fw"></i>
			</div>
		</div>
	</div>
</template>

<script>

	import http 		from 'axios'
	import Store 		from '../../utils/store'
	import Api		from '../../utils/api'
	import Feedback	from '../feedback'

	var api 	= new Api();

	export default {

		created() {
			if (!this.size()) {
				this.$router.push({name: 'list'})
				return (false);
			}
		},

		data() {
			return {

				sending	: false,

				label		: '',
				name		: '',
				sqlname	: '',
				autoPk		: false,

				msgFailed	: '',
				msgSaved	: '',

				addSuccess	: false,

				schemas	: Store.schemas,
				schema	: Store.currentSchema
			}
		},

		components: {
			Feedback
		},

		methods: {

			size() {
				var size = 0, key;
				for (key in this.schemas) {
					if (this.schemas.hasOwnProperty(key)) size++;
				}
				return (this.schemas && size > 0);
			},

			reset() {
				this.name 	= '';
				this.label 	= '';
				this.sqlname 	= '';
				this.autoPk	= false;
			},

			addElement() {
				this.$router.push({name: "create_element"});
			},

			addAttribute() {
				this.$router.push({name: "create_attribute"});
			},

			addSchema: function() {
				this.sending = true;
				if (this.name === "" || this.label === ""){
					//this.$emit('failed', 'Veuillez remplir tous les champs marqués d\'un (*)')
					this.msgFailed = "Veuillez remplir tous les champs marqués d\'un (*)";
					this.sending = false;
					return;
				}
				var element = {
					"icon"		: null,
					"name"	: this.name,
					"label"		: this.label,
					"attributes"	: (this.autoPk) ? [{
						"name": "id",
						"label": "Clé primaire",
						"type": "number",
						"storage": "database",
						"advanced": true,
						"primaryKey": true,
						"foreignKey": false
					}] : [],
					"elements"	: []
				}

				var schema_tmp = {
					"name"		: this.name,
					"label"			: this.label,
					"sqlname"		: (this.sqlname !== '') ? this.sqlname : this.name,
					"autoPk" 		: this.autoPk,
					"keys"			: (this.autoPk) ? ['id'] : [],
					"rootElement"	: element
				};

				api.post(schema_tmp).then(response => {
					if (response) {
						schema_tmp.id = response.id;
						this.schemas.push(schema_tmp);
						this.msgSaved = "Le schema a bien été ajouté.";
						this.sending = false;
						Store.currentSchema = schema_tmp;
						Store.currentElement = false;
						this.schema = Store.currentSchema
						this.reset();
						this.addSuccess = true;
					}
					else {
						this.msgFailed = response;
						this.sending = false;
					}
				}).catch(error => {
					if (error.response) {
						console.error(error.response.data);
						console.error(error.response.status);
						console.error(error.response.headers);
					}
					if (error.message)
						this.msgFailed = "Erreur : " + error.message;
					else
						this.msgFailed = "Erreur : " + error;
					this.sending = false;
					console.error(error);
					console.info(error.config);
				});
			}
		}
	}
</script>

<style type="text/css" media="screen">
	.wait-form {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .5);
	}

	.wait-form-icon {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100px;
		height: 100px;
		line-height: 100px;
		vertical-align: middle;
		text-align: center;
		margin: auto;
		color: #FFF;
	}

	.margin-5-0 {
		margin: 5px 0;
	}
</style>
