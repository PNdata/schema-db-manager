<template>
	<div v-if="msgSaved || msgFailed">
		<div class="col-sm-12 no-padding">
			<div v-if="msgSaved">
				<div class="feedback feedback-success">
					{{ msgSaved }} {{successMsg()}}
				</div>
			</div>
			<div v-else-if="msgFailed">
				<div class="feedback feedback-error">
					{{ msgFailed }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>


	export default {

		props: ['msgFailed', 'msgSaved', 'add'],

		methods: {

			successMsg() {
				setTimeout(() => {
					if (this.add)
						//this.$router.push({name: "create_attribute"});
						return;
					else
						this.$router.push({name: "list"});
				}, 2000);
			}

		}
	}
</script>
