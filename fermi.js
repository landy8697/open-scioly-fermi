document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('submit').addEventListener('click', () => {
        handleSubmit();
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
    document.getElementById("change-search").addEventListener('click', () => {
        changeSearch();
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
    document.getElementById("update-form-fill").addEventListener('click', () => {
        updateFormFill();
    });
    document.getElementById("change-corrections").addEventListener('click', () => {
        changeCorrections();
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

function resetUI(){
    document.getElementById("answer-box").value = "";
    document.getElementById("change-alert").classList.add("d-none");
}
function keyPressed(event){
    if (event.key === "Enter") {
        
        handleSubmit();
        changeStatsDisplay();
    }else if (event.key=="ArrowRight"){
        forward();
        changeStatsDisplay();
    }else if (event.key=="ArrowLeft"){
        back();
        changeStatsDisplay();
    }  
}

function handleSubmit(){
    user = document.getElementById("answer-box").value;
    if(mode==0 || (mode==1&&!isNaN(user))){
        submitAnswer();
    }else{
        submitSearch();
    }
}
function changeNew(){
    btn = document.getElementById("new-question");
    btn.innerText = "New Question";
    document.getElementById("answer-box").setAttribute("placeholder", "Your Fermi Answer");
    document.getElementById("answer-box").setAttribute("type", "numeric");
    document.getElementById("text-entry-help").innerText = "Answer";
    //btn.classList.replace("btn-danger", "btn-success");
    //document.getElementById("dropdown").classList.replace("btn-danger", "btn-success");
    mode = 0;
}

function changeSearch(){
    btn = document.getElementById("new-question");
    btn.innerText = "Question Search";
    document.getElementById("answer-box").setAttribute("placeholder", "Enter Question Attribution");
    document.getElementById("answer-box").setAttribute("type", "text");
    document.getElementById("text-entry-help").innerText = "Search";
    //btn.classList.replace("btn-success", "btn-danger"); 
    //document.getElementById("dropdown").classList.replace("btn-success", "btn-danger");
    mode = 1;
}

function changeCorrections(){
    btn = document.getElementById("new-question");
    btn.innerText = "Show Corrections Only";
    document.getElementById("answer-box").setAttribute("placeholder", "Your Fermi Answer");
    document.getElementById("answer-box").setAttribute("type", "numeric");
    document.getElementById("text-entry-help").innerText = "Search";

    mode = 2;
}
//Standardized data retrival function
function getCurData(curID){ 
    return {...data[curID]} //PREVENTS CHANGING DATA DICTIONARY
}

//Calls placeRandomQuestion, resets ui elements, adds visited to sessionData
function newQuestion(){
    console.log("Question Generation");
    
    if(mode == 0){
        placeRandomQuestion();
    }else if(mode == 1){
        submitSearch();
        //placeMathQuestion();
    }
}

//Changes curData to a random question and calls placeQuestionWithID
function placeRandomQuestion(){
    curID = parseInt(Math.random() * data.length);
    curData = getCurData(curID); 
    //console.log(curData);
    
    //Recursive loop to not display questions with DISCARD in question
    if (curData.question.includes("DISCARD")){
        console.log("DISCARDED QUESTION")
        placeRandomQuestion();
        return;
    }
    placeQuestionWithID();
}

//Used for non-random curID placement (search mode/navigation)
//Calls placeQuestionHTML()
function placeQuestionWithID(){
    curData = getCurData(curID);
    let fullSource = `${curData.source}${curData.hasOwnProperty("number") ? ", #"+curData.number:''}`
    placeQuestionHTML(curData, fullSource);
}

//Checks corrections dictionary and applies corrections if they exist
function applyCorrections(curData, source){
    //FOR BOTH CASES CORRECTION AND NO CORRECTION
    curData['fullSource'] = source;
    curData["originalAnswer"] = curData["answer"]; 
    curData["originalQuestion"] = curData["question"];
    curData["id"] = curID;
    curData["hasAnswerCorrection"] = (corrections[source]["answer"] != "");
    //Check and apply correction if it exists
    if(source in corrections){
        console.log("CORRECTION FOUND");
        
        questionCorrected = corrections[source];
        
        curData["question"] = (questionCorrected["question"] != "") ? questionCorrected["question"] : curData["question"];
        curData["answer"] = (questionCorrected["answer"] != "") ? questionCorrected["answer"] : curData["answer"];
        curData["explanation"] = (questionCorrected["explanation"] != "") ? questionCorrected["explanation"] : curData["explanation"];
        curData["credit"] = (questionCorrected["credit"] != "") ? questionCorrected["credit"] : curData["credit"];
    }
}

//Checks for corrections, places question/source/credit in box
//Sets curData original question/answer and corrections and fullSource
function placeQuestionHTML(curData, source){
    
    if(root==null){
        root = new LinkedNode(curID);
        curNode = root;
    }
    //New navigation (10/14/2023) based on question placement
    //EVAL: Turned out to be worse, reverting
    // if (curNode.next == null){
    //     addNode(curID);
    // }
    /*
    if(formDisplayed){
        toggleForm();
    }
    */
    applyCorrections(curData, source);
    console.log(curData);
    let curCredit = (curData.credit != null) ? curData.credit : "______"
    //QUESTION AND CREDIT DISPLAY
    if(curData["hasAnswerCorrection"] && curCredit.toUpperCase() != "NONE"){
        document.getElementById("question-box").innerHTML = 
        `<p>${curData.question}</p>
        <small><i>${source}<br>Answer corrected by ${curCredit}
        </i></small>`;
        //alert("hi");
    }else if(curData.question != curData.originalQuestion && curCredit.toUpperCase() != "NONE" ){
        document.getElementById("question-box").innerHTML = 
        `<p>${curData.question}</p>
        <small><i>${source}<br>Question text corrected by ${curCredit}
        </i></small>`;
        //alert("hi");
    }else{
        document.getElementById("question-box").innerHTML = 
        `<p>${curData.question}</p>
        <small><i>${source}
        </i></small>`;
    }

    //Makes sure initial page has the helpful info alert
    //Allows the no answer provided for the navigated questions
    if (sessionData.visited != 0){
        document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-secondary my-2" role="alert">
                    No answer provided
                  </div>
       `
    }

    //Runs after question is placed, returning ui elements to default
    sessionData.addVisited();
    resetUI();
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
            Correct! (5 points), answer was ${ans}
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
    if(curData["hasAnswerCorrection"]){
        let explanation = "Explanation: " + (curData.explanation != "" ? curData.explanation : "None");
        console.log(curData.explanation);
        document.getElementById("change-alert").classList.remove("d-none");
        document.getElementById("change-alert").innerHTML = `<div class="alert alert-info my-2" role="alert"> 
        <i class="bi bi-info-circle"></i> The original answer was ${curData.originalAnswer} <br> ${explanation}
        </div>`
    }else{
        document.getElementById("change-alert").classList.add("d-none");
    }
}

//
function submitSearch(){
    console.log("Search Submission");
    user = document.getElementById("answer-box").value.trim();

    if (user==""){
        document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-secondary my-2" role="alert">
                    No search crieteria provided
                  </div>
       `
       return;
    }

    //Searches for question with matching credit
    if(!(user in creditMap)){
        document.getElementById("answer-alert").innerHTML = 
        `
        <div class="alert alert-secondary my-2" role="alert">
                    Nothing found for question attribution: "${user}"
                  </div>
       `
       return;
    }else{
        curID = creditMap[user];
        placeQuestionWithID();
    }
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
        document.querySelectorAll('.github-button').forEach(function(element) {
            console.log("GITHUB BUTTON");
            element.setAttribute("data-color-scheme", "dark");
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
        document.querySelectorAll('.github-button').forEach(function(element) {
            element.setAttribute("data-color-scheme", "light");
        });
    }
    

}

var formDisplayed = false;
function toggleForm(){
    console.log("Toggle Form");
    form = document.getElementById("form-div");
    btn = document.getElementById("toggleform");
    if(form.classList.contains("d-none")){
        formDisplayed = true;
        //embed = document.querySelector("iframe");
        updateFormFill();
        
        /*
        https://docs.google.com/forms/d/e/1FAIpQLScFDhEvsuNndv-dBOCi_y-N7y1h_lsP0KbZvBJeMXq7KQPVTg/viewform?
        usp=pp_url&entry.968995989=RobertYL,+daily+fermi+questions+day+%2354+%5B2018+Eastside+Q10%5D
        &embedded=true
        */
        form.classList.remove("d-none");
        form.classList.add("d-block");
        
        
        btn.innerText = "Hide Form";
    }else{
        formDisplayed = false;
        form.classList.remove("d-block");
        form.classList.add("d-none");
        btn.innerText = "Change/Correct this problem";
    }
}
function updateFormFill(){
    form = document.getElementById("form-div");
    src = `https://docs.google.com/forms/d/e/1FAIpQLScFDhEvsuNndv-dBOCi_y-N7y1h_lsP0KbZvBJeMXq7KQPVTg/viewform?
        usp=pp_url&entry.968995989=${encodeURIComponent(curData.fullSource)}
        &embedded=true`;
    form.innerHTML = `<iframe allowtransparency="true"  style="background-color: transparent;"
        src="${src}" 
        width="640" height="1274" frameborder="0" marginheight="0" marginwidth="0" 
        >Loading…</iframe>`
}



let root = null;
let curNode = null;
function forward(){
    console.log("Forward");
    //Navigate forward one curID if on search mode
    if(mode==1){
        if(curID < data.length)curID++;
        placeQuestionWithID();
        return;
    }
    if(curNode.next == null){ //New question if at end of forward navigation
        newQuestion(); 
        return;
    }
    
    curNode = curNode.next;
    navigationPlace();    
}
function back(){
    console.log("Back");
    //Navigate forward one curID ifon search mode
    if(mode==1){
        if(curID > 0)curID--;
        placeQuestionWithID();
        return;
    }
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
    placeQuestionWithID();
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
                Points: ${this.points}/${this.answered*5}<br>
                Accuracy: ${(this.getAccuracy()*100).toFixed(1)}%<br>`
    }
}
