
// examtopics.com adapter

if (document.querySelector(".exam-view-header")) {

    let data = {};
    
    data.certTitle = document.querySelector("meta[name=description]").getAttribute("content").substring(70).trim();
    if (data.certTitle.endsWith(".") ) {
        data.certTitle = data.certTitle.slice(0, -1).trim();
    }
    if (data.certTitle == "exam") {
        const ind = document.querySelector("title").innerText.indexOf("Exam – ");
        data.certTitle = document.querySelector("title").innerText.substring(0, ind-1);
    }
    data.certProviderSlug = window.location.href.split("/")[4];
    data.examPageUrl = window.location.href;
    data.examSlug = window.location.href.split("/")[5];
    
    data.examDesc = document.querySelector(".exam-view-header .card-title").textContent.trim();
    data.examTitle = document.querySelector(".exam-view-header #exam-box-title").childNodes[0].textContent.trim();
    // data.examPage = document.querySelector(".exam-view-header #exam-box-title .page-indicator").textContent.slice(4, -1);
    data.examQuestionCount = document.querySelector(".exam-view-header .card-text").textContent.trim().split(" ").slice(-2).slice(0, 1)[0];
    
    data.questions = [];
    let cards = document.querySelectorAll(".questions-container .card:not(.topic-card)");

    cards.forEach(card => {
        let item = {};
        item.id = parseInt(card.querySelector("[data-id]").getAttribute("data-id"));
        item.certification = data.certProvider + " / " + data.certTitle;
        item.questionNumber = card.querySelector(".card-header").childNodes[0].textContent.trim().substring(10);
        item.questionText = card.querySelector(".card-text").innerHTML.trim();
        
        item.questionAnswers = [];
        let answers = card.querySelectorAll(".multi-choice-item");
        answers.forEach(answer => {
            item.questionAnswers.push(
                {
                    "letter" : answer.querySelector(".multi-choice-letter").innerText,
                    "text" : answer.childNodes[2].textContent.trim()
                }
            );        
        });

        item.correctAnswer = card.querySelector(".correct-answer").innerText.trim();
        item.correctAnswerDesc = card.querySelector(".answer-description").innerHTML.trim();

        data.questions.push(item);
        
    });

    console.log(JSON.stringify(data));

    sendData(data)
}

function sendData(data) {
    fetch('https://handspit.com/misc/crx-data-receiver.php', {
    // fetch('https://5jfkyy14dj.execute-api.us-west-2.amazonaws.com/prod/CertLoader', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            console.log(data);
            // console.log("Data sent successfully");
        });
}