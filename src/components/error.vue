<template>
	<div id="error">
		<div class="error-container">
			<div class="black-text container">
				<div class="error-message">
					{{getMessage()}}
				</div>
				<div class="error-type">
					<div class="row">
						<span class="blue-text">{{part1()}}</span>
						<span class="blue-grey-text">{{part2()}}</span>
						<span class="blue-text">{{part3()}}</span>
					</div>
				</div>
				<div class="error-img">
					<i class="fa fa-3x red-text" :class="{'fa-warning': (type > 400 && type < 404), 'fa-question-circle-o': type === 404 || type === 400}"></i>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">

	export default {
		name : 'error',

		data() {
			return {
				message: 'Salut',
				type: (this.$route.params.type) ? parseInt(this.$route.params.type) : 400
			}
		},
		methods: {
			getMessage() {
				switch(this.type) {
					case (401):
					return 'Oooops, vous ne semblez pas être autorisé à consulter cette page.';
					break;
					case (403):
					return 'Vous n\'avez pas les droits nécessaires pour consulter cette page.';
					break;
					case (404):
					return 'Page not found.';
					break;
					default:
					return 'Oooops, il y\'a une erreur inconnue.';
					break;
				}
			},
			part1() {
				return (parseInt(this.type / 100));
			},part2() {
				return ((parseInt(this.type / 10)) % 10);
			},part3() {
				return (parseInt(this.type % 100));
			}
		}
	}
</script>

<style>
	.error-container {
		text-align: center;
		/*background-color: #fff;*/
		padding: 20px 0;
		font-size: 10em;
	}

	.error-message {
		font-size: 30px;
	}

	.error-type .error-type-item {
		/*padding: 10px;*/
		display: inline;
		font-size: 10em;
	}

	.error-img img{
		display: block;
		margin-right: auto;
		margin-left: auto;
		height: 330px;
		width: 330px;
	}
</style>
