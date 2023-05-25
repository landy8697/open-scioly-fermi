document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('submit').addEventListener('click', () => {
        submitAnswer();
    });document.getElementById("new-question").addEventListener('click', () => {
        console.log("plz");
        newQuestion(); 
    });
    placeRandomQuestion();
    console.log(data.length)
});

cur = -1

function placeRandomQuestion(){
    cur = parseInt(Math.random() * data.length);
    question = data[cur];
    console.log(question);
    if (question=="DISCARD"){
        placeRandomQuestion();
        return;
    }
    document.getElementById("question-box").innerHTML = 
        `<p>${question.question}</p>
        <small><i>${question.source}, #${question.number}</i></small>`;
}
function submitAnswer(){
    console.log("hai");
    user = document.getElementById("answer-box").value;
    ans = data[cur].answer;
    if (Math.abs(ans-user) == 0){
        document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-primary" role="alert">
            Correct, 5 points!
        </div>
        `;
    }else if(Math.abs(ans-user) == 1){
        document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-success" role="alert">
            3 points, answer was ${ans}
        </div>
        `;
    }else if(Math.abs(ans-user)==2){
        document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-warning" role="alert">
            1 point, answer was ${ans}
        </div>
        `;
    }else{
        document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-danger" role="alert">
            No points, answer was ${ans}
        </div>
        `;
    }
    
}

function newQuestion(){
    console.log("hai2");
    placeRandomQuestion();
    document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-secondary" role="alert">
                    No answer provided
                  </div>
       `
    document.getElementById("answer-box").value = "";
}
