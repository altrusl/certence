<template>
	<div class="lds-ripple" :class="{ active: loadingStatus }">
		<div></div>
		<div></div>
	</div>
</template>

<script>
export default {
	name: "LoadingAnimation",
	props: {
		loadingStatus: {
			type: Boolean
		}
	},
	computed: {},

	methods: {}
};
</script>

<style scoped>
.lds-ripple.active {
	display: inline-block;
}
.lds-ripple {
	display: none;
	position: absolute;
	width: 80px;
	height: 80px;
	top: 50%;
	left: 50%;
	width: 142px;
	height: 40px;
	margin: -30px 0 0 -25px;
}
.lds-ripple div {
	position: absolute;
	border: 4px solid #777;
	opacity: 1;
	border-radius: 50%;
	animation: lds-ripple 1.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
	animation-delay: -0.7s;
}
@keyframes lds-ripple {
	0% {
		top: 36px;
		left: 36px;
		width: 0;
		height: 0;
		opacity: 1;
	}
	100% {
		top: 0px;
		left: 0px;
		width: 72px;
		height: 72px;
		opacity: 0;
	}
}
</style>
