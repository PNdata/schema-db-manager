<template>
	<div class="container form-container" v-if="size()">

		<div class="row">

			<h5>
				Modifier l'attribut {{(attribute && attribute.label) ? attribute.label : ''}}
			</h5>

			<feedback :msgSaved="msgSaved" :msgFailed="msgFailed"></feedback>
			<form id="form_editAttribute">

				<div class="form-group row">

					<div class="col-sm-2">
						<label>Nom : </label>
					</div>
					<div class="col-sm-10">
						<input v-model="attribute['name']" class="form-control" :placeholder="attribute.name" />
					</div>

				</div>

				<div class="form-group row">

					<div class="col-sm-2">
						<label>Libellé : </label>
					</div>

					<div class="col-sm-10">
						<input v-model="attribute['label']" class="form-control" :placeholder="attribute.label" />
					</div>

				</div>

				<div class="form-group row">

					<div class="col-sm-offset-2 col-sm-5">
						<select v-model="attribute['type']" class="form-control">
							<option value="number">Nombre</option>
							<option value="date">Date</option>
							<option value="string">Chaine de caractère</option>
						</select>
					</div>

					<div class="col-sm-5">
						<select v-model="attribute['storage']" class="form-control">
							<option value="database">Base de données</option>
						</select>
					</div>

				</div>

				<div class="form-group row input-check" v-if="isSchema()">

					<div class="col-sm-offset-2 col-sm-3">

						<label>Champ avancé</label>

						<div class="col-sm-12">
							<input type="checkbox" v-model="attribute['advanced']"
							@click="
							attribute.advanced = !attribute.advanced,
							(!attribute.advanced) ? attribute.primaryKey 	= false : '',
							(!attribute.advanced) ? attribute.foreignKey 	= false : '' ">
						</div>

					</div>

					<div class="col-sm-3" v-if="attribute.advanced">

						<label>Clé primaire</label>

						<div class="col-sm-12">
							<input type="checkbox" v-model="attribute['primaryKey']" @click="attribute.primaryKey = !attribute.primaryKey">
						</div>
					</div>

					<div class="col-sm-3" v-if="attribute.advanced">

						<label>Clé étrangère</label>

						<div class="col-sm-12">
							<input type="checkbox" v-model="attribute['foreignKey']" @click="attribute.foreignKey = !attribute.foreignKey">
						</div>

					</div>

				</div>

				<div class="form-group row">
					<div class="col-sm-12">
						<button class="btn pull-right blue-grey lighten-5" @click="setAttribute()">Modifier</button>
					</div>
				</div>

			</form>

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

				sending	: false,

				msgFailed	: '',
				msgSaved	: '',

				schema 	: Store.currentSchema,
				attribute 	: Store.currentAttribute
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
				for (key in this.attribute) {
					if (this.attribute.hasOwnProperty(key)) size2++;
				}
				return ((this.schema && size > 0) && (this.attribute && size2 > 0));
			},

			isSchema() {
				//
				return (this.schema && this.schema.rootElement.attributes.includes(this.attribute));
			},

			// Modifie l'attribut
			setAttribute(){
				this.sending = true;

				if (this.attribute.primaryKey)
					this.schema.keys.push(this.attribute.name);

				var datas 	= this.schema;
				var id 		= datas.id;

				api.put(id, datas).then(response => {

					if (response)
						this.msgSaved = "L'élément a bien été ajouté.";
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
