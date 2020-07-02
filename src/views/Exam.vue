<template>
	<div class="desk">
		<h2>{{ examData.certTitle }} ({{ examData.certProvider }})</h2>

		<div class="filter-tag">
			<!-- <label>Filter by tag</label> -->
			<multiselect
				v-model="filterTags"
				placeholder="Filter by tags"
				:options="filterAllTags"
				:multiple="true"
				:show-labels="false"
				@close="checkForUntaggedTag"
			></multiselect>
		</div>

		<div class="question-navigation">
			<button @click="previousQuestion">&lt;&lt;</button>
			<p v-if="question">
				question #{{ question.questionNumber }} ({{
					currentQuestionIndex + 1
				}}
				out of {{ filteredQuestions.length }})
			</p>
			<button @click="nextQuestion">&gt;&gt;</button>
		</div>

		<div class="container" v-if="question">
			<div class="question-section">
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
							<div class="answer-letter">{{ answer.letter }}</div>
							<div class="answer-text">{{ answer.text }}</div>
						</div>
					</li>
				</ul>

				<button @click="showCorrectAnswer = !showCorrectAnswer">
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
			showCorrectAnswer: false,
			allTags: ["Easy", "Complex", "Intricate"],
			selectedTags: [],
			filterTags: []
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

		filteredQuestions() {
			// eslint-disable-next-line vue/no-side-effects-in-computed-properties
			this.$store.commit("SET_CQID", { cqid: 0 });
			if (!this.examData || !this.examData.questions) return [];
			if (this.filterTags.length == 0) return this.examData.questions;

			return this.examData.questions.filter(q => {
				if (
					this.filterTags.length == 1 &&
					this.filterTags == "Untagged" &&
					(!this.userTags[q.id] || this.userTags[q.id].length == 0)
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
		},
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

	// watch: {},

	methods: {
		previousQuestion() {
			if (this.currentQuestionIndex > 0) {
				this.$store.commit("SET_CQID", {
					cqid: this.currentQuestionIndex - 1
				});
			}
			this.initDesk();
		},
		nextQuestion() {
			if (this.currentQuestionIndex < this.filteredQuestions.length - 1) {
				this.$store.commit("SET_CQID", {
					cqid: this.currentQuestionIndex + 1
				});
			}
			this.initDesk();
		},
		initDesk() {
			this.showCorrectAnswer = false;
			if (this.$refs.notes) {
				this.$refs.notes.notesSelected = false;
				this.$refs.notes.discussionSelected = false;
			}
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
			Vue.set(this.question, "discussion", discussion);
		},
		addTag(newTag) {
			this.allTags.push(newTag);
			this.selectedTags.push(newTag);
		},
		checkForUntaggedTag() {
			if (this.filterTags.includes("Untagged")) {
				this.filterTags = ["Untagged"];
			}
		}
	},

	mounted() {
		this.$store.dispatch("LOAD_EXAM_DATA", {
			provider: "amazon",
			exam: "aws-certified-solutions-architect-associate"
		});
	}
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.desk {
	flex-basis: 60%;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.filter-tag {
	display: flex;
	align-items: center;
}
.filter-tag label {
	margin-right: 10px;
}
.question-section {
	flex-basis: 60%;
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
	font-size: 0.8em;
	letter-spacing: 1px;
	font-weight: 700;
	font-family: Comfortaa;
	font-variant: unicase;
}
.answers .selected {
	color: red;
	border: 1px solid red;
}
.comment-replies {
	margin-left: 40px;
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
	/* font-size: 14px; */
}
.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
	background: #444;
}
</style>
