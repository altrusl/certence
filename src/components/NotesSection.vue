<template>
	<div class="notes-section">
		<loading-animation :loadingStatus="discussionIsLoading" />
		<div class="button-header">
			<a @click="toggleNotes" :class="{ active: notesSelected }"
				>My notes</a
			>
			<a @click="toggleDiscussion" :class="{ active: discussionSelected }"
				>Discussion</a
			>
			<a @click="$emit('close')" class="close-button">Close</a>
		</div>
		<div ref="copyToNotes" class="copy-selection-prompt">
			Copy selection to the Notes?
		</div>
		<div class="notes-body" ref="notesContainer">
			<div class="notes" v-if="notesSelected">
				<textarea v-model="userNotes[question.id]" rows="15"></textarea>
				<button @click="saveNotes">Save</button>
			</div>
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
								<span class="date"
									>({{ item.date.substr(4) }})</span
								>
								<span class="upvotes"
									>↑ {{ item.upvotes }}</span
								>
							</div>
							<div class="text" v-html="item.text"></div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import LoadingAnimation from "@/components/LoadingAnimation.vue";
export default {
	data() {
		return {
			dummyCounter: 0,
			notesSelected: false,
			discussionSelected: false,
			discussionIsLoading: false,
			textSelection: ""
		};
	},
	name: "NotesSection",
	components: {
		LoadingAnimation
	},
	props: {
		question: {
			type: Object
		}
	},
	computed: {
		...mapState(["examData"]),
		...mapGetters(["userNotes"])
	},

	methods: {
		toggleNotes() {
			this.notesSelected = !this.notesSelected;
			if (this.notesSelected) {
				this.discussionSelected = false;
			}
		},
		saveNotes() {
			this.$store.dispatch("SAVE_USER_DATA");
		},
		toggleDiscussion() {
			this.discussionSelected = !this.discussionSelected;
			if (this.discussionSelected) {
				this.notesSelected = false;
				if (!this.question.discussion) {
					this.discussionIsLoading = true;
					fetch(
						process.env.VUE_APP_API_URL +
							"scripts/discussion.php?id=" +
							this.question.id +
							"&provider=" +
							this.examData.certProviderSlug +
							"&exam=" +
							this.examData.examSlug
					).then(response => {
						response.json().then(data => {
							data = data.map(comment => {
								return {
									...comment,
									text: comment.text.replaceAll(
										"\n",
										"<br />"
									)
								};
							});
							console.log(data);
							this.$parent.setDiscussion(data);
							this.$forceUpdate();
							this.discussionIsLoading = false;
						});
					});
				}
			}
		}
	},

	mounted() {
		this.$refs.notesContainer.addEventListener(
			"mouseup",
			event => {
				if (event.target.tagName == "TEXTAREA") {
					return;
				}

				this.textSelection = window.getSelection().toString();

				if (this.textSelection.length > 0) {
					this.$refs.copyToNotes.classList.add("visible");
				} else {
					this.$refs.copyToNotes.classList.remove("visible");
				}
			},
			false
		);
		// document.addEventListener(
		// 	"mouseup",
		// 	() => {
		// 		this.$refs.copyToNotes.classList.remove("visible");
		// 	},
		// 	false
		// );
		this.$refs.copyToNotes.addEventListener(
			"click",
			() => {
				if (this.textSelection.length > 0) {
					this.$refs.copyToNotes.classList.remove("visible");

					this.userNotes[this.question.id] =
						this.userNotes[this.question.id] || "";
					let prefix = "";
					if (this.userNotes[this.question.id] != "") {
						prefix = "\n\n";
					}
					this.userNotes[this.question.id] +=
						prefix + this.textSelection;
					this.saveNotes();
					this.textSelection = "";
				}
			},
			false
		);
	}
};
</script>

<style scoped>
.notes-section {
	/* border: 1px solid gray; */
	/* flex-basis: 40%; */
	border-left: 1px solid #ccc;
	flex: 3 1 0;
	position: relative;
}
.copy-selection-prompt {
	text-align: center;
	cursor: pointer;
	text-decoration: underline;
	display: none;
}
.copy-selection-prompt.visible {
	display: block;
}
.button-header {
	display: flex;
	justify-content: space-around;
	margin-bottom: 10px;
}
.button-header a {
	cursor: pointer;
	color: #777;
	font-weight: bold;
	transition: all 0.2s ease-out;
}
.button-header a:hover {
	color: #444;
}
.button-header a.active {
	color: #111;
}

.notes {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.notes textarea {
	margin: 10px 10px 10px;
	width: 90%;
}

.dicussion-container {
	max-height: 60vh;
	overflow-y: auto;
}
.dicussion-container::-webkit-scrollbar {
	width: 7px;
}
.dicussion-container::-webkit-scrollbar-track {
	box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
	border-radius: 1px;
}

.dicussion-container::-webkit-scrollbar-thumb {
	border-radius: 3px;
	box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);
}

.discussion ul {
	list-style-type: none;
	padding: 10px 10px 0;
	margin-bottom: 5px;
}
.comment {
	margin-bottom: 15px;
	border-bottom: 1px solid #eee;
	padding-bottom: 10px;
}
.comment:last-child {
	margin-bottom: 0;
}
.upvotes {
	font-size: 0.9em;
	margin-left: 10px;
}
.date {
	font-size: 0.6em;
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
	font-size: 0.9em;
	line-height: 1.4;
	overflow-wrap: anywhere;
}
.level-1 {
	margin-left: 30px;
}
.level-2 {
	margin-left: 60px;
}
@media (max-width: 430px) {
	.dicussion-container[data-v-b1a941d8] {
		max-height: 100vh;
	}
	.notes-section {
		padding-top: 20px;
	}
}
</style>
