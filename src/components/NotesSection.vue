<template>
	<div class="notes-section">
		<div class="lds-ripple" :class="{ active: discussionIsLoading }">
			<div></div>
			<div></div>
		</div>
		<div class="button-header">
			<a @click="toggleNotes" :class="{ active: notesSelected }"
				>My notes</a
			>
			<a @click="toggleDiscussion" :class="{ active: discussionSelected }"
				>Discussion</a
			>
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
							<div class="text">{{ item.text }}</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
	data() {
		return {
			dummyCounter: 0,
			notesSelected: false,
			discussionSelected: false,
			discussionIsLoading: false
		};
	},
	name: "NotesSection",
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
						"https://certence.club/scripts/discussion.php?id=" +
							this.question.id +
							"&provider=" +
							this.examData.certProviderSlug +
							"&exam=" +
							this.examData.examSlug
					).then(response => {
						response.json().then(data => {
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
				var text = window.getSelection().toString();
				if (text.length > 0) {
					if (confirm("Copy selection to the Notes?") == true) {
						this.userNotes[this.question.id] =
							this.userNotes[this.question.id] || "";
						let prefix = "";
						if (this.userNotes[this.question.id] != "") {
							prefix = "\n\n";
						}
						this.userNotes[this.question.id] += prefix + text;

						this.saveNotes();
					}
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
	font-size: 0.8em;
	line-height: 1.4;
	overflow-wrap: anywhere;
}
.level-1 {
	margin-left: 30px;
}
.level-2 {
	margin-left: 60px;
}

.lds-ripple.active {
	display: inline-block;
}
.lds-ripple {
	display: none;
	position: absolute;
	width: 80px;
	height: 80px;
	top: 50%;
	left: 50%;
	width: 142px;
	height: 40px;
	margin: -30px 0 0 -25px;
}
.lds-ripple div {
	position: absolute;
	border: 4px solid #777;
	opacity: 1;
	border-radius: 50%;
	animation: lds-ripple 1.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
	animation-delay: -0.7s;
}
@keyframes lds-ripple {
	0% {
		top: 36px;
		left: 36px;
		width: 0;
		height: 0;
		opacity: 1;
	}
	100% {
		top: 0px;
		left: 0px;
		width: 72px;
		height: 72px;
		opacity: 0;
	}
}
</style>
