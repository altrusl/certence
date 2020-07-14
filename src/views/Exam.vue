<template>
	<div
		class="main-container"
		:class="{ noscroll: userPreferences.localScrollMode }"
	>
		<header class="topbar">
			<div class="logo">
				<p>
					Certfication provider
					<span v-if="!isLoading">
						/ {{ examData.certProvider }}</span
					>
				</p>
			</div>
			<div>
				<router-link :to="{ name: 'Home' }" class="link">
					Home
				</router-link>
				<span class="divider">|</span>
				<a @click="showPreferenses = true" href="#" class="link"
					>Preferences</a
				>
			</div>
		</header>

		<div class="desk" v-if="!isLoading">
			<h2 class="title">{{ examData.certTitle }}</h2>
			<!-- <p class="provider">{{ examData.certProvider }}</p> -->

			<div class="subtitle">
				<div class="question-navigation">
					<button
						@click="previousQuestion"
						:class="{
							inactive: this.currentQuestionIndex == 0
						}"
					>
						&lt;&lt;
					</button>
					<p v-if="question">
						question #{{ question.questionNumber }} ({{
							currentQuestionIndex + 1
						}}
						out of {{ filteredQuestions.length }})
					</p>
					<button
						@click="nextQuestion"
						:class="{
							inactive:
								this.currentQuestionIndex >
								this.filteredQuestions.length - 2
						}"
					>
						&gt;&gt;
					</button>
				</div>

				<div class="filter-tags">
					<label>Filter by:</label>
					<multiselect
						v-model="filterTags"
						placeholder="tags"
						:options="filterAllTags"
						:multiple="true"
						:show-labels="false"
						@close="checkForUntaggedTag"
					></multiselect>
				</div>
			</div>

			<transition name="fade">
				<div class="container" v-if="question && transitionSwitcher">
					<div class="question-section" :question-id="question.id">
						<div v-html="question.questionText"></div>
						<ul class="answers">
							<li
								v-for="answer in question.questionAnswers"
								:key="answer.letter"
								:class="{
									selected:
										showCorrectAnswer && answer.isCorrect
								}"
							>
								<div class="answer">
									<div class="answer-letter">
										{{ answer.letter }}
									</div>
									<div class="answer-text">
										{{ answer.text }}
									</div>
								</div>
							</li>
						</ul>

						<div class="question-footer">
							<button
								class="reveal-solution"
								@click="showCorrectAnswer = !showCorrectAnswer"
								:disabled="
									!question.questionAnswers.some(
										answer => answer.isCorrect
									)
								"
							>
								Reveal Solution
							</button>

							<multiselect
								v-model="questionTags"
								placeholder="Type a new tag here.."
								:options="allTags"
								:multiple="true"
								:taggable="true"
								:show-labels="false"
								@tag="addTag"
							></multiselect>

							<!-- <button @click="showDiscussion">Show dicussion</button> -->
							<button
								@click="nextQuestion"
								:disabled="
									this.currentQuestionIndex >
										this.filteredQuestions.length - 2
								"
							>
								Next question
							</button>
						</div>
					</div>
					<notes-section ref="notes" :question="question" />
				</div>
			</transition>
		</div>
		<footer class="footer">
			<div class="logo">
				<p>certence © 2020</p>
			</div>
		</footer>
		<modal-window
			:visible="showPreferenses"
			@close="showPreferenses = false"
		>
			<user-preferences />
		</modal-window>
	</div>
</template>

<script>
import Vue from "vue";
import NotesSection from "@/components/NotesSection.vue";
import UserPreferences from "@/components/UserPreferences.vue";
import Multiselect from "vue-multiselect";
import { mapGetters, mapState } from "vuex";
import ModalWindow from "s:/src/Vuesence/modal-window/src/components/ModalWindow.vue";

