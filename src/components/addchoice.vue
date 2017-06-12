<template>
	<div class="addchoice-container" v-if="size()">
		<div class="container">
			<div class="row">
				<div class="col-sm-6">
					<div class="add-options tonton" @click="backHome">
						<div class="overlay overlay-pink"></div>
						Retourner à l'accueil
						<span class="icon-add-options">
							<i class="fa fa-home fa-5x"></i>
						</span>
					</div>
				</div>

				<div class="col-sm-6">
					<router-link :to="{name: 'create_element'}">
						<div class="add-options">
							<div class="overlay overlay-blue"></div>
							Ajouter un <span class="title">élément</span>
							<span class="icon-add-options">
								<i class="fa fa-arrow-circle-right fa-5x"></i>
							</span>
						</div>
					</router-link>
				</div>

				<div class="col-sm-6">
					<router-link :to="{name: 'create_attribute'}">
						<div class="add-options">
							<div class="overlay overlay-green"></div>
							Ajouter un <span class="title">attribut</span>
							<span class="icon-add-options">
								<i class="fa fa-arrow-circle-right fa-5x"></i>
							</span>
						</div>
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<style type="text/css">
	.addchoice-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background-color: rgba(50, 50, 50, .8);
		animation: slideToLeft 1s;
		z-index: 1;
	}
</style>


<script>

	import Store		from '../utils/store'

	export default {


		created() {
			if (!this.size()) {
				this.$router.push({name: 'list'})
				return (false);
			}
		},

		data() {
			return {
				schema	: Store.currentSchema,
				element	: Store.currentElement
			}
		},

		components: {

		},

		methods: {

			size() {
				var size = 0, key;
				for (key in this.schema) {
					if (this.schema.hasOwnProperty(key)) size++;
				}
				return ((this.schema && size > 0));
			},

			backHome() {
				this.$emit('backHome');
				this.$router.push({'name': 'list'});
			},

			addElement() {

			},

			addAttributeToSchema() {

			}
		}
	}
</script>
