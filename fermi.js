document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('submit').addEventListener('click', () => {
        submitAnswer();
    });
    document.getElementById("new-question").addEventListener('click', event => {
        if (event.detail === 1) {
            timer = setTimeout(() => {
                newQuestion();
            }, 200)
        }
    })
    document.getElementById("new-question").addEventListener('dblclick', event => {
        clearTimeout(timer);
        switchMode();
    });
    document.getElementById("answer-box").addEventListener('keydown', (event) => {
        keyPressed(event);
    })
    
    placeRandomQuestion();
    console.log("DATA LENGTH: ", data.length)
});

//SETTINGS
var mode = 0;
var numModes = 2;

function keyPressed(event){
    if (event.key === "Enter") {
        submitAnswer();
    }
}

function forward(){

}

function back(){

}

function buttonClick(event){
    if(event.detail >= 2){
        switchMode();
    }else{
        newQuestion();
    }
}
function switchMode(){
    mode = (mode+1) % numModes;
    if(mode==0){
        btn = document.getElementById("new-question");
        btn.innerText = "New Question";
        btn.classList.add("btn-success")
        btn.classList.remove("btn-danger")
    }else if(mode==1){
        btn = document.getElementById("new-question");
        btn.innerText = "Math Question";
        btn.classList.remove("btn-success")
        btn.classList.add("btn-danger")
    }
}
function placeRandomQuestion(){
    cur = parseInt(Math.random() * data.length);
    question = data[cur];
    console.log(question);
    if (question.question.includes("DISCARD")){
        console.log("DISCARDED QUESTION")
        placeRandomQuestion();
        return;
    }
    
    document.getElementById("question-box").innerHTML = 
        `<p>${question.question}</p>
        <small><i>${question.source}${question.hasOwnProperty("number") ? ", #"+question.number:''}
        </i></small>`;
    
    
}
function submitAnswer(){
    console.log("Question Submission");
    user = document.getElementById("answer-box").value;
    console.log("USER EMPTY", user == "");
    if (user==""){
        document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-secondary" role="alert">
                    No answer provided
                  </div>
       `
       return
    }
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
    console.log("Question Generation");
    placeRandomQuestion();
    document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-secondary" role="alert">
                    No answer provided
                  </div>
       `
    document.getElementById("answer-box").value = "";
}

//Make function for customization of webpage dark mode
function darkMode(){
    console.log("Dark Mode");
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
    document.getElementById("question-box").style.backgroundColor = "black";

}

//q: how do I add symbols to my html?
//a: use unicode
//q: what is the unicode for the dark mode switch/lightbulb symbol?
//a: &#x1F4A1;
//q: is there one for a black and white version?
//a: &#x1F4A5;





