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
			localScrollMode: false
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
				// {"tags":{"690441":["Intricate"],"690442":["Easy"],"690443":["Easy"],"690445":["Complex"],"690446":["Intricate"],"690447":["Easy"],"690448":["Easy"],"690449":["Intricate"],"690450":["Easy"],"690451":["Easy"],"690452":["Easy"],"690453":["Easy"],"690454":["Complex"],"690455":["Easy"],"690456":["Easy"],"690457":["Complex"],"690458":["Easy"],"690459":["Easy"],"690460":["Complex"],"690461":["Easy"],"690462":["Easy"],"690463":["Complex"],"690464":["Complex"],"690465":["Complex"],"690466":["Complex"],"690467":["Easy"],"690468":["Complex"],"690469":["Easy"],"690470":["Easy"],"690471":["Easy"],"690472":["Complex"],"690473":["Complex"],"690474":["Complex"],"690475":["Easy"],"690476":["Intricate"],"690477":["Easy"],"690478":["Easy"],"690479":["Easy"],"690480":["Easy"],"690481":["Easy"],"690482":["Easy"],"690483":["Easy"],"690484":["Complex"],"690485":["Easy"],"690486":["Easy"],"690487":["Complex"],"690488":["Complex"],"690489":["Intricate","Complex"],"690490":["Complex"],"690491":["Easy"],"690492":["Complex"],"690493":["Easy"],"690494":["Complex"],"690495":["Easy"],"690496":["Easy"],"690497":["Complex"],"690498":["Easy"],"690499":["Easy"],"690500":["Easy"],"690501":["Easy"],"690502":["Easy"],"690503":["Easy"],"690504":["Easy"],"690505":["Complex"],"690506":["Complex"],"690507":["Complex"],"690508":["Complex"],"690509":["Complex"],"690510":["Complex"],"690511":["Complex"],"690512":["Complex"],"690513":["Easy"],"690514":["Easy"],"690515":["Easy"],"690516":["Intricate"],"690517":["Intricate"],"690518":["Complex"],"690519":["Complex"],"690520":["Easy"],"690521":["Easy"],"690522":["Complex"],"690523":["Easy"],"690524":["Complex"],"690525":["Complex"],"690526":["Easy"],"690527":["Complex"],"690528":["Easy"],"690529":["Easy"],"690530":["Easy"],"690531":["Complex"],"690532":["Complex"],"690533":["Complex"],"690534":["Easy"],"690535":["Easy"],"690536":["Easy"],"690537":["Complex"],"690538":["Complex"],"690539":["Complex"],"690540":["Easy"],"690541":["Easy"],"690542":["Easy"],"690543":["Easy"],"690544":["Easy"],"690545":["Easy"],"690546":["Easy"],"690547":["Easy"],"690548":["Complex"],"690549":["Complex"],"690550":["Complex"],"690551":["Easy"],"690552":["Easy"],"690553":["Complex"],"690554":["Complex"],"690555":["Easy"],"690556":["Complex"],"690557":["Easy"],"690558":["Easy"],"690559":["Easy"],"690560":["Easy"],"690561":["Complex"],"690562":["Complex"],"690563":["Complex"],"690564":["Complex"],"690565":["Complex"],"690566":["Easy"],"690567":["Easy"],"690568":["Easy"],"690569":["Easy"],"690570":["Complex"],"690571":["Easy"],"690572":["Intricate"],"690573":["Easy"],"690574":["Easy"],"690575":["Complex"],"690576":["Intricate"],"690577":["Easy"],"690578":["Easy"],"690579":["Complex"],"690580":["Easy"],"690581":["Easy"],"690582":["Complex"],"690583":["Complex"],"690584":["Complex"],"690585":["Easy"],"690586":["Easy"],"690587":["Intricate"],"690588":["Complex"],"690589":["Easy"],"690590":["Easy"],"690591":["Easy"],"690592":["Easy"],"690593":["Easy"],"690594":["Easy"],"690595":["Easy"],"690596":["Easy"],"690597":["Complex"],"690598":["Complex"],"690599":["Easy"],"690600":["Easy"],"690601":["Complex"],"690602":["Easy"],"690603":["Easy"],"690604":["Easy"],"690605":["Easy"],"690606":["Easy"],"690607":["Easy"],"690608":["Easy"],"690609":["Intricate"],"690610":["Complex"],"690611":["Easy"],"690612":["Intricate"],"690613":["Easy"],"690614":["Easy"],"690615":["Complex"],"690616":["Easy"],"690617":["Easy"],"690618":["Complex"],"690619":["Easy"],"690620":["Easy"],"690621":["Easy"],"690622":["Easy"],"690623":["Easy"],"690624":["Easy"],"690625":["Complex"],"690626":["Easy"],"690627":["Easy"],"690628":["Complex"],"690629":["Complex"],"690630":["Easy"],"690631":["Easy"],"690632":["Easy"],"690633":["Easy"],"690634":["Intricate"],"690635":["Easy"],"690636":["Easy"],"690637":["Complex"],"690638":["Complex"],"690639":["Complex"],"690640":["Easy"],"690641":["Complex"],"690642":["Easy"],"690643":["Easy"],"690644":["Easy"],"690645":["Complex"],"690646":["Complex"],"690647":["Easy"],"690648":["Easy"],"690649":["Easy"],"690650":["Easy"],"690651":["Complex"],"690653":["Easy"],"690654":["Easy"],"690655":["Easy"],"690656":["Complex"],"690657":["Complex"],"690658":["Complex"],"690659":["Easy"],"690660":["Easy"],"690661":["Complex"],"690662":["Complex"],"690663":["Easy"],"690664":["Easy"],"690665":["Complex"],"690666":["Complex"],"690667":["Complex"],"690668":["Complex"],"690669":["Easy"],"690670":["Easy"],"690671":["Easy"],"690672":["Complex"],"690673":["Complex"],"690674":["Complex"],"690675":["Complex"],"690676":["Easy"],"690677":["Easy"],"690678":["Complex"],"690679":["Easy"],"690680":["Complex"],"690681":["Complex"],"690682":["Easy"],"690683":["Complex"],"690684":["Intricate"],"690685":["Easy"],"690686":["Easy"],"690687":["Easy"],"690688":["Easy"],"690689":["Complex"],"690690":["Complex"],"690691":["Easy"],"690692":["Easy"],"690693":["Easy"],"690694":["Complex"],"690695":["Complex"],"690696":["Complex"],"690697":["Easy"],"690698":["Complex"],"690699":["Complex"],"690700":["Easy"],"690701":["Easy"],"690702":["Complex"],"690703":["Easy"],"690704":["Complex"],"690705":["Complex"],"690706":["Easy"],"690707":["Complex"],"690708":["Easy"],"690709":["Complex"],"690710":["Easy"],"690711":["Complex"],"690712":["Complex"],"690713":["Easy"],"690714":["Complex"],"690715":["Complex"],"690716":["Complex"],"690717":["Complex"],"690718":["Easy"],"690719":["Easy"],"690720":["Complex"],"690721":["Easy"],"690722":["Complex"],"690723":["Easy"],"690724":["Easy"],"690725":["Easy"],"690726":["Easy"],"690727":["Easy"],"690728":["Easy"],"690729":["Easy"],"690730":["Easy"],"690731":["Complex"],"690732":["Complex"],"690733":["Easy"],"690734":["Easy"],"690735":["Complex"],"690736":["Easy"],"690737":["Easy"],"690738":["Intricate"],"690739":["Complex"],"690740":["Complex"],"690741":["Complex"],"690742":["Complex"],"690743":["Easy"],"690744":["Easy"],"690745":["Easy"],"690746":["Complex"],"690747":["Easy"],"690748":["Easy"],"690749":["Complex"],"690750":["Easy"],"690751":["Easy"],"690752":["Complex"],"690753":["Complex"],"690754":["Easy"],"690755":["Complex"],"690756":["Complex"],"690757":["Complex"],"690758":["Easy"],"690759":["Easy"],"690760":["Easy"],"690761":["Easy"]},"notes":{"690665":"Kurp(18 Dec 2020 12:47)↑ 16\nAnswer is DynamoDB. Both DynamDB and aurora global tables achieve the less than a second replication Aurora global table has one Primary region for READs & WRITES and one or more secondary regions for READs only. The question states : \"orders booked on one continent should be visible to all Regions in a second or less\" Meaning any region can book an order which implies they all need to write locally. Only DynamoDB can achieve this.","690686":"E","690687":"E","690688":"E","690689":"C","690690":"C","690691":"E","690692":"E","690693":"E","690694":"C","690695":"C","690696":"C"}}
				const tags = state.userData.amazon['aws-certified-solutions-architect-associate-saa-c02'].tags;
				// tags = JSON.parse(JSON.stringify(tags));

				const easy = Object.values(tags).filter(val => val.includes('Easy')).length;
				const complex = Object.values(tags).filter(val => val.includes('Complex')).length;
				const intr = Object.values(tags).filter(val => val.includes('Intricate')).length;
				console.log("Easy/Complex/Intricate: " + easy + "/" + complex + "/" + intr);
			});

			console.log("SAVE_USER_DATA");
			window.localStorage.setItem("data", JSON.stringify(state.userData));
		}
	}
	// eslint-disable-next-line prettier/prettier
});