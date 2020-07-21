<template>
	<div class="main-container">
		<header>
			<div class="title">Certence</div>

			<div class="nav">
				<!-- <router-link to="/">Home</router-link> | -->
				<router-link
					v-if="lastExam != null"
					:to="{
						name: 'Exam',
						params: {
							certProvider: lastExam.certProvider,
							certSlug: lastExam.certSlug
						}
					}"
					>Last exam</router-link
				>
			</div>
		</header>

		<!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
		<!-- <img alt="Vue logo" src="/assets/images/home_logo.png" /> -->
		<img
			src="data:image/png;base64,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"
		/>
		<h2>convenient exam preparation workspace for</h2>
		<h1>IT certifications</h1>
		<p class="subtitle">
			Free actual exam questions & answers for hundreds of IT
			certifications
		</p>
		<button class="choose-exam" @click="modalOpen = true">
			Choose exam
		</button>
		<div class="providers">
			<span>Amazon</span>
			<span>Oracle</span>
			<!-- <span>IBM</span> -->
			<span>Microsoft</span>
			<span>Dozens of others</span>
		</div>
		<!-- <choose-exam-modal v-model="modalOpen"></choose-exam-modal> -->
		<modal-window :visible="modalOpen" @close="modalOpen = false">
			<choose-exam-dialog />
		</modal-window>
	</div>
</template>

<script>
import ChooseExamDialog from "@/components/ChooseExamDialog";
import ModalWindow from "s:/src/Vuesence/modal-window/src/components/ModalWindow.vue";
export default {
	components: {
		ChooseExamDialog,
		ModalWindow
	},
	data() {
		return {
			modalOpen: false,
			lastExamExists: false,
			lastExam: null
		};
	},
	created() {
		this.lastExam = JSON.parse(localStorage.getItem("lastExam"));
		// if (lastExam) {
		// 	this.lastExamExists = true;
		// }
	},
	methods: {
		// openModal() {
		// 	this.modalOpen = !this.modalOpen;
		// }
	}
};
</script>

<style scoped>
.main-container {
	background: linear-gradient(
			rgba(255, 255, 255, 0.5),
			rgba(255, 255, 255, 0.8)
		),
		url(/assets/images/home_bg.jpg);
	background-size: cover;
	height: 100%;
	overflow: hidden;
}
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
.nav {
	padding: 5px 30px 0;
}
.nav a {
	font-weight: bold;
	color: #2c3e50;
	text-decoration: none;
}
.nav a.router-link-exact-active {
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
>>> .vmw-modal-container {
	width: 80%;
	max-width: 500px;
	
}

</style>
