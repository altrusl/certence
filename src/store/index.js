import Vue from "vue";
import Vuex from "vuex";
import anchorme from "anchorme";

Vue.use(Vuex);
/* eslint-disable */

export default new Vuex.Store({
	state: {
		examData: {
			certTitle: ""
		},
		userPreferences: {
			localScrollMode: true
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

		SAVE_USER_PREFERENCES(state, preferences) {
			console.log(1);

			state.userPreferences = preferences;
		},
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
			const url = "certifications/" +
				provider + "/" + exam + "/data.json";
			// const url = "/data.json";
			return fetch(url).then(response => {
				return response.json().then(data => {
					state.examData = data;
					// eslint-disable-next-line prettier/prettier
					state.examData.questions = state.examData.questions.sort((a, b) => {
						// eslint-disable-next-line prettier/prettier
						if (!a.questionTopicNumber) a.questionTopicNumber = 1;
						if (!b.questionTopicNumber) b.questionTopicNumber = 1;

						const an = a.questionTopicNumber * 10000 + parseInt(a.questionNumber);
						const bn = b.questionTopicNumber * 10000 + parseInt(b.questionNumber);

						if (an > bn) {
							return 1;
						}
						if (an < bn) {
							return -1;
						}
						return 0;
					});
					state.examData.questions.forEach((q) => {
						q.questionText = "<p class='image'>" + q.questionText.replace(/<img src="/g, "<img src=\"https://www.examtopics.com")
							.replace(/<br>/g, "</p><p>") + "</p>";

						if (q.correctAnswer.includes("<img")) {
							q.correctAnswer = "<p class='image'>" + q.correctAnswer.replace(/<img src="/g, "<img src=\"https://www.examtopics.com")
								.replace(/<br>/g, "</p><p>") + "</p>";
						}
						// if (q.correctAnswer.includes("<img")) {
						q.correctAnswerDesc = "<p class='image'>" + q.correctAnswerDesc.replace(/<img src="/g, "<img src=\"https://www.examtopics.com")
							.replace(/<br>/g, "</p><p>") + "</p>";
						// }

						
						q.correctAnswerDesc = anchorme({
							"input": q.correctAnswerDesc,
							options: {
								attributes: {
									target: "_blank"
								},
							}
						});
					});
					
					// window.localStorage.setItem("data", data)
					// this.commit("LOAD_USER_DATA");
					fetch('https://esgsprocessing.com/cert/scripts/users/getdata.php').then(response => {
						response.text().then(data => {
							window.localStorage.setItem("data", data)
							this.commit("LOAD_USER_DATA");
						})
					});					
					
				});
			});
		},

		// eslint-disable-next-line prettier/prettier
		SAVE_USER_DATA({
			state
		}) {

			fetch("https://esgsprocessing.com/cert/scripts/users/putdata.php",{
				method: "POST",
				body: JSON.stringify(state.userData)
			})
			.then(function(res){ 
				console.log('Saved to the server'); 
			});

			console.log("SAVE_USER_DATA");
			window.localStorage.setItem("data", JSON.stringify(state.userData));
		}
	}
	// eslint-disable-next-line prettier/prettier
});