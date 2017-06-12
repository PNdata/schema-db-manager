<template>
	<div class="container form-container" v-if="size()">
		<div class="row">

			<div class="col s12">
				<h5>
					Ajouter un attribut {{(!element && schema && schema.label) ? 'à ' + schema.label : (element && element.label) ? 'à ' + element.label : ''}}
				</h5>
			</div>

			<div class="col s12">
				<feedback :msgSaved="msgSaved" :msgFailed="msgFailed" :add="true"></feedback>
			</div>

			<div class="col s12">
				<form id="form_addAttribute">

					<div class="form-group row">

						<div class="col-sm-2">
							<label>Nom* : </label>
						</div>

						<div class="col-sm-10">
							<input v-model="name" class="form-control" placeholder="Nom de l'attribut" />
						</div>

					</div>

					<div class="form-group row">
						<div class="col-sm-2">
							<label>Libellé* : </label>
						</div>
						<div class="col-sm-10">
							<input v-model="label" class="form-control" placeholder="Libellé de l'attribut" />
						</div>

					</div>
					<div class="form-group row">

						<div class="col-sm-offset-2 col-sm-5">
							<select v-model="type" class="form-control">
								<option class=" disabled selected hidden" value="">Type*</option>
								<option value="number">Nombre</option>
								<option value="date">Date</option>
								<option value="string">Chaine de caractère</option>
							</select>
						</div>

						<div class="col-sm-5">
							<select v-model="storage" class="form-control">
								<option class=" disabled selected hidden" value="">Stocker dans...</option>
								<option value="database">Base de données</option>
							</select>
						</div>

					</div>
					<div v-if="!element">

						<div class="form-group row input-check">
							<div class="col-sm-offset-2 col-sm-3">
								<label>Champ avancé</label>
								<div class="col-sm-12">
									<input type="checkbox" v-model="advanced" @click="!advanced">
								</div>
							</div>
							<div class="col-sm-3" v-if="advanced">
								<label>Clé primaire</label>
								<div class="col-sm-12">
									<input type="checkbox" v-model="primaryKey" @click="!primaryKey">
								</div>
							</div>
							<div class="col-sm-3" v-if="advanced">
								<label>Clé étrangère</label>
								<div class="col-sm-12">
									<input type="checkbox" v-model="foreignKey" @click="!foreignKey">
								</div>
							</div>
						</div>

					</div>

					<div class="form-group row">
						<div class="col-sm-12">
							<button class="btn pull-right blue-grey lighten-5" @click="addAttribute()">
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
				<div :class="{'col-xs-6 col s3': element, 'col s6': !element}">
					<div class="add-options" :class="{'tonton': !element}" @click="addElement">
						<div class="overlay overlay-blue"></div>
						Ajouter un élément au schéma {{schema.label}}
						<span class="icon-add-options">
							<i class="fa fa-arrow-circle-right fa-2x"></i>
						</span>
					</div>
				</div>
				<div v-if="element === {} || element !== false">
					<div class="col-xs-6 col s3">
						<div class="add-options" @click="addAttributeToSchema">
							<div class="overlay overlay-green"></div>
							Ajouter un attribut au schéma {{schema.label}}
							<span class="icon-add-options">
								<i class="fa fa-arrow-circle-right fa-2x"></i>
							</span>
						</div>
					</div>
					<div class="col s6">
						<router-link :to="{name: 'create_element'}">
							<div class="add-options">
								<div class="overlay overlay-red"></div>
								Ajouter un élément à l'élément {{element.label}}
								<span class="icon-add-options">
									<i class="fa fa-arrow-circle-right fa-2x"></i>
								</span>
							</div>
						</router-link>
					</div>
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
	import Api		from '../../utils/api'
	import Store		from '../../utils/store'
	import Feedback	from '../feedback'

	var api = new Api();

	export default {

		created() {
			if (!this.size()) {
				this.$router.push({name: 'list'})
				return (false);
			}
		},

		data() {
			return {

				sending 	: false,

				type		: 'string',
				label		: '',
				name		: '',
				foreignKey	: false,
				primaryKey	: false,
				advanced	: false,
				storage	: 'database',

				msgFailed	: '',
				msgSaved	: '',

				addSuccess 	: false,

				schema	: Store.currentSchema,
				element	: Store.currentElement

			}
		},

		components: {
			Feedback
		},

		methods: {

			size() {
				//return true;
				var size = 0, key;
				for (key in this.schema) {
					if (this.schema.hasOwnProperty(key)) size++;
				}
				return ((this.schema && size > 0));
			},

			reset() {
				this.sending 		= false;
				this.type		= 'string';
				this.label		= '';
				this.name		= '';
				this.foreignKey	= false;
				this.primaryKey	= false;
				this.advanced		= false;
				this.storage		= 'database';
			},

			addElement() {
				Store.currentElement = false;
				this.$router.push({'name': 'create_element'});
			},

			addAttributeToSchema() {
				this.element = Store.currentElement = false;
				this.$router.push({'name': 'create_attribute'});
			},

			// Ajoute l'attribut
			addAttribute: function() {
				this.sending 		= true;
				this.msgSaved 	= "";
				if (this.name === "" || this.label === "" || this.type === "") {
					this.msgFailed = "Veuillez remplir tous les champs marqués d\'un (*)";
					this.sending = false;
					return;
				}
				var attributes 		= [];
				if (this.element === false)
					attributes 	= this.schema.rootElement.attributes;
				else
					attributes 	= this.element.attributes;
				if (!this.advanced) {
					this.primaryKey 	= false;
					this.foreignKey 	= false;
				}

				attributes.push({
					"name"	: this.name,
					"label"		: this.label,
					"type"		: this.type,
					"storage"	: this.storage,
					"advanced"	: this.advanced,
					"primaryKey"	: this.primaryKey,
					"foreignKey"	: this.foreignKey
				})

				if (this.primaryKey)
					this.schema.keys.push(this.name);

				var datas 	= this.schema	;
				var id 		= datas.id	;
				api.put(id, datas).then(response => {
					if (response)
						this.msgSaved 	= "L'attribut a bien été ajouté.";
					else
						this.msgFailed 	= response;
					this.reset();
					this.addSuccess = true;
				}).catch(error => {
					if (error.response) {
						console.error(error.response.data);
						console.error(error.response.headers);
					}
					if (error.message)
						this.msgFailed 	= "Erreur : " + error.message;
					else
						this.msgFailed 	= "Erreur : " + error;
					this.sending = false;
					console.error(error);
					console.info(error.config);
				});
			}
		}
	}
</script>
