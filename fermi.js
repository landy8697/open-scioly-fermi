document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('submit').addEventListener('click', () => {
        submitAnswer();
        changeStatsDisplay();
    });
    document.getElementById("new-question").addEventListener('click', () => {
        newQuestion();
        changeStatsDisplay();
    })
    document.body.addEventListener('keydown', (event) => {
        keyPressed(event);
    });
    document.getElementById("dark-mode").addEventListener('click', (event) => {
        darkMode(event);
    });
    document.getElementById("change-new").addEventListener('click', () => {
        changeNew();
    });
    document.getElementById("change-math").addEventListener('click', () => {
        changeMath();
    });
    document.getElementById("forward").addEventListener('click', () => {
        forward();
        changeStatsDisplay();
    });
    document.getElementById("back").addEventListener('click', () => {
        back();
    });
    document.getElementById("toggleform").addEventListener('click', () => {
        toggleForm();
    });
    sessionData = new SessionData();
    newQuestion();
    changeStatsDisplay();
    console.log("DATA LENGTH: ", data.length)
    
});

//SETTINGS
var mode = 0;
var numModes = 2;
var darkmode = false;
var curID = 0;
var curData;
function keyPressed(event){
    if (event.key === "Enter") {
        submitAnswer();
        changeStatsDisplay();
    }else if (event.key=="ArrowRight"){
        forward();
        changeStatsDisplay();
    }else if (event.key=="ArrowLeft"){
        back();
        changeStatsDisplay();
    }  
}

function changeNew(){
    btn = document.getElementById("new-question");
    btn.innerText = "New Question";
    //btn.classList.replace("btn-danger", "btn-success");
    //document.getElementById("dropdown").classList.replace("btn-danger", "btn-success");
    mode = 0
}

