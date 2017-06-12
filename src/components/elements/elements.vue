<template>
	<div v-if="elements && elements.length > 0">

		<div class="row">
			<div @click="selectAll()" class="col s4 actions-list">
				<i>Tout séléctionner</i>
			</div>
			<div @click="deselectAll()" class="col s4 actions-list" :class="{'disabled': selectedElt.length === 0}">
				<i>Tout déséléctionner</i>
			</div>
			<div @click="deleteAllSel()" class="col s4 actions-list last" :class="{'disabled': selectedElt.length === 0}">
				<i>Supprimer les éléments séléctionnés <i class="fa fa-trash"></i></i>
			</div>
		</div>

		<ul>
			<li v-for="(element, index) in orderBy()" style="clear: both" :data-element="'element_'+index+'_'+element.name">
				<div class="row">
					<div class="col s12 no-padding">

						<div class="col s8 no-padding">

							<hr class="tree pull-left">

							<div v-if="element.attributes" class="pull-left toggle-attribute" @click="toggleAttribute(index, element.name)">
								<i class="fa fa-search-plus" aria-hidden="true"></i>
							</div>

							<div v-else class="pull-left toggle-linkinfo" @click="toggleLinkinfo(index, element.name)">
								<i class="fa fa-search-plus"></i>
							</div>&nbsp; <i class="fa fa-link" v-if="isLink(element)"></i> {{ (element && element.label) ? element.label : '' }}
						</div>

						<div class="col s4">
							<div class="col s3 center">
								<button @click="onEditElement(element)" class="actions-schematable">
									<i class = "fa fa-edit" aria-hidden="true"></i>
								</button>
							</div>

							<div class="col s3 center">
								<button @click="deleteElement(element)" class="actions-schematable">
									<i class = "fa fa-trash" aria-hidden="true"></i>
								</button>
							</div>

							<div class="col s3 center">
								<button @click="onAddAnim(element)" class="actions-schematable" v-if="element.type !== 'link'">
									<i class ="fa fa-plus-circle"></i>
								</button>
								<button class="actions-schematable disabled" v-else>
									<i class ="fa fa-plus-circle"></i>
								</button>
							</div>

							<div class="col s3 center">
								<button @click="selectElement(element)" class="actions-schematable">
									<i class ="fa" :class="{'fa-check-square-o': isSelectElement(element), 'fa-square-o': !isSelectElement(element)}"></i>
								</button>
							</div>

						</div>
					</div>
				</div>

				<elements :elements="element.elements" :prev="element" class="element-content" @edit="onEditAttribute" @editElement="onEditElement" @addAttribute="addAttribute" @addElement="addElement" @addAnim="onAddAnim">
				</elements>

				<attributes :attributes="element.attributes" :element="element" :schema="schema" @edit="onEditAttribute">
				</attributes>

				<linkinfo :element="element"></linkinfo>

			</li>
		</ul>
	</div>
</template>

