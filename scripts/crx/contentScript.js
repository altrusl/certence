// examtopics.com adapter

if (document.querySelector(".exam-view-header")) {
	const data = {};

	data.certTitle = document
		.querySelector("meta[name=description]")
		.getAttribute("content")
		.substring(70)
		.trim();
	if (data.certTitle.endsWith(".")) {
		data.certTitle = data.certTitle.slice(0, -1).trim();
	}
	if (data.certTitle == "exam") {
		const ind = document
			.querySelector("title")
			.innerText.indexOf("Exam – ");
		data.certTitle = document
			.querySelector("title")
			.innerText.substring(0, ind - 1);
	}
	data.certProviderSlug = window.location.href.split("/")[4];
	data.examPageUrl = window.location.href;
	data.examSlug = window.location.href.split("/")[5];

	data.examDesc = document
		.querySelector(".exam-view-header .card-title")
		.textContent.trim();
	data.examTitle = document
		.querySelector(".exam-view-header #exam-box-title")
		.childNodes[0].textContent.trim();
	// data.examPage = document.querySelector(".exam-view-header #exam-box-title .page-indicator").textContent.slice(4, -1);
	data.examQuestionCount = document
		.querySelector(".exam-view-header .card-text")
		.textContent.trim()
		.split(" ")
		.slice(-2)
		.slice(0, 1)[0];

	data.questions = [];
	const cards = document.querySelectorAll(
		".questions-container .card:not(.topic-card)"
	);

	cards.forEach(card => {
		const item = {};
		item.id = parseInt(
			card.querySelector("[data-id]").getAttribute("data-id")
		);
		item.certification = data.certProviderSlug + " / " + data.certTitle;
		item.questionNumber = card
			.querySelector(".card-header")
			.childNodes[0].textContent.trim()
			.substring(10);
		item.questionTopicNumber = card
			.querySelector(".card-header .question-title-topic")
			.childNodes[0].textContent.trim()
			.substring(6);
		item.questionText = card.querySelector(".card-text").innerHTML.trim();

		item.questionAnswers = [];
		const answers = card.querySelectorAll(".multi-choice-item");
		answers.forEach(answer => {
			let letterNode = answer.querySelector(".multi-choice-letter");
			let letter = letterNode.innerText.trim();
			letterNode.innerText = "";
			item.questionAnswers.push({
				letter: letter,
				text: answer.textContent.trim(),
				isCorrect: answer.classList.contains("correct-hidden")
			});
			letterNode.innerText = letter;
		});

		if (
			card.querySelectorAll(".multi-choice-item.correct-hidden").length >
			1
		) {
			item.multipleChoiceType = "multi";
		} else {
			item.multipleChoiceType = "single";
		}

		item.correctAnswer = card
			.querySelector(".correct-answer")
			.innerHTML.trim();
		item.correctAnswerDesc = card
			.querySelector(".answer-description")
			.innerHTML.trim();

		data.questions.push(item);
	});

	console.log(JSON.stringify(data));

	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	sendData(data);
}

function sendData(data) {
	fetch("https://certence.club/scripts/crx-data-receiver.php", {
			// fetch('https://5jfkyy14dj.execute-api.us-west-2.amazonaws.com/prod/CertLoader', {
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=utf-8"
			},
			body: JSON.stringify(data)
		})
		.then(response => {
			return response.text();
		})
		.then(data => {
			console.log(data);
			// console.log("Data sent successfully");
		});
}