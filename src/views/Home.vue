<template>
	<div class="main-container">
		<header>
			<div class="title">Certence</div>

			<div id="nav">
				<router-link to="/">Home</router-link> |
				<router-link
					:to="{
						name: 'Exam',
						params: {
							certProvider: 'amazon',
							certSlug:
								'aws-certified-solutions-architect-associate'
						}
					}"
					>Exam</router-link
				>
			</div>
		</header>

		<!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
		<img alt="Vue logo" src="/assets/images/logo1.png" />
		<h2>convenient exam preparation desk for</h2>
		<h1>IT certifications</h1>
		<p class="subtitle">
			Free actual exam questions & answers for hundreds of IT
			certifications
		</p>
		<button class="choose-exam" @click="openModal">Choose exam</button>
		<div class="providers">
			<span>Amazon</span>
			<span>Oracle</span>
			<!-- <span>IBM</span> -->
			<span>Microsoft</span>
			<span>Dozens of others</span>
		</div>
		<choose-exam-modal v-model="modalOpen"></choose-exam-modal>
	</div>
</template>

<script>
import ChooseExamModal from "@/components/ChooseExamModal";
export default {
	components: {
		ChooseExamModal
	},
	data() {
		return {
			modalOpen: false
		};
	},
	methods: {
		openModal() {
			this.modalOpen = !this.modalOpen;
		}
	}
};
</script>

<style scoped>
.main-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}
header {
	width: 100%;
	height: 12vh;
	display: flex;
	justify-content: space-between;
}
header .title {
	font-family: "Comfortaa";
	align-self: flex-end;
	margin-left: 1.5em;
	font-size: 2.5em;
	color: #555;
}
header .nav {
	align-self: flex-start;
}
#nav {
	padding: 5px 30px 0;
}
#nav a {
	font-weight: bold;
	color: #2c3e50;
}
#nav a.router-link-exact-active {
	color: #abadac;
}
h1 {
	font-family: "Martel";
	font-size: 3.5em;
	margin: 0 0 0.1em;
}
.subtitle {
	font-size: 1.2em;
	margin-bottom: 35px;
}
.choose-exam {
	padding: 4px 15px;
	cursor: pointer;
	font-size: 1.1em;
	box-shadow: 1px 1px 9px 1px #7e7f86;
	border-radius: 1px;
	transition: all 0.3s ease-in-out;
	outline: none;
	/* font-family: "Comfortaa"; */
}
.choose-exam:hover {
	box-shadow: 1px 1px 9px 2px #555;
	/* background-color: -internal-light-dark-color(
		rgb(239, 239, 239),
		rgb(34, 34, 34)
	); */
	/* background-color: #ccc; */
}
.providers {
	display: flex;
	margin-top: 2em;
}
.providers span {
	margin: 1em;
	padding: 3px 15px;
	border: 1px solid gray;
	background-color: #fafafa;
	border-radius: 3px;
}
</style>
