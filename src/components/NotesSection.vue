<template>
	<div class="notes-section">
		<div class="button-header">
			<a @click="toggleNotes" :class="{ active: notesSelected }">Notes</a>
			<a @click="toggleDiscussion" :class="{ active: discussionSelected }"
				>Discussion</a
			>
		</div>
		<div class="notes-body">
			<div class="notes" v-if="notesSelected">1</div>
			<div class="dicussion-container">
				<div class="discussion" v-if="discussionSelected">
					<ul>
						<li
							v-for="item in question.discussion"
							v-bind:key="item.id"
							class="comment"
							:class="'level-' + item.level"
						>
							<div>
								<span class="username">{{
									item.username
								}}</span>
								<span class="date">({{ item.date }})</span>
								<span class="upvotes"
									>↑ {{ item.upvotes }}</span
								>
							</div>
							<div class="text">{{ item.text }}</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			notesSelected: false,
			discussionSelected: false
			// discussion: ""
		};
	},
	name: "NotesSection",
	// components: {
	// NotesSection
	// },
	props: {
		question: {
			type: Object
		},
		examData: {
			type: Object
		}
	},
	computed: {
		discussionHTML() {
			return "---------" + this.question.discussion;
		}
	},

	methods: {
		toggleNotes() {
			this.notesSelected = !this.notesSelected;
			if (this.notesSelected) {
				this.discussionSelected = false;
			}
		},
		toggleDiscussion() {
			this.discussionSelected = !this.discussionSelected;
			if (this.discussionSelected) {
				this.notesSelected = false;
				if (!this.question.discussion) {
					// fetch("https://www.examtopics.com/ajax/discussion/exam-question/" + this.question.id + "/").then(response => {
					// 	response.text().then(data => {
					// 		this.question.discussion = data;
					// 	});
					// });
					var x = new XMLHttpRequest();
					x.open(
						"GET",
						"https://handspit.com/misc/discussion.php?id=" +
							this.question.id +
							"&provider=" +
							this.examData.certProviderSlug +
							"&exam=" +
							this.examData.examSlug
						// "https://cors-anywhere.herokuapp.com/" +
						// "https://www.examtopics.com/ajax/discussion/exam-question/" +
						// this.question.id +
						// "/"
					);
					x.onload = () => {
						console.log(this.question.id);

						// this.$parent.question.discussion = x.responseText;
						// this.$parent.setDiscussion(x.responseText);
						this.$parent.setDiscussion(JSON.parse(x.responseText));
						// setTimeout(() => {
						this.$forceUpdate();
						// }, 300);

						// this.question.discussion = "x.responseText";
					};
					x.send();
				}
			}
		}
	},

	mounted() {
		// fetch("/data.json").then(response => {
		// 	response.json().then(data => {
		// 		this.examData = data;
		// 		this.certTitle = data.certTitle;
		// 		this.certProvider = data.certProvider;
		// 		this.questions = data.questions.sort((a, b) => {
		// 			if (a.questionNumber > b.questionNumber) {
		// 				return 1;
		// 			}
		// 			if (a.questionNumber < b.questionNumber) {
		// 				return -1;
		// 			}
		// 			return 0;
		// 		});
		// 	});
		// });
	}
};
</script>

<style scoped>
.notes-section {
	/* border: 1px solid gray; */
	flex-basis: 40%;
	border-left: 1px solid #ccc;
}
.button-header {
	display: flex;
	justify-content: space-around;
}
.button-header a {
	cursor: pointer;
}
.button-header a.active {
	font-weight: bold;
}

.dicussion-container {
	max-height: 60vh;
	overflow-y: auto;
}

.discussion ul {
	list-style-type: none;
	padding: 10px;
}
.comment {
	margin-bottom: 15px;
	border-bottom: 1px solid #eee;
	padding-bottom: 10px;
}
.upvotes {
	font-size: 0.9em;
	margin-left: 10px;
}
.date {
	font-size: 0.8em;
	color: #777;
	margin-left: 10px;
}
.username {
	color: #777;
	font-size: 0.9em;
}
.text {
	color: #111;
	padding-top: 10px;
	font-size: 0.8em;
	line-height: 1.4;
}
.level-1 {
	margin-left: 30px;
}
.level-2 {
	margin-left: 60px;
}
</style>