function changeMath(){
    btn = document.getElementById("new-question");
    btn.innerText = "Math Question";
    //btn.classList.replace("btn-success", "btn-danger"); 
    //document.getElementById("dropdown").classList.replace("btn-success", "btn-danger");
    mode = 1;
}
//Standardized data retrival function
function getCurData(curID){ 
    return {...data[curID]} //PREVENTS CHANGING DATA DICTIONARY
}
//Changes curData to a random question and calls placeQuestion
function placeRandomQuestion(){
    curID = parseInt(Math.random() * data.length);
    curData = getCurData(curID); 
    console.log(curData);
    
    //Recursive loop to not display questions with DISCARD in question
    if (curData.question.includes("DISCARD")){
        console.log("DISCARDED QUESTION")
        placeRandomQuestion();
        return;
    }

    let fullSource = `${curData.source}${curData.hasOwnProperty("number") ? ", #"+curData.number:''}`
    placeQuestion(curData, fullSource);
}
//Checks for corrections, places question/source/credit in box
function placeQuestion(curData, source){
    
    if(root==null){
        root = new LinkedNode(curID);
        curNode = root;
    }
    //FOR BOTH CASES CORRECTION AND NO CORRECTION
    curData["originalAnswer"] = curData["answer"]; 
    
    //Check and apply correction if it exists
    if(source in corrections){
        console.log("CORRECTION FOUND");
        
        questionCorrected = corrections[source];
        
        curData["question"] = (questionCorrected["question"] != "") ? questionCorrected["question"] : curData["question"];
        curData["answer"] = (questionCorrected["answer"] != "") ? questionCorrected["answer"] : curData["answer"];
        curData["explanation"] = (questionCorrected["explanation"] != "") ? questionCorrected["explanation"] : curData["explanation"];
        curData["credit"] = (questionCorrected["credit"] != "") ? questionCorrected["credit"] : curData["credit"];
    }

    //QUESTION AND CREDIT DISPLAY
    //Only display credit if answer change, none for question formatting stuff
    if(curData.answer != curData.originalAnswer){
        document.getElementById("question-box").innerHTML = 
        `<p>${curData.question}</p>
        <small><i>${source}<br>Modified by ${curData.credit}
        </i></small>`;
    }else{
        document.getElementById("question-box").innerHTML = 
        `<p>${curData.question}</p>
        <small><i>${source}
        </i></small>`;
    }

    //Makes sure initial page has the helpful info alert
    //Allows the no answer provided for the navigated questions
    if (sessionData.visited != 1){
        document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-secondary my-2" role="alert">
                    No answer provided
                  </div>
       `
    }
}
/* placeMathQuestion() is currently unused
function placeMathQuestion(){
    curID = parseInt(Math.random() * data.length);
    question = data[curID];
    console.log(question);
    if (question.question.includes("DISCARD")){
        console.log("DISCARDED QUESTION")
        placeRandomQuestion();
        return;
    }
    let source = "Autogenerated Math Problem"
    document.getElementById("question-box").innerHTML = 
        `<p>${question.question}</p>
        <small><i>${source}
        </i></small>`;
}
*/

//Checks if answer is empty, displays and adds points to sessionData, shows modified answers
function submitAnswer(){
    console.log("Question Submission");
    
    user = document.getElementById("answer-box").value;
    console.log("USER EMPTY", user == "");
    if (curNode.next == null){
        addNode(curID);
    }
    if (user==""){
        document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-secondary my-2" role="alert">
                    No answer provided
                  </div>
       `
       return;
    }
    sessionData.addAnswered();
    ans = curData.answer;
    if (Math.abs(ans-user) == 0){
        document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-primary my-2" role="alert">
            Correct, 5 points!
        </div>
        `;
        sessionData.addPoints(5);
    }else if(Math.abs(ans-user) == 1){
        document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-success my-2" role="alert">
            3 points, answer was ${ans}
        </div>
        `;
        sessionData.addPoints(3);
    }else if(Math.abs(ans-user)==2){
        document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-warning my-2" role="alert">
            1 point, answer was ${ans}
        </div>
        `;
        sessionData.addPoints(1);
    }else{
        document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-danger my-2" role="alert">
            No points, answer was ${ans}
        </div>
        `;
        sessionData.addPoints(0);
    }
    console.log("Original Answer", curData.originalAnswer);
    console.log("Current Answer", curData.answer);
    if(curData.answer != curData.originalAnswer){
        document.getElementById("change-alert").classList.remove("d-none");
        document.getElementById("change-alert").innerHTML = `<div class="alert alert-info my-2" role="alert"> 
        <i class="bi bi-info-circle"></i> The original answer was ${curData.originalAnswer}
        </div>`
    }else{
        document.getElementById("change-alert").classList.add("d-none");
    }
}

