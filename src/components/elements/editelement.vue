<template>
	<div class="container form-container" v-if="size()">
		<div class="row">

			<div class="col s12">
				<h5>Modifier l'élément {{(element && element.label) ? element.label : ''}}</h5>
			</div>

			<div class="col s12">
				<feedback :msgSaved="msgSaved" :msgFailed="msgFailed"></feedback>
			</div>

			<div class="col s12">
				<form id="form_editElement">
					<div class="form-group row">
						<div class="col-sm-2">
							<label>Nom : </label>
						</div>
						<div class="col-sm-10">
							<input v-model="element['name']" class="form-control" :placeholder="element.name" />
						</div>
					</div>
					<div class="form-group row">
						<div class="col-sm-2">
							<label>Libellé : </label>
						</div>
						<div class="col-sm-10">
							<input v-model="element['label']" class="form-control" :placeholder="element.label"/>
						</div>
					</div>
					<div class="form-group row">
						<div class="col-sm-2">
							<label>Référentiel ? </label>
						</div>
						<div class="col-sm-10">
							<input type="checkbox" v-model="element['referential']" @click="element.referential = !element.referential">
						</div>
					</div>
					<div v-if="element.type">
						<div class="form-group row">
							<div class="col-sm-2">
								<label>Lien simple ? </label>
							</div>
							<div class="col-sm-10">
								<input type="checkbox" v-model="newCardinalitySimple" @click="!newCardinalitySimple">
							</div>
						</div>
						<div class="form-group row col s12 no-padding">
							<div class="col-sm-2">
								<label>Table destination*</label>
							</div>
							<div class="col-sm-10">
								<input type="text" v-model="element.target" readonly>
							</div>
						</div>
						<div class="form-group row" v-for="join in element.joins">
							<div class="col-sm-2">
								<label>Jointure : </label>
							</div>
							<div class="col-sm-5">
								<label>Source</label><br />
								<select class="form-control" v-model="join.source">
									<option v-for="attribute in schema.rootElement.attributes" :value="'@'+attribute.name" v-if="attribute.name">{{attribute.label}}</option>
								</select>
							</div>
							<div class="col-sm-5">
								<label>Cible</label><br />
								<select class="form-control" v-model="join.target">
									<optgroup :label="schemaTarget.label" v-if="schemaTarget">
										<option v-for="attribute in schemaTarget.rootElement.attributes" :value="'@'+attribute.name">{{attribute.label}}</option>
									</optgroup>
								</select>
							</div>
						</div>
					</div>

					<div class="form-group row">
						<div class="col-sm-12">
							<button class="btn pull-right blue-grey lighten-5" @click="setElement()">Modifier </button>
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
	//import this.schemas from '../assets/database.json'
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
			/*api.findOneByName(this.element.target).then(response => { this.schemaTarget = response; console.log(response)})*/
		},

		data() {
			return {

				sending 		: false,

				targetTable		: '',

				msgFailed		: '',
				msgSaved		: '',

				schemas		: Store.schemas,
				schema		: Store.currentSchema,
				element		: Store.currentElement,

				schemaTarget 	: Store.schemaTarget,
				newCardinalitySimple: (this.element && this.element.cardinality === 'single')
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

				var size2 = 0;
				for (key in this.element) {
					if (this.element.hasOwnProperty(key)) size2++;
				}
				return ((this.schema && size > 0) && (this.element && size2 > 0));
			},

			setTarget() {
				this.element.target = this.schemaTarget.name;
				console.log(this.element)
			},

			// Modifie l'élément
			setElement: function() {
				this.sending = true;

				if (this.element && this.element.type === 'link')
					this.element.cardinality = (this.newCardinalitySimple) ? 'single' : 'multiple';

				var datas 	= this.schema	;
				var id 		= datas.id	;

				api.put(id, datas).then(response => {

					if (response)
						this.msgSaved = "L'élément a bien été modifié.";
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
