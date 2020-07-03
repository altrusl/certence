<template>
	<div class="desk" v-if="!isLoading">
		<h2 class="title">{{ examData.certTitle }}</h2>

		<div class="subtitle">
			<p class="provider">{{ examData.certProvider }}</p>

			<div class="filter-tags">
				<!-- <label>Filter by tag</label> -->
				<multiselect
					v-model="filterTags"
					placeholder="Filter questions by tags"
					:options="filterAllTags"
					:multiple="true"
					:show-labels="false"
					@close="checkForUntaggedTag"
				></multiselect>
			</div>
		</div>

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

		<transition name="fade">
			<div class="container" v-if="question && transitionSwitcher">
				<div class="question-section" :question-id="question.id">
					<div v-html="question.questionText"></div>
					<ul class="answers">
						<li
							v-for="answer in question.questionAnswers"
							:key="answer.letter"
							:class="{
								selected: showCorrectAnswer && answer.isCorrect
							}"
						>
							<div class="answer">
								<div class="answer-letter">
									{{ answer.letter }}
								</div>
								<div class="answer-text">{{ answer.text }}</div>
							</div>
						</li>
					</ul>

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
					<button @click="showDiscussion">Show dicussion</button>

					<!-- <label class="typo__label">Tagging</label> -->
					<multiselect
						v-model="questionTags"
						placeholder="Tags"
						:options="allTags"
						:multiple="true"
						:taggable="true"
						@tag="addTag"
					></multiselect>
				</div>
				<notes-section ref="notes" :question="question" />
			</div>
		</transition>
	</div>
</template>

<script>
import Vue from "vue";
import NotesSection from "@/components/NotesSection.vue";
import Multiselect from "vue-multiselect";
import { mapGetters, mapState } from "vuex";

export default {
	data() {
		return {
			dummyCounter: 0,
			isLoading: false,
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
		Multiselect
	},

	computed: {
		...mapState(["examData", "currentQuestionIndex"]),
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
			// this.filteredQuestions[
			// this.currentQuestionIndex
			// ].discussion = discussion;
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
				// provider: "amazon",
				provider: this.$route.params.certProvider,
				// exam: "aws-certified-solutions-architect-associate"
				exam: this.$route.params.certSlug
			})
			.then(() => {
				this.isLoading = false;
				this.buildFilteredQuestions();
			});
	}
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.desk {
	/* flex-basis: 60%; */
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 80%;
	margin: 0 auto;
}
.title {
	margin-bottom: 0;
}
.subtitle {
	margin-top: 10px;
	width: 80%;
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
}
/* .filter-tag label {
	margin-right: 10px;
} */
.question-section {
	/* flex-basis: 60%; */
	padding: 10px;
}
.question-section >>> p {
	text-indent: 1.5em;
	margin-top: 0px;
	margin-bottom: 0.5em;
}
.question-section ul {
	list-style-type: none;
	margin-top: 1.6em;
	padding-left: 0.8em;
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
.container {
	width: 90%;
	display: grid;
	grid-template-columns: 8fr 4fr;
	margin-top: 1em;
}
.question-navigation {
	display: flex;
	align-items: center;
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
/* .reveal-solution {
	display: none;
}
.reveal-solution.visible {
	display: initial;
} */

.filter-tags >>> .multiselect {
	border: none;
	max-width: 400px;
	transition: all 0.3s ease-in-out;
	cursor: pointer;
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
/* .multiselect__tag {
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
} */
</style>