export default {
	data() {
		return {
			dummyCounter: 0,
			isLoading: false,
			showPreferenses: false,
			transitionSwitcher: true,
			showCorrectAnswer: false,
			allTags: ["Easy", "Complex", "Intricate"],
			selectedTags: [],
			filterTags: [],
			filteredQuestions: []
		};
	},
	name: "Exam",
	components: {
		NotesSection,
		Multiselect,
		UserPreferences,
		ModalWindow
	},

	computed: {
		...mapState(["examData", "currentQuestionIndex", "userPreferences"]),
		...mapGetters(["userTags"]),

		question() {
			return this.filteredQuestions[this.currentQuestionIndex];
		},
		filterAllTags() {
			return [...this.allTags, "Untagged"];
		},
		questionTags: {
			get: function() {
				this.dummyCounter;
				return this.question && this.userTags[this.question.id]
					? this.userTags[this.question.id]
					: [];
			},
			set: function(tags) {
				this.$store.commit("SET_QUESTION_TAGS", {
					tags,
					qid: this.question.id
				});
				this.dummyCounter++;
				this.$store.dispatch("SAVE_USER_DATA");
			}
		}
	},

	watch: {
		filterTags: function() {
			this.buildFilteredQuestions();
		}
	},

	methods: {
		previousQuestion() {
			if (this.currentQuestionIndex > 0) {
				this.$store.commit("SET_CQID", {
					cqid: this.currentQuestionIndex - 1
				});
				this.initDesk();
			}
		},
		nextQuestion() {
			if (this.currentQuestionIndex < this.filteredQuestions.length - 1) {
				this.$store.commit("SET_CQID", {
					cqid: this.currentQuestionIndex + 1
				});
				this.initDesk();
			}
		},
		initDesk() {
			this.transitionSwitcher = false;
			this.showCorrectAnswer = false;
			if (this.$refs.notes) {
				this.$refs.notes.notesSelected = false;
				this.$refs.notes.discussionSelected = false;
			}
			setTimeout(() => {
				this.transitionSwitcher = true;
			}, 200);
		},
		showDiscussion() {
			console.log(this.question.id);
		},
		setDiscussion(discussion) {
			Vue.set(
				this.filteredQuestions[this.currentQuestionIndex],
				"discussion",
				discussion
			);
			// Vue.set(this.question, "discussion", discussion);
		},
		addTag(newTag) {
			this.allTags.push(newTag);
			this.selectedTags.push(newTag);
		},
		checkForUntaggedTag() {
			if (this.filterTags.includes("Untagged")) {
				this.filterTags = ["Untagged"];
			}
		},
		buildFilteredQuestions() {
			this.$store.commit("SET_CQID", { cqid: 0 });

			if (!this.examData || !this.examData.questions) {
				this.filteredQuestions = [];
			} else if (this.filterTags.length == 0) {
				this.filteredQuestions = this.examData.questions;
			} else {
				this.filteredQuestions = this.examData.questions.filter(q => {
					if (
						this.filterTags.length == 1 &&
						this.filterTags == "Untagged" &&
						(!this.userTags[q.id] ||
							this.userTags[q.id].length == 0)
					) {
						return true;
					}

					if (this.userTags[q.id] === undefined) {
						return false;
					}

					return this.filterTags.every(r =>
						this.userTags[q.id].includes(r)
					);
				});
			}
		}
	},

	mounted() {
		this.isLoading = true;
		this.$store
			.dispatch("LOAD_EXAM_DATA", {
				provider: this.$route.params.certProvider,
				exam: this.$route.params.certSlug
			})
			.then(() => {
				setTimeout(() => {
					this.isLoading = false;
					this.buildFilteredQuestions();
				}, 50);
			});
		const data = {
			certProvider: this.$route.params.certProvider,
			certSlug: this.$route.params.certSlug
		};
		localStorage.setItem("lastExam", JSON.stringify(data));
	}
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.noscroll.main-container {
	height: 100vh;
	max-height: 100vh;
}
.noscroll .desk {
	overflow-y: hidden;
	flex: 1 1 auto;
}
.noscroll .container {
	overflow-y: hidden;
	flex: 1 1 auto;
}
.noscroll .question-section {
	overflow-y: auto;
}
.noscroll .footer {
	position: absolute;
	bottom: 0;
}

.main-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.desk {
	/* flex-basis: 60%; */
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 80%;
	width: 80%;
	margin-bottom: 70px;
	/* margin: 0 auto 150px; */
}
.topbar {
	width: 100%;
	padding: 7px 30px;
	font-size: 0.9em;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	color: #fff;
	background-color: #444;
	margin-bottom: 20px;
}
.topbar .logo p {
	margin: 0;
	font-family: "Comfortaa";
}
.topbar .logo p span {
	color: #ddd;
}
.topbar .link {
	color: #ddd;
	text-decoration: none;
	font-family: "Comfortaa";
	transition: color 0.3s ease-in-out;
}
.topbar .link:hover {
	color: white;
}
.topbar .divider {
	padding: 0 13px;
}
.footer {
	margin-top: 30px;
	width: 100%;
	color: #fff;
	background-color: #444;
	position: absolute;
	bottom: 0;
}
.footer .logo {
	text-align: center;
	color: #ccc;
}
.title {
	margin-bottom: 0;
}
.subtitle {
	margin-top: 10px;
	width: 80%;
	padding: 20px 0 40px;
	display: flex;
	justify-content: space-between;
}
.subtitle .provider {
	font-size: 1.3em;
	margin: 10px;
	color: #999;
	font-family: "Comfortaa";
}
.filter-tags {
	display: flex;
	align-items: center;
	border: 1px solid #ddd;
	padding: 2px 10px;
	height: fit-content;
}
.filter-tags label {
	color: #999;
}
.container {
	width: 90%;
	/* display: grid; */
	display: flex;
	grid-template-columns: 8fr 4fr;
}
.question-section {
	padding: 10px 10px 0;
	flex: 5 1 0;
	display: flex;
	flex-direction: column;
}
.question-section::-webkit-scrollbar {
	width: 7px;
}
.question-section::-webkit-scrollbar-track {
	box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
	border-radius: 1px;
}

.question-section::-webkit-scrollbar-thumb {
	border-radius: 3px;
	box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);
}
.question-section >>> p {
	text-indent: 1.5em;
	margin-top: 0px;
	margin-bottom: 0.5em;
}
.question-section .answers {
	list-style-type: none;
	margin-top: 1.6em;
	padding-left: 0.8em;
	flex: 1 0 auto;
}
.question-section li {
	width: fit-content;
	padding: 0 5px;
	border: 1px solid transparent;
	margin-bottom: 10px;
	/* text-indent: -1.5em; */
}
.question-section li .answer {
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
}
.question-section .answer-letter {
	font-weight: bold;
	margin-right: 10px;
}
.question-section img {
	max-width: 100%;
}
.question-navigation {
	display: flex;
	align-items: center;
	margin: 0;
}
.question-navigation button {
	color: #555;
	background: transparent;
	border: 1px solid gray;
	font-size: 12px;
	padding: 4px 9px;
	font-weight: normal;
	margin: 6px 10px;
	display: inline-block;
	text-decoration: none;
	min-width: 9em;
	cursor: pointer;
	transition: all 0.3s ease-out;
	text-transform: uppercase;
	border-radius: 2px;

	font-size: 18px;
	border: none;
	padding: 4px 5px;
	font-weight: bold;
	margin: 6px 0px;
	min-width: 3em;
}
.question-navigation button.inactive {
	color: #bbb;
}
.question-navigation button:focus {
	border: none;
	outline: none;
}
.question-navigation button:hover {
	/* background: lightgray; */
}
.question-navigation p {
	/* text-transform: uppercase; */
	color: #444;
	font-size: 1.3em;
	letter-spacing: 1px;
	font-weight: 700;
	font-family: Comfortaa;
	font-variant: unicase;
	margin: 10px 0 11px;
}
.answers .selected {
	color: red;
	border: 1px solid red;
}
.comment-replies {
	margin-left: 40px;
}

