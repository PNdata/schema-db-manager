<template>
	<div class="schematable container">

		<router-view></router-view>

		<addchoice v-if="back" @backHome="backHome"></addchoice>

		<div class="notback" :class="{'back': back}">

			<div v-if="showElement">

				<h5 class="elements-header">Éléments de {{store.currentSchema.label}}
					<span @click="toggleElement" class="close-elements">
						<div class="close-bar bar1"></div>
						<div class="close-bar bar2"></div>
					</span>
				</h5>

				<elements :elements 	= "store.currentSchema.rootElement.elements"
					@edit="onEditAttribute" @editElement="onEditElement" @addAttribute="onAddAttribute" @addElement="onAddElement" @addAnim="onAddAnim" class="list-element">
				</elements>

			</div>


			<div class="dialog" id="confirmDialog">

				<div class="dialog-content">

					<div class="dialog-header" data-dismiss="modal" @click="cancelDelete()">
						<i class="fa fa-times fa-2x"></i>
					</div>

					<div class="dialog-body">
						<p>Confirmer la suppression ?</p>
						<button  class="btn blue-grey white-text" @click="deleteSchema()">Oui</button>
						<button class="btn blue-grey white-text"  @click="cancelDelete()">Non</button>
					</div>

				</div>

			</div>

			<div v-if="problem">
				Ooops... Il semblerait qu'il y ait un problème inattendu
			</div>

			<div class="list-schema" v-else>

				<router-link :to="{name: 'create_schema'}">
					<button class="btn btn-block blue-grey lighten-5">
						Ajouter un schéma
					</button>
				</router-link>

				<div class="form-group row">
					<div class="search-form">
						<div class="search-form-icon">
							<i class="fa fa-search"></i>
						</div>
						<input type="search" v-model="searchVal">
					</div>
				</div>

				<div class="row">
					<div @click="selectAll()" class="col s4 actions-list">
						<i>Tout séléctionner</i>
					</div>
					<div @click="deselectAll()" class="col s4 actions-list" :class="{'disabled': selectedSch.length === 0}">
						<i>Tout déséléctionner</i>
					</div>
					<div @click="deleteAllSel()" class="col s4 actions-list last" :class="{'disabled': selectedSch.length === 0}">
						<i>Supprimer les schémas séléctionnés <i class="fa fa-trash"></i></i>
					</div>
				</div>

				<ul class="list-group">

					<li class="list-group-item row" v-for="schema in schemas_r" :data-schema="schema.name" :data-id="schema.id" v-if="isShowing(schema)">

						<div class="col s12 list-group-item-content">

							<div class="col xs12 s8">

								<div class="drpdown show-toggle">

									<button class="dropbtn">
										<i class="fa fa-search-plus search-icon" aria-hidden="true"></i>
									</button>

									<div class="drpdown-content">

										<button @click 	="setCurrentSchema(schema)"
										class 	="link">
											Éléments
										</button>

										<button @click 	="
											reset(),
											toggleAttribute(schema.id),
											attributes = schema.rootElement.attributes"
											class 	="toggle-attributes link">
											Attributs
										</button>

									</div>

								</div>&nbsp;

								<span v-if="((schema.name && schema.rootElement.name && schema.rootElement.name === schema.name) && (schema.label && schema.rootElement.label && schema.rootElement.label === schema.label))">
									{{schema.label}}
								</span>

								<span v-else style="color: red">
									<i class="fa fa-warning"></i> Le nom et/ou le libellé du schema et du rootElement ne correspondent pas
								</span>
							</div>

							<div class="col xs12 s4">
								<div class="col s3 center">
									<button
										@click = "onEditSchema(schema)"
										class 	= "actions-schematable">
										<i class = "fa fa-edit" aria-hidden="true"></i>
									</button>
								</div>

								<div class="col s3 center">
									<button
										@click = "confirmDelete(schema)"
										class 	= "actions-schematable">
										<i class = "fa fa-trash" aria-hidden="true"></i>
									</button>
								</div>

								<div class="col s3 center">
									<button
										@click="addAnim(schema)"
										class 	="actions-schematable">
										<i class ="fa fa-plus-circle"></i>
									</button>
								</div>

								<div class="col s3 center">
									<button
										class 	="actions-schematable" @click="selectSchema(schema)">
										<i class ="fa" :class="{'fa-check-square-o': isSelectSchema(schema), 'fa-square-o': !isSelectSchema(schema)}"></i>
									</button>
								</div>

							</div>

						</div>

						<div class="rootAttributes">
							<attributes :attributes="attributes" :isSchema="true" :element="schema" :schema="schema" @edit="onEditAttribute" @click="store.currentSchema = schema, isSchema = true"></attributes>
						</div>

					</li>

				</ul>

			</div>
		</div>
	</div>
