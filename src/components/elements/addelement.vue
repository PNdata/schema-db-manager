<template>

	<div class="container form-container" v-if="size()">

		<div class="row">

			<div class="col s12">
				<h5>Ajouter un élément {{(!element && schema && schema.label) ? 'à ' + schema.label : (element && element.label) ? 'à ' + element.label : ''}}</h5>
			</div>

			<div class="col s12">
				<feedback :msgSaved="msgSaved" :msgFailed="msgFailed" :add="true"></feedback>
			</div>

			<div class="col s12">

				<form id="form_addElement">

					<div class="form-group row">
						<div class="col-sm-2">
							<label>Nom* : </label>
						</div>
						<div class="col-sm-10">
							<input v-model="name" class="form-control" placeholder="Nom de l'élément"/>
						</div>
					</div>

					<div class="form-group row">
						<div class="col-sm-2">
							<label>Libellé* : </label>
						</div>
						<div class="col-sm-10">
							<input v-model="label" class="form-control" placeholder="Libellé de l'élément"/>
						</div>
					</div>

					<div class="form-group center">
						<div class="col-sm-offset-2 col-sm-3">
							<div class="col-sm-12">
								<input type="checkbox" v-model="type" @click="!type">
							</div>
							<label>Type lien</label>
						</div>
					</div>

					<div v-if="type">

						<div class="form-group center">
							<div class="col-sm-3">
								<div class="col-sm-12">
									<input type="checkbox" v-model="cardinality" @click="!cardinality">
								</div>
								<label>Lien simple</label>
							</div>
						</div>

						<div class="form-group center">
							<div class="col-sm-4">
								<div class="col-sm-12">
									<input type="checkbox" v-model="auto" @click="!auto">
								</div>
								<label>Générer la jointure automatiquement</label>
							</div>
						</div>

						<div class="form-group row col s12 no-padding">
							<div class="col-sm-2">
								<label>Table destination*</label>
							</div>
							<div class="col-sm-10">
								<select class="form-control" v-model="targetTable" :readonly="readonly">
									<option v-for="sch in schemas" :value="sch">{{sch.label}}</option>
								</select>
							</div>
						</div>

						<div v-if="!auto && targetTable">
							<div class="form-group row col s12 no-padding">
								<div class="col-sm-2">
									<label>Jointure</label>
								</div>
								<div class="col-sm-5">
									<label>Source</label><br />
									<select class="form-control" v-model="source">
										<option v-for="attribute in schema.rootElement.attributes" :value="attribute.name">{{(attribute.label) ? attribute.label : ''}}</option>
									</select>
									<span style="cursor: pointer" @click="addJoin"><i class="fa fa-plus-circle"></i> Ajouter un jointure</span>
								</div>
								<div class="col-sm-5">
									<label>Cible</label><br />
									<select class="form-control" v-model="target">
										<option v-for="attribute in targetTable.rootElement.attributes" :value="attribute.name">{{attribute.label}}</option>
									</select>
								</div>
							</div>
							<div class="form-group col s12">
								<div class="col-sm-2">
									<label>Jointures déjà ajoutées :</label>
								</div>
								<div class="col-sm-10">
									<ul>
										<li v-for="join in joins">
											<div class="col s6">Source : {{join.source}}</div>
											<div class="col s6">Cible : {{join.target}}</div>
										</li>
									</ul>
								</div>
							</div>
						</div>

					</div>

					<div class="form-group row">
						<div class="col-sm-12">
							<button class="btn pull-right blue-grey lighten-5" @click="addElement()">Ajouter </button>
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
					<router-link :to="{name: 'create_attribute'}">
						<div class="add-options tonton">
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

				label		: '',
				name		: '',
				targetTable	: '',
				target		: '',
				source		: '',
				type		: false,
				cardinality	: false,
				auto		: false,
				joins		: [],

				msgFailed	: '',
				msgSaved	: '',

				addSuccess 	: false,
				readonly 	: false,

				schemas	: Store.schemas,
				schema	: Store.currentSchema,
				element	: Store.currentElement
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
				return ((this.schema && size > 0));
			},

			reset() {
				this.label		= '';
				this.name		= '';
				this.targetTable	= '';
				this.target		= '';
				this.source		= '';
				this.type		= false;
				this.cardinality	= false;
				this.auto		= false;
				this.joins		= [];
			},

			addJoin: function() {
				if (!this.source || this.source === '' || !this.target || this.target === '') return (this.joins);;
				this.joins.push({
					source: "@"+this.source,
					target: "@"+this.target
				})
				this.readonly 	= true;
				this.source 	= '';
				this.target 	= '';
				return (this.joins);
			},

			myIncludes(array, value) {

				for (var i = 0; i < array.length; i++)
					if (array[i].name === value) return true;
				return false;
			},

			addJoinInTarget(element) {
				var element2 		= JSON.parse(JSON.stringify(element));
				element2.target 	= this.schema.name;
				element2.inversedBy	= this.targetTable.name;
				this.targetTable.rootElement.elements.push(element2);
				if (!this.myIncludes(this.targetTable.rootElement.attributes, this.schema.name+"Id"))
					this.targetTable.rootElement.attributes.push({
						"name": this.schema.name+"Id",
						"label": "Clé étrangère du lien '"+this.schema.label+"'",
						"type": "number",
						"storage": "database",
						"advanced": true,
						"primaryKey": false,
						"foreignKey": true
					});
				api.put(this.targetTable.id, this.targetTable);
			},

			// Ajoute l'élément au le schema
			addElement: function() {
				this.sending = true;
				if (this.name === "" || this.label === "" || (this.type && this.targetTable === '')){
					this.msgFailed = "Veuillez remplir tous les champs marqués d\'un (*)";
					this.msgSaved = '';
					this.sending = false;
					return;
				}
				var element = {
					"icon"		: null,
					"name"	: this.name,
					"label"		: this.label,
				}

				if (this.type) {
					if (!this.auto && (this.source === "" || this.target === "")){
						this.msgFailed = "Veuillez remplir la cible et la source";
						this.msgSaved = '';
						this.sending = false;
						return;
					}
					if (this.auto) {
						if (!this.myIncludes(this.schema.rootElement.attributes, 'id'))
							this.schema.rootElement.attributes.push({
								"name": "id",
								"label": "Clé primaire",
								"type": "number",
								"storage": "database",
								"advanced": true,
								"primaryKey": true,
								"foreignKey": false
							});
						var source 		= "@id";
						var target 		= "@"+this.schema.name+"Id";
						element.joins 		= [{
							source,
							target
						}]
					}
					else
						element.joins 	= (this.joins.length === 0) ? [{source: this.source, target: this.target}] : (!this.auto) ? this.addJoin() : this.joins;

					element.target 	= this.targetTable.name;
					element.cardinality 	= (!this.cardinality) ? 'multiple' : 'single';
					element.type 		= "link";
					element.inversedBy	= this.schema.name;
					this.addJoinInTarget(element);
				}
				else {
					element.attributes = [];
					element.elements = [];
				}

				if (this.element === false)
					this.schema.rootElement.elements.push(element);
				else
					this.element.elements.push(element);

				var datas 	= this.schema	;
				var id 		= datas.id	;
				api.put(id, datas).then(response => {
					if (response)
						this.msgSaved = "L'élément a bien été ajouté.";
					else
						this.msgFailed = response;
					this.sending = false;
					this.addSuccess = true;
					this.reset();
				}).catch(error => {
					if (error.response) {
						console.error(error.response.data);
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
