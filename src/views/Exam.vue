<template>
	<div class="about">
		<h1>This is an Exam page</h1>
	</div>
</template>

<script>
export default {
	name: "Exam",

	mounted() {
		console.log("---" + this.$route.params.certSlug);
	}
};
</script>
