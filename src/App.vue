<template>
	<div id="app">
		<router-view />
	</div>
</template>

<style>
/* @font-face {
	font-family: "Inter";
	src: url("/assets/fonts/Inter-Regular.woff2");
} */
@font-face {
	font-family: "Comfortaa";
	src: url("/assets/fonts/Comfortaa-Bold.woff2") format("woff"),
		url("/assets/fonts/Comfortaa-Bold.ttf") format("truetype");
	font-display: block;
}
@font-face {
	font-family: "Martel";
	src: url("/assets/fonts/Martel-Bold.woff2") format("woff"),
		url("/assets/fonts/Martel-Bold.ttf") format("truetype");
	font-display: block;
}
#app {
	font-family: "Segoe UI";
	/* font-family: Inter, Helvetica, Arial, sans-serif; */
	/* font-family: Inter, serif; */
	-webkit-font-smoothing: antialiased;
	/* -moz-osx-font-smoothing: grayscale; */
	/* text-align: center; */
	/* color: #111; */
}
body {
	margin: 0;
}
</style>
