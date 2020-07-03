import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
/* eslint-disable */

export default new Vuex.Store({
	state: {
		examData: {
			certTitle: ""
		},
		userData: {},
		certUserData: {},
		currentQuestionIndex: 2
	},
	getters: {
		userTags: state => {
			return state.certUserData.tags || {};
		},
		userNotes: state => {
			return state.certUserData.notes || {};
		}
	},
	mutations: {
		// eslint-disable-next-line prettier/prettier

		LOAD_USER_DATA(state) {
			console.log("loading user data");
			state.userData = JSON.parse(window.localStorage.getItem("data")) || {};
			state.userData[state.examData.certProviderSlug] =
				state.userData[state.examData.certProviderSlug] || {};
			// eslint-disable-next-line prettier/prettier
			state.userData[state.examData.certProviderSlug][state.examData.examSlug] =
				state.userData[state.examData.certProviderSlug][state.examData.examSlug] || {};

			state.certUserData =
				state.userData[state.examData.certProviderSlug][state.examData.examSlug];

			state.certUserData = state.certUserData || {};
			state.certUserData.tags = state.certUserData.tags || {};
			state.certUserData.notes = state.certUserData.notes || {};

			state.examData.questions.forEach(q => {
				q.tags = state.certUserData.tags[q.id] || [];
				q.notes = state.certUserData.notes[q.id] || [];
			});
		},
		// eslint-disable-next-line prettier/prettier
		SET_QUESTION_TAGS(state, {
			tags,
			qid
		}) {
			state.certUserData.tags[qid] = tags;
		},
		// eslint-disable-next-line prettier/prettier
		SET_CQID(state, {
			cqid
		}) {
			state.currentQuestionIndex = cqid;
		}
	},
	actions: {
		// eslint-disable-next-line prettier/prettier
		LOAD_EXAM_DATA({
			state
		}, {
			provider,
			exam
		}) {
			const url = "https://handspit.com/misc/certifications/" 
				+ provider + "/" + exam + "/data.json";
			// const url = "/data.json";
			return fetch(url).then(response => {
				response.json().then(data => {
					state.examData = data;
					// eslint-disable-next-line prettier/prettier
					state.examData.questions = state.examData.questions.sort((a, b) => {
						// eslint-disable-next-line prettier/prettier
						if (a.questionNumber > b.questionNumber) {
							return 1;
						}
						if (a.questionNumber < b.questionNumber) {
							return -1;
						}
						return 0;
					});
					state.examData.questions.forEach((q) => {
						q.questionText = "<p>" + q.questionText.replace(/<img src="/g, "<img src=\"https://www.examtopics.com")
							.replace(/<br>/g, "</p><p>") + "</p>";
					});
					this.commit("LOAD_USER_DATA");
				});
			});
		},

		// eslint-disable-next-line prettier/prettier
		SAVE_USER_DATA({
			state
		}) {
			window.localStorage.setItem("data", JSON.stringify(state.userData));
		}
	}
	// eslint-disable-next-line prettier/prettier
});