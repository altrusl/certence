<template>
	<div class="up-container">
		<h2>Preferences</h2>

		<div class="row">
			<div class="setting">
				<p class="title">Local scroll mode</p>
				<p class="subtitle">Scroll on question content and discution only instead of scroll on browser window</p>
			</div>
			<input type="checkbox" v-model="userPreferences.localScrollMode" />
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
	name: "UserPreferencesDialog",
	data() {
		return {
			// localScrollMode: true,
			// preferences: {
			// 	localScrollMode: true
			// }
		};
	},
	props: {},
	methods: {
		close() {
			// this.$emit("input", !this.value);
		}
	},
	watch: {
		// localScrollMode: function() {
		// 	console.log("sss");
		// 	this.$store.commit("SAVE_USER_PREFERENCES", this.preferences);
		// }
	},
	computed: {
		...mapState(["userPreferences"])
	},
	created() {}
};
</script>

<style scoped>
.up-container {
	display: flex;
	flex-direction: column;
}
.up-container h2 {
	margin-top: 0.5em;
}
.up-container .row {
	display: flex;
	justify-content: space-between;
}
.up-container input[type="checkbox"] {
	width: 35px;
	height: 22px;
	cursor: pointer;
}
.up-container .row .title {
	margin: 0 20px 5px 0;
	font-size: 1.1em;
	font-weight: bold;
}
.up-container .row .subtitle {
	margin: 0;
	font-size: 0.9em;
}
</style>