//Calls placeRandomQuestion, resets ui elements, adds visited to sessionData
function newQuestion(){
    console.log("Question Generation");
    
    if(mode == 0){
        placeRandomQuestion();
    }else if(mode == 1){
        placeRandomQuestion();
        //placeMathQuestion();
    }
    
    //Runs after question is placed, returning ui elements to default
    sessionData.addVisited();
    document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-secondary my-2" role="alert">
                    No answer provided
                  </div>
       `
    document.getElementById("answer-box").value = "";
    document.getElementById("change-alert").classList.add("d-none");
}

//Make function for customization of webpage dark mode
function darkMode(){
    btn = document.getElementById("dark-mode");
    if(btn.classList.contains("darkoff")){
        darkmode = true;
        console.log("Dark Mode");

        document.documentElement.setAttribute("data-bs-theme", "dark");
        
        
        btn.innerHTML = `<i class="bi bi-brightness-high"></i>`;
        document.querySelectorAll('.btn-top').forEach(function(element) {
            element.classList.remove("darkoff", "btn-outline-dark");
            element.classList.add("darkon", "btn-outline-light");
        });
        //document.querySelectorAll('.btn-main').forEach(function(element) {
            //element.classList.replace("text-light", "text-black");
        //});
        document.querySelectorAll('.apply-bright-text').forEach(function(element) {
            element.classList.replace("text-dark", "text-light");
        });
    }else{
        darkmode = false;
        console.log("Light Mode");
        
        document.documentElement.setAttribute("data-bs-theme", "light");
        btn.innerHTML = `<i class="bi bi-moon-stars-fill"></i>`;
        
        document.querySelectorAll('.btn-top').forEach(function(element) {
            element.classList.remove("darkon", "btn-outline-light");
            element.classList.add("darkoff", "btn-outline-dark");
        });
    //    document.querySelectorAll('.btn-main').forEach(function(element) {
    //        element.classList.replace("text-black", "text-light");
    //    });
        document.querySelectorAll('.apply-bright-text').forEach(function(element) {
            element.classList.replace("text-light", "text-dark");
        });
    }
    

}

function toggleForm(){
    console.log("Toggle Form");
    form = document.getElementById("form-div");
    btn = document.getElementById("toggleform");
    if(form.classList.contains("d-none")){
        form.classList.remove("d-none");
        form.classList.add("d-block");
        btn.innerText = "Hide Form";
    }else{
        form.classList.remove("d-block");
        form.classList.add("d-none");
        btn.innerText = "Change/Correct this problem";
    }
}

let root = null;
let curNode = null;
function forward(){
    console.log("Forward");
    if(curNode.next == null){ //New question if at end of forward navigation
        newQuestion(); 
        return;
    }
    
    curNode = curNode.next;
    navigationPlace();    
}
function back(){
    console.log("Back");
    if(curNode==root){ 
        console.log("At root");
    }
    if(curNode.prev == null){
        curNode = root;
        return;
    }else{
        curNode = curNode.prev;
    }
    navigationPlace();
}
//Places question for existing navigation (forward and back)
function navigationPlace(){
    curID = curNode.ID;
    curData = getCurData(curID);

    let fullSource = `${curData.source}${curData.hasOwnProperty("number") ? ", #"+curData.number:''}`
    placeQuestion(curData, fullSource);
}
function addNode(){
    let newNode = new LinkedNode(curID);
    if(root == null){
        root = newNode;
        curNode = newNode;
    }else{
        curNode.setNext(newNode);
        newNode.setPrev(curNode);
        curNode = newNode;
    }
}
class LinkedNode{
    constructor(ID){
        this.prev = null;
        this.ID = ID;
        this.next = null;
    }

    setNext(next){
        this.next = next;
    }

    setPrev(prev){
        this.prev = prev;
    }
}
/* Unused classes MathQuestion and FermiQuestion
class MathQuestion{
    static formatList = [
        "NUM1 ^ NUM2",
        "NUM1!"
    ];
    constructor(){
        this.question = "";
        this.answer = 0;
    }
}
class FermiQuestion{
    constructor(question, answer, explanation, source, number){
        this.question = "";
        this.answer = 0;
        this.source = "";
        this.number = "";
        this.changeCredit = "";
        this.explanation = "";
    }
}
*/
function changeStatsDisplay(){
    display = document.getElementById("stats-info");
    let tooltip = bootstrap.Tooltip.getInstance(display);
    tooltip.setContent({ '.tooltip-inner':  sessionData.generateReport() })
}
var sessionData;
class SessionData{
    constructor(){
        this.visited = 0;
        this.answered = 0;
        this.points = 0;
        this.vset = new Set(); //visited set
        this.aset = new Set(); //answered set
    }

    getAccuracy(){;
        return this.answered != 0 ? this.points/(this.answered*5) : 0;
    }

    addPoints(points){
        if (this.aset.has(curID)){
            return;
        }
        this.aset.add(curID);
        this.points += points;
    }

    addVisited(){
        if (this.vset.has(curID)){
            return;
        }
        this.vset.add(curID);
        this.visited++;
    }

    addAnswered(){
        if (this.aset.has(curID)){
            return;
        }
        this.answered++;
    }

    generateReport(){
        return `Visited: ${this.visited}<br>
                Answered: ${this.answered}<br>
                Points: ${this.points}<br>
                Accuracy: ${(this.getAccuracy()*100).toFixed(1)}%<br>`
    }
}
