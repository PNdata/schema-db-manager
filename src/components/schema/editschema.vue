<template>
	<div class="container form-container" v-if="size()">
		<div class="row">

			<div class="col s12">
				<h5>Modifier le schéma {{(schema && schema.label) ? schema.label : ''}}</h5>
			</div>

			<div class="col s12">
				<div v-if="schema.rootElement">
					<div style="margin-bottom: 10px; text-align: right" class="red-text" v-if="!equals('name')">
						Nom du rootElement : {{(schema.rootElement.name !== "") ? schema.rootElement.name : "Aucun"}}<br />
						Nom du schéma : {{(schema.name !== "") ? schema.name : "Aucun"}}<br />
					</div>
					<div style="margin-bottom: 10px; text-align: right" class="red-text" v-if="!equals('label')">
						Libellé du rootElement : {{(schema.rootElement.label !== "") ? schema.rootElement.label : "Aucun"}}<br />
						Libellé du schéma : {{(schema.label !== "") ? schema.label : "Aucun"}}<br />
					</div>
				</div>
			</div>

			<div class="col s12">
				<feedback :msgSaved="msgSaved" :msgFailed="msgFailed"></feedback>
			</div>

			<div class="col s12">
				<form id="form_editSchema">
					<div class="form-group row">
						<div class="col-sm-2">
							<label>Nom : </label>
						</div>
						<div class="col-sm-10">
							<input v-model="schema['name']" class="form-control" :placeholder="schema.name"/>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-sm-2">
							<label>Libellé : </label>
						</div>
						<div class="col-sm-10">
							<input v-model="schema['label']" class="form-control" :placeholder="schema.label"/>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-sm-2">
							<label>Sqlname : </label>
						</div>
						<div class="col-sm-10">
							<input v-model="schema['sqlname']" class="form-control" placeholder="schema.sqlname"/>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-sm-2">
							<label>Clé(s) primaire(s) : </label>
						</div>
						<div class="col-sm-10">
							<div class="select-group">
								<ul class="select-group-ul">
									<li v-for="attribute in schema.rootElement.attributes" :class="{'selected' : isPrimary(attribute)}" @click="togglePrimary(attribute)">
										{{attribute.label }}
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div class="form-group row">
						<div class="col-sm-12">
							<button class="btn pull-right blue-grey lighten-5" @click="setSchema()">Modifier </button>
							<div style="clear: both"></div>
						</div>
					</div>

				</form>
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
	import http 			from 'axios'
	import Api			from '../../utils/api'
	import Store			from '../../utils/store'
	import Feedback		from '../feedback'

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

				sending		: false,

				newPrimaryKey	: [],

				msgFailed		: '',
				msgSaved		: '',

				schemas 		: Store.schemas,
				schema 		: Store.currentSchema
			}
		},

		components: {
			Feedback
		},

		methods: {

			size() {
				var size = 0, key;
				for (key in this.schema) {
					if (this.schema.hasOwnProperty(key)) size++;
				}
				return (this.schema && size > 0);
			},

			equals(prop) {
				return (prop === "name") ? (this.schema.rootElement && this.schema.rootElement.name && this.schema.name && this.schema.rootElement.name === this.schema.name) : (this.schema.rootElement && this.schema.rootElement.label && this.schema.label && this.schema.rootElement.label === this.schema.label)
			},

			isPrimary(attribute) {
				if (attribute.primaryKey) {
					if (!this.newPrimaryKey.includes(attribute.name)) {
						this.newPrimaryKey.push(attribute.name);
						this.schema.keys = this.newPrimaryKey;
					}
					return (true);
				}
				else {
					var index = this.newPrimaryKey.indexOf(attribute.name)
					if (index > -1)
						this.newPrimaryKey.splice(index, 1);
					this.schema.keys = this.newPrimaryKey;
					return (false);
				}
			},

			togglePrimary(attribute) {
				attribute.advanced 	= !attribute.advanced,
				attribute.primaryKey 	= !attribute.primaryKey
				this.isPrimary(attribute);
			},

			setSchema: function() {
				this.sending = true;

				this.schema.keys 	= this.newPrimaryKey;

				this.schema.rootElement.name 	= this.schema.name;
				this.schema.rootElement.label 	= this.schema.label;

				var datas 	= this.schema	;
				var id 		= datas.id	;

				api.put(id, datas).then(response => {

					if (response)
						this.msgSaved = "Le schéma a bien été modifié.";
					else
						this.msgFailed = response;
					this.sending = false;

				}).catch(error => {

					if (error.response) {
						console.log(error.response);
						console.log(error.response.data);
						console.log(error.response.status);
						console.log(error.response.headers);
					}
					if (error.message)
						this.msgFailed = "Erreur : " + error.message;
					else
						this.msgFailed = "Erreur : " + error;
					this.sending = false;
					console.log(error);
					console.log(error.config);

				});
			}

		}
	}
</script>


<style>

	.select-group li:first-letter {
		text-transform: capitalize;
	}
	.select-group {
		height: 200px;
		border: 1px solid #ddd;
		overflow: auto;
	}

	.select-group-ul {
		padding-left: 20px;
		padding-right: 20px;
	}

	.select-group li {
		cursor: pointer;
		list-style: none;
		padding: 2px 6px;
		color: #666;
		transition: all .5s;
	}

	.select-group li:hover,
	.select-group li.selected {
		color: #FFF;
		background-color: #50b2a2 !important;
	}

	.select-group li .fa {
		color: #e67e22;
	}
</style>