<script type="text/javascript">

	import Linkinfo 		from './linkinfo'
	import Attributes 		from '../attributes/attributes'
	import Api			from '../../utils/api'
	import Store			from '../../utils/store'

	var api = new Api();

	var $ 	= require('jquery');

	export default {
		name : 'elements',
		props: ['elements', 'prev'],

		created() {
			if (!this.size()) {
				this.$router.push({name: 'list'})
				return (false);
			}
		},

		data() {
			return {
				schema 	: Store.currentSchema,
				selectedElt 	: [],
			}
		},
		components:{
			Attributes,
			Linkinfo
		},
		methods: {

			size() {
				var size = 0, key;
				for (key in this.schema) {
					if (this.schema.hasOwnProperty(key)) size++;
				}
				return ((this.schema && size > 0));
			},

			isSelectElement(element) {
				return (this.selectedElt.includes(element));
			},

			selectElement(element, all) {
				if (this.selectedElt.includes(element)) {
					if (all) return;
					var index 	= 0;
					var this_tmp 	= this
					this.selectedElt.forEach(function(sch){
						if (sch.id === element.id)
							this_tmp.selectedElt.splice(index, 1);
						index++;
					})
				}
				else
					this.selectedElt.push(element);

			},

			// Suppression d'un schéma après avoir demandé la confirmation
			selectAll(){
				for (var i = 0; i < this.elements.length; i++) this.selectElement(this.elements[i], true);
			},

			// Suppression d'un schéma après avoir demandé la confirmation
			deselectAll(){
				this.selectedElt = [];
			},

			// Suppression d'un schéma après avoir demandé la confirmation
			deleteAllSel(){
				if (this.selectedElt.length === 0 || !confirm("Etes-vous sur ?")) return false;
				for (var i = 0; i < this.selectedElt.length; i++)
					this.deleteElement(this.selectedElt[i], true);
				this.selectedElt = [];
			},


			// Trier les éléments par le label
			orderBy() {
				var reverse 	= this.elements;
				if (!reverse || reverse.length === 0) return [];
				var link 	= new Array();
				var notlink 	= new Array();
				for (var i = 0; i < reverse.length; i++) {
					if (this.isLink(reverse[i]))
						link.push(reverse[i]);
					else
						notlink.push(reverse[i]);
				}
				link 		= this.sort(link);
				notlink 	= this.sort(notlink);
				reverse 	= notlink.concat(link);
				return (reverse);
			},

			sort(array) {
				if (array.length === 0) return (array);
				var space 	= array.length;
				var permut 	= true;
				var tmp;

				while (permut || space > 1) {
					space = parseInt(space / 1.33);
					space = (space < 1) ? 1 : space;
					permut = false;
					for (var i = 0; i < array.length - space; i++) {
						var label1 = array[i].label;
						var label2 = array[i + space].label;
						if (label1.toLowerCase() > label2.toLowerCase()){
							tmp 			= array[i];
							array[i] 		= array[i + space];
							array[i + space] 	= tmp;
							permut		= true;
						}
					}
				}
				return (array);
			},

			// Affiche/masque l'attribut
			toggleAttribute(index, name) {
				var element = $('[data-element="element_'+index+'_'+name+'"]');
				$(element).find('.rootAttributes .list-attributes').slideToggle('slow');

				if($(element).find('.fa').hasClass('fa-search-minus'))
					$(element).find('.toggle-attribute .fa').first().removeClass('fa-search-minus').addClass('fa-search-plus');
				else
					$(element).find('.toggle-attribute .fa').first().addClass('fa-search-minus').removeClass('fa-search-plus');

				$(element).children('.list-attributes').slideToggle('slow');
				$(element).children('.element-content').slideToggle('slow');
			},

			// Affiche/masque les infos des links
			toggleLinkinfo(index, name) {
				var element = $('[data-element="element_'+index+'_'+name+'"]');

				if($(element).find('.fa').hasClass('fa-search-minus'))
					$(element).find('.toggle-linkinfo .fa').first().removeClass('fa-search-minus').addClass('fa-search-plus');
				else
					$(element).find('.toggle-linkinfo .fa').first().addClass('fa-search-minus').removeClass('fa-search-plus');

				$(element).children('.linkinfo').slideToggle('slow');
				$(element).children('.element-content').slideToggle('slow');
			},

			/* Cf schematable */
			onAddAnim(element) {
				this.addAttribute(element);
				this.addElement(element);
				this.$emit('addAnim', element);
			},

			onEditAttribute(attribute) {
				this.$emit('edit', attribute);
			},
			onEditElement(element) {
				this.$emit('editElement', element, this.isLink(element));
			},
			addAttribute(element) {
				this.$emit('addAttribute', element);
			},
			addElement(element) {
				this.$emit('addElement', element);
			},
			/* end Cf schematable */

			deleteElement(element, selected) {
				if (!selected && !confirm("Voulez-vous supprimer cet élément ?")) return (false);
				var elements 	= this.elements;
				if (!this.elements) return (false);
				var index 	= this.elements.indexOf(element);

				if (index > -1) 	this.elements.splice(index, 1);
				this.orderBy();
				var datas 	= this.schema;
				var id 		= datas.id;
				api.put(id, datas).catch(error => {
					if (error.response) {
						console.log(error.response.data);
						console.log(error.response.status);
						console.log(error.response.headers);
					} else {
						console.log('Erreur : ' + error.message);
						alert('Erreur : ' + error.message);
					}
					console.log(error.config);
				});
			},
			isLink(element) {
				return (element && element.type === "link");
			}
		}
	}
</script>
