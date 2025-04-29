import { QuizSetter } from "./JFTBasic/setQuiz.js";
let questions = [];
let currentIndex = 0;
document.addEventListener("DOMContentLoaded", () => {
    fetch("/JFTBasic/json/questions_section1.json")
        .then((response) => response.json())
        .then((data) => {
        questions = data;
        showQuestion();
    });
});
// JSONファイルを読み込む
function showQuestion() {
    window.quizSetter = new QuizSetter("exam-container");
    window.quizSetter.setElement(questions);
}
function answer(selected) {
    const correct = questions[currentIndex].correct_choice;
    if (selected === correct) {
        alert("正解！");
    }
    else {
        alert("不正解...");
    }
}
