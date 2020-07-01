<template>
	<div class="desk">
		<h2>{{ examData.certTitle }} ({{ examData.certProvider }})</h2>

		<div class="question-navigation">
			<button @click="previousQuestion">&lt;&lt; previous</button>
			<h4 v-if="question">
				Question #{{ question.questionNumber }} ({{
					currentQuestionIndex + 1
				}}
				out of {{ questions.length }})
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
export default {
	data() {
		return {
			certTitle: "",
			certProvider: "",
			examData: [],
			questions: [],
			currentQuestionIndex: 0,
			showCorrectAnswer: false
		};
	},
	name: "Exam",
	components: {
		NotesSection
	},

	computed: {
		question() {
			return this.questions[this.currentQuestionIndex];
		}
	},

	methods: {
		previousQuestion() {
			if (this.currentQuestionIndex > 0) {
				this.currentQuestionIndex--;
			}
			this.showCorrectAnswer = false;
			this.$refs.notes.notesSelected = false;
			this.$refs.notes.discussionSelected = false;
		},
		nextQuestion() {
			if (this.currentQuestionIndex < this.questions.length - 1) {
				this.currentQuestionIndex++;
			}
			this.showCorrectAnswer = false;
			this.$refs.notes.notesSelected = false;
			this.$refs.notes.discussionSelected = false;
		},
		showDiscussion() {
			console.log(this.question.id);
		},
		setDiscussion(discussion) {
			this.questions[this.currentQuestionIndex].discussion = discussion;
		}
	},

	mounted() {
		fetch("/data.json").then(response => {
			response.json().then(data => {
				this.examData = data;
				this.certTitle = data.certTitle;
				this.certProvider = data.certProvider;
				this.questions = data.questions.sort((a, b) => {
					if (a.questionNumber > b.questionNumber) {
						return 1;
					}
					if (a.questionNumber < b.questionNumber) {
						return -1;
					}
					return 0;
				});
			});
		});
	}
};
</script>

<style scoped>
.desk {
	flex-basis: 60%;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.question-section {
	flex-basis: 60%;
	padding: 10px;
}
.question-section li {
	width: fit-content;
	padding: 0 5px;
	border: 1px solid transparent;
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