</template>

<script type="text/javascript">

	var $ = require('jquery');

	import http 			from 'axios'
	import Store 			from '../utils/store'
	import Api			from '../utils/api'
	import Elements 		from './elements/elements'
	import Attributes 		from './attributes/attributes'
	import Addchoice 		from './addchoice'

	var api = new Api();

	export default {

		created() {
			this.schemas 	= Store.schemas;
			this.orderBy();
		},
		data() {
			return {
				attributes	: null,

				schemas 	: [],
				schemas_r 	: [],
				problem	: false,

				search 	: false,
				searchVal 	: '',
				selectedSch 	: [],

				store 		: Store,

				showElement 	: false,
				back 		: false
			}
		},
		components:{
			Attributes	,
			Elements	,
			Addchoice
		},
		methods : {

			// Trier les schémas par le label
			orderBy() {
				var reverse 	= this.schemas_r = this.schemas;
				if (!reverse || reverse.length === 0) return;

				var space 	= reverse.length;
				var permut 	= true;
				var tmp;

				while (permut || space > 1) {
					space = parseInt(space / 1.33);
					space = (space < 1) ? 1 : space;
					permut = false;
					for (var i = 0; i < reverse.length - space; i++) {
						var label1 = reverse[i].label;
						var label2 = reverse[i + space].label;
						if (label1.toLowerCase() > label2.toLowerCase()){
							tmp 			= reverse[i];
							reverse[i] 		= reverse[i + space];
							reverse[i + space] 	= tmp;
							permut		= true;
						}
					}
				}
			},

			//Animation de retour au début de page
			top() {
				$("html, body").animate({"scrollTop": 0}, 'slow');
			},

			// Savoir quel icon mettre
			isSelectSchema(schema) {
				return (this.selectedSch.includes(schema));
			},

			// Sélectionner un schéma
			selectSchema(schema, all) {
				if (this.selectedSch.includes(schema)) {
					if (all) return;
					var index 	= 0;
					var this_tmp 	= this
					this.selectedSch.forEach(function(sch){
						if (sch.id === schema.id)
							this_tmp.selectedSch.splice(index, 1);
						index++;
					})
				}
				else
					this.selectedSch.push(schema);

			},

			// Tous sélectionner
			selectAll(){
				for (var i = 0; i < this.schemas.length; i++) this.selectSchema(this.schemas[i], true);
			},

			// Annuler la selection
			deselectAll(){
				this.selectedSch = [];
			},

			// Suppression de tous les schémas selectionnés
			deleteAllSel(){
				if (this.selectedSch.length === 0 || !confirm("Êtes-vous sûr de vouloir supprimer la selection ?")) return false;
				for (var i = 0; i < this.selectedSch.length; i++)
					this.deleteSchema(this.selectedSch[i], true);
				this.selectedSch = [];
			},

			// Suppression d'un schéma après avoir demandé la confirmation
			deleteSchema(schema, selected){
				var schema = (selected) ? schema : this.store.currentSchema;
				api.delete(schema.id).then(response=>{
					if (!selected) this.cancelDelete();
				}).catch(error=>{
					if (error.response) {
						console.log(error.response.data);
						console.log(error.response.status);
						console.log(error.response.headers);
					} else {
						console.log('Erreur : ' + error.message);
						alert('Erreur : ' + error.message);
					}
					console.log(error.config);
				})
			},

			// Demande la confirmation avant la suppression
			confirmDelete(schema) {
				this.reset();
				this.store.currentSchema 	= schema;
				var dialog 			= $('#confirmDialog');

				$(dialog).removeClass('close-modal').show().addClass('open-modal');
			},

			isShowing(schema) {
				if ((this.searchVal === '') || (schema.name.toLowerCase().indexOf(this.searchVal.toLowerCase()) >= 0 || schema.label.toLowerCase().indexOf(this.searchVal.toLowerCase()) >= 0))
					return (true);
				return (false);
			},

			// Fermer la fenêtre de confirmation
			cancelDelete() {
				var dialog 		= $('#confirmDialog');

				$(dialog).removeClass('open-modal').fadeOut();
			},

			// Réinititalise les données
			reset() {
				this.showElement = false;
			},

			// Permet d'afficher les attributs
			toggleAttribute(id){
				var element = $('[data-id='+id+']');
				if ($(element).find('.rootAttributes .list-attributes').is(':visible')) {
					$(element).find('.rootAttributes .list-attributes').slideToggle('slow');
					$(element).find('.search-icon').toggleClass('fa-search-plus').toggleClass('fa-search-minus');
					return (true);
				}
				setTimeout(function() {
					$(element).find('.search-icon').toggleClass('fa-search-plus').toggleClass('fa-search-minus');
					$('.rootAttributes .list-attributes').slideUp('slow');
					$(element).find('.rootAttributes .list-attributes').slideToggle('slow');
				},100);
			},

			addAnim(schema) {
				this.back = true;
				this.onAddElement(false, schema);
				this.onAddElement(false, schema);
			},

			backHome() {
				this.back = false;
			},

			// Affecte le schéma courant pour le modifier
			onEditSchema(schema) {
				Store.currentSchema = schema;
				this.$router.push({ name : 'edit_schema' })
			},

			onAddAnim(element, schema) {
				this.back = true;
				this.onAddElement(element, schema);
				this.onAddElement(element, schema);
			},

			// Affecte le schéma et l'élement courants pour ajouter un élément
			onAddElement(element, schema) {
				if (schema)
					Store.currentSchema = schema;
				Store.currentElement = element;
				//if (element) this.$router.push({'name': 'create_element'})
			},

			// Affecte l'élément courant pour le modifier
			onEditElement(element, link) {
				Store.currentElement	= element;
				if (element && element.type === "link")
					api.findOneByName(element.target).then(response => {
						Store.schemaTarget = response;
						this.$router.push({ name : 'edit_element' })
					}).catch(error => {
						this.$router.push({ name : 'edit_element' })
					})
				else
					this.$router.push({ name : 'edit_element' })
			},

			// Affecte le schéma et l'élement courants pour ajouter un attribut
			onAddAttribute(element, schema) {
				if (schema)
					Store.currentSchema = schema;
				Store.currentElement = element;
				//if (element) this.$router.push({'name': 'create_attribute'})
			},

			// Affecte le schéma et l'attribut courants pour modifier ce dernier
			onEditAttribute(attribute, schema) {
				if (schema)
					Store.currentSchema = schema;
				Store.currentAttribute = attribute;
				this.$router.push({ name : 'edit_attribute' })
			},

			// Afficher/Masquer les éléments
			toggleElement() {
				this.showElement = !this.showElement;
			},

			setCurrentSchema(schema) {
				if (schema === Store.currentSchema && this.showElement) {
					Store.currentSchema = null;
					this.showElement = false;
					return (false);
				}
				Store.currentSchema = schema
				this.showElement = true;
				this.top()
			}
		}
	}
</script>
