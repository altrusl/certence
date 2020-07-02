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
			<button @click="previousQuestion">&lt;&lt; previous</button>
			<h4 v-if="question">
				Question #{{ question.questionNumber }} ({{
					currentQuestionIndex + 1
				}}
				out of {{ filteredQuestions.length }})
			</h4>
			<button @click="nextQuestion">next &gt;&gt;</button>
		</div>

		<div class="container" v-if="question">
			<div class="question-section">
				<p v-html="question.questionText"></p>
				<ul class="answers">
					<li
						v-for="answer in question.questionAnswers"
						:key="answer.letter"
						:class="{
							selected: showCorrectAnswer && answer.isCorrect
						}"
					>
						{{ answer.letter }} {{ answer.text }}
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
			<notes-section
				ref="notes"
				:question="question"
				:examData="examData"
			/>
		</div>
	</div>
</template>

<script>
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
			this.filteredQuestions[
				this.currentQuestionIndex
			].discussion = discussion;
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
.question-section li {
	width: fit-content;
	padding: 0 5px;
	border: 1px solid transparent;
	margin-bottom: 5px;
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
}
.question-navigation button:hover {
	background: lightgray;
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
