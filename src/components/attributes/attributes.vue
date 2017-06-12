<template>
	<div class="list-attributes" v-if="attributes">
		<ul>
			<table class="table" v-if="attributes.length > 0">

				<thead>
					<tr>
						<th>Nom</th>
						<th>Libellé</th>
						<th>Type</th>
						<th v-if="isSchema">Champ avancé</th>
						<th v-if="isSchema">Clé</th>
						<th></th>
						<th></th>
					</tr>
				</thead>

				<tbody>

					<tr v-for="attribute in orderBy()">
						<td>{{ attribute.name }}</td>
						<td>{{ attribute.label }} <i v-if ="attribute.primaryKey" class="fa fa-key"></i></td>
						<td>{{ attribute.type }}</td>
						<td v-if="isSchema">{{ (attribute.advanced) ? 'Oui' : 'Non' }}</td>
						<td v-if="isSchema">{{ (attribute.primaryKey) ? 'primaire' : (attribute.foreignKey) ? 'étrangère' : 'aucune'}}</td>
						<td>
							<button class="actions-schematable" @click="onEdit(attribute, element)">
								<i class="fa fa-edit" aria-hidden="true"></i>
							</button>
						</td>
						<td>
							<button class="actions-schematable" @click="deleteAttribute(attribute)">
								<i class="fa fa-trash" aria-hidden="true"></i>
							</button>
						</td>
					</tr>

				</tbody>

			</table>
			<p v-else-if="attributes.length == 0">Aucun attribut disponible</p>
		</ul>
	</div>
</template>

<script type="text/javascript">

	import Api	from '../../utils/api'

	var api = new Api();

	export default {

		props: {
			attributes 	: Array,
			element 	: Object,
			isSchema 	: Boolean,
			schema 	: Object
		},

		methods: {

			// Trier les attributs par le label
			/*orderBy() {
				var reverse 	= this.attributes;
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
				return (reverse);
			},*/

			// Trier les attributs par le label
			orderBy() {
				var reverse 	= this.attributes;
				if (!reverse || reverse.length === 0) return [];
				var advanced 	= new Array();
				var notadvanced 	= new Array();
				for (var i = 0; i < reverse.length; i++) {
					if (reverse[i].advanced)
						advanced.push(reverse[i]);
					else
						notadvanced.push(reverse[i]);
				}
				advanced 	= this.sort(advanced);
				notadvanced 	= this.sort(notadvanced);
				reverse 	= advanced.concat(notadvanced);
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


			onEdit(attribute, element) {
				this.$emit('edit', attribute, element);
			},

			deleteAttribute(attribute) {
				if (!confirm("Voulez-vous supprimer cet attribut ?")) return (false);
				var element = (this.isSchema) ? this.schema.rootElement : this.element;
				if (!element)
					return (false);
				var index = this.getIndexOf(element.attributes, attribute);

				if (index > -1)
					element.attributes.splice(index, 1);
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

			getIndexOf(attributes, attribute) {
				for (var i = 0; i < attributes.length; i++)
					if (attributes[i] === attribute)
						return (i);
				return (-1);
			}
		}
	}
</script>
