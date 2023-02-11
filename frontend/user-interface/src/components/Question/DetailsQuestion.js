import { useLocation, Link } from "react-router-dom";
import React from 'react';
import htmlParse from 'html-react-parser';
import useAuth from "../../hooks/useAuth";
import './DetailsQuestion.css';

function DetailsQuestion() {
  var count = 1;
  const location = useLocation();
  const question = location.state.questionDetails;
  const correctAnswerIndex = question.options.findIndex((option) => option.isCorrect === true);
  const { auth } = useAuth();
  //   console.log(question);

  return (
    <div className="container">
      <h1>Details</h1>

      <div>
        <h5 id="headers" className="mt-5">Question</h5>
        <table className="table table-bordered ">
          <tbody>
            <tr>
              <th className="col-6">Description Stem</th>
              <td className="col-6">{htmlParse(question.descriptionStem)}</td>
            </tr>
            <tr>
              <th>Topic</th>
              <td>{question.topic.topicDescription}</td>
            </tr>
          </tbody>
          {/* <dl className="row">
            <dt className="col-sm-2">Description Stem</dt>
            <dd className="col-sm-10">{htmlParse(question.descriptionStem)}</dd>
            <dt className="col-sm-2">Topic</dt>
            <dd className="col-sm-10">{question.topic.topicDescription}</dd>
          </dl> */}
        </table>

        <h5 id="headers" className="mt-5">Options</h5>
        <table className="table table-bordered ">
          <tbody>
            {question.options.map((option) => (
              <tr key={option.optionId}>
                <th className="col-6">Option {count++}</th>
                <td className="col-6">{htmlParse(option.description)}</td>
              </tr>
            ))}
            <tr>
              <th className="col-6">Correct Answer</th>
              <td className="col-6">
                Option {correctAnswerIndex + 1}
              </td>
            </tr>
          </tbody>
        </table>
        {/* <table className="table table-bordered">
          <tbody>
            <tr>
              <th>Correct Answer</th>
              <td>
                Option {correctAnswerIndex + 1}
              </td>
            </tr>
          </tbody>
        </table> */}

        <div>
          <Link className='btn btn-secondary' to={auth?.roles == "Admin" ? "../AdminUI/QuestionList" : "../QualityControlUI/ExamList"}>Back to List</Link>
        </div>

      </div>
    </div>
  );
}

export default DetailsQuestion;