.question-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 30px;
	position: sticky;
	bottom: 0;
	background-color: white;
}

.question-footer button {
	border: none;
	border: 1px solid #404040;
	background: #404040;
	color: #ffffff !important;
	font-weight: bold;
	font-family: "Comfortaa";
	padding: 6px 15px;
	height: fit-content;
	/* text-transform: uppercase; */
	border-radius: 3px;
	display: inline-block;
	transition: all 0.3s ease 0s;
	cursor: pointer;
}

.question-footer button:hover {
	/* color: #222 !important; */
	/* font-weight: 700 !important; */
	/* background: #ccc; */
	background: #333;
	/* letter-spacing: 3px; */
	/* background: none; */
	border: 1px solid #999;
	box-shadow: 0px 5px 40px -10px rgba(0, 0, 0, 0.77);
	transition: all 0.3s ease 0s;
}

.question-footer .multiselect {
	border: 1px solid #ddd;
	margin: 0 5px;
	min-height: 50px;
}

.filter-tags >>> .multiselect {
	border: none;
	max-width: 400px;
	transition: all 0.3s ease-in-out;
	cursor: pointer;
	margin-left: 10px;
}
.filter-tags >>> .multiselect:hover {
	background-color: #eee;
}

.filter-tags >>> .multiselect__tags {
	border: none;
}
.filter-tags >>> .multiselect__tag {
	padding: 4px 22px 4px 6px;
	border-radius: 0px;
	margin-right: 15px;
	color: #333;
	line-height: 1;
	background: none;
	/* margin-bottom: 5px; */
	overflow: hidden;
	/* text-overflow: ellipsis; */
	font-weight: bold;
	font-family: "Comfortaa";
	text-transform: lowercase;
	border-bottom: 1px solid #444;
}
.filter-tags >>> .multiselect__tag-icon {
	top: 4px;
	width: 18px;
	line-height: 18px;
	border-radius: 2px;
}
.filter-tags >>> .multiselect__tag-icon:after {
	color: inherit;
}
.filter-tags >>> .multiselect__tag-icon:focus,
.filter-tags >>> .multiselect__tag-icon:hover {
	background: #444;
	color: white;
}

.filter-tags >>> .multiselect__placeholder {
	color: #888;
}
.filter-tags >>> .multiselect__content-wrapper {
	border: 1px solid #888888;
	border-bottom-left-radius: 2px;
	border-bottom-right-radius: 2px;
	box-shadow: 0 1px 10px 0px #868686;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>

<style>
.multiselect {
	width: unset;
}
.multiselect__tag {
	padding: 5px 26px 5px 10px;
	border-radius: 2px;
	background: #7f7f7f;
}
.multiselect__tag-icon:after {
	color: #eee;
}
.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
	background: #444;
}
</style>
