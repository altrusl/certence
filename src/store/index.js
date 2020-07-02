import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		examData: {
			certTitle: ""
		},
		userData: {
			tags: {}
		},
		currentQuestionIndex: 2
	},
	getters: {
		userTags: state => {
			return state.userData.tags;
		}
	},
	mutations: {
		// eslint-disable-next-line prettier/prettier

		LOAD_USER_DATA(state) {
			state.userData = JSON.parse(window.localStorage.getItem("data"));
			if (!state.userData) {
				state.userData = {};
			}
			if (!state.userData.tags) {
				state.userData.tags = {};
			}
			state.examData.questions.forEach(q => {
				if (state.userData.tags[q.id]) {
					q.tags = state.userData.tags[q.id];
				} else {
					q.tags = [];
				}
			});
		},
		SET_QUESTION_TAGS(state, { tags, qid }) {
			state.userData.tags[qid] = tags;
		},
		SET_CQID(state, { cqid }) {
			state.currentQuestionIndex = cqid;
		},
	},
	actions: {
		// LOAD_EXAM(context, { provider, exam }) {
		// eslint-disable-next-line prettier/prettier
		LOAD_EXAM_DATA({
			state
		}) {
			fetch("/data.json").then(response => {
				response.json().then(data => {
					state.examData = data;
					// eslint-disable-next-line prettier/prettier
					state.examData.questions = state.examData.questions.sort((a, b) => {
						if (a.questionNumber > b.questionNumber) {
							return 1;
						}
						if (a.questionNumber < b.questionNumber) {
							return -1;
						}
						return 0;
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