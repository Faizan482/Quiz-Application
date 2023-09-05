import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
// components 
import QuestionCard from './components/QuestionCard';
// type
import { Difficulty, QuestionState } from './API';
// style 
import { GlobalStyle, Wrapper } from './App.style';



export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;

}
const TOTAL_QUESTION = 10;

const App = () => {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  // console.log(questions)

  const startTrivia = async () => {
    // api call //
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTION,
      Difficulty.EASY,
    )
      .catch((err) => console.log(err));

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);

  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {

    if (!gameOver) {
      // user answer 
      const answer = e.currentTarget.value;
      // check answer against correct value 
      const correct = questions[number].correct_answer === answer;
      // add score if answer is correct
      if (correct) setScore(prev => prev + 1);
      // save answer in the array for useranswer 
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers(prev => [...prev, answerObject])
    }

  };

  const nextQuestion = () => {
    // move on the next question 
    // if not the last question 
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTION) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion)
    }
  }




  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>REACT QUIZ</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTION ? (
          <button className='start' onClick={startTrivia}>
            Start
          </button>) : null}
        {!gameOver ? <p className='score'>Score: {score}</p> : null}
        {loading && <p>Loading Question ...</p>}
        {!gameOver && !loading && (
          <QuestionCard
            questionNm={number + 1}
            totalQuestion={TOTAL_QUESTION}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />)}
        {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTION - 1 ? (
          <button className='next' onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}

      </Wrapper>
    </>
  );
}

export default App;
