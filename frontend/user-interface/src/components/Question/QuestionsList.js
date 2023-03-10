import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, useNavigate } from "react-router-dom";
import htmlParse from "html-react-parser";
import DeleteQuestion from "./DeleteQuestion";
import "./QuestionsList.css";

function QuestionsList() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/api/Questions");
        setQuestions(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const showConfirmPopupHandler = (id) => {
    setShowModal(true);
    setItemToDelete(id);
  };
  
  const closeConfirmPopupHandler = () => {
    setShowModal(false);
    setItemToDelete(0);
  };

  const deleteConfirmHandler = async () => {
    await axiosPrivate
      .delete(`/api/Questions/${itemToDelete}`)
      .then((response) => {
        setQuestions((existingData) => {
          return existingData.filter((_) => _.questionId !== itemToDelete);
        });
        setItemToDelete(0);
        setShowModal(false);
      });
  };

  const handleDetails = async (questionId) => {
    try {
      const response = await axiosPrivate.get(`/api/Questions/${questionId}`);
      const questionDetails = response.data;
      navigate("/DetailsQuestion", {
        state: { questionDetails: questionDetails },
      });
    } catch (error) {
      console.error(error);
      alert("Error the Question requested doesn't exist.");
    }
  };

  const handleEdit = async (questionId) => {
    try {
      const response = await axiosPrivate.get(`/api/Questions/${questionId}`);
      const question = response.data;
      navigate("/AdminUI/EditQuestionForm", { state: { question: question } });
    } catch (error) {
      console.error(error);
      alert("Error the Question requested doesn't exist.");
    }
  };

  return (
    <div className="container-xxl text-center">
      <DeleteQuestion
        showModal={showModal}
        title="Delete Confirmation!"
        body="Are you sure to delete this Question?"
        closeConfirmPopupHandler={closeConfirmPopupHandler}
        deleteConfirmHandler={deleteConfirmHandler}
      ></DeleteQuestion>
      <h1>Questions List</h1>
      <p>
        <Link className="btn btn-outline-primary" to="../AdminUI/CreateQuestionForm">
          Create New
        </Link>
      </p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Description</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody >
          {questions.map((question) => (
            <tr key={question.questionId}>
              <td scope="row" id="description" >{htmlParse(question.descriptionStem)}</td>
              <td id="table-button">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleEdit(question.questionId)}
                >
                  Edit
                </button>{" "}
                
                <button
                  className="btn btn-outline-success"
                  onClick={() => handleDetails(question.questionId)}
                >
                  Details
                </button>{" "}
                
                <button
                  className="btn btn-outline-danger"
                  onClick={() => {
                    showConfirmPopupHandler(question.questionId);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuestionsList;
