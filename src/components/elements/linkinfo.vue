<template>
	<div v-if="isLink()" class="linkinfo">
		<label>&nbsp;Jointures : </label><em> (destination : {{element.target}})</em><br />
		<span v-for="join in element.joins">
			&nbsp;&nbsp;Source : {{join.source}} &rarr; Cible : {{join.target}}<br />
		</span>
	</div>
</template>

<script type="text/javascript">
	export default {
		props: ['element'],

		methods: {
			isLink() {
				return (this.element && this.element.type === 'link');
			}
		}
	}
</script>
