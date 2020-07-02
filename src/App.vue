<template>
	<div id="app">
		<div id="nav">
			<router-link to="/">Home</router-link> |
			<router-link
				:to="{
					name: 'Exam',
					params: {
						certProvider: 'amazon',
						certSlug: 'aws-certified-solutions-architect-associate'
					}
				}"
				>Exam</router-link
			>
		</div>
		<router-view />
	</div>
</template>

<style>
@font-face {
	font-family: "Inter";
	src: url("/assets/fonts/Inter-Regular.woff2");
}
#app {
	font-family: Inter, Helvetica, Arial, sans-serif;
	/* font-family: Inter, serif; */
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	/* text-align: center; */
	color: #111;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}
</style>
