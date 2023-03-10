import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import MyCKEditor from '../MyCKEditor';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SuccessModal from "../SuccessModal";

function EditOptionsForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  var count = 0;
  var correctAnswerIndex = 0;
  
  const oldQuestion = location.state.options;
  oldQuestion.map(option => {
      count++;
      if(option.isCorrect == true)
      {
          correctAnswerIndex = count;
      }
  });

  const [optionDTO, setOptionDTO] = useState({
    questionId: location.state.options[0].questionId,
    description1: location.state.options[0].description,
    description2: location.state.options[1].description,
    description3: location.state.options[2].description,
    description4: location.state.options[3].description,
    correctAnswer: correctAnswerIndex
  });
  const [showModal, setShowModal] = useState(false);
  const closeConfirmPopupHandler = () => {
    setShowModal(false);
  };
  const showConfirmPopupHandler = () => {
    setShowModal(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setOptionDTO({ ...optionDTO, [name]: value });
};

const editorHandleChangeDesc1 = (event,editor) => {
  const data = editor.getData();
  setOptionDTO({ ...optionDTO, description1: data });
};

const editorHandleChangeDesc2 = (event,editor) => {
  const data = editor.getData();
  setOptionDTO({ ...optionDTO, description2: data });
};


const editorHandleChangeDesc3 = (event,editor) => {
  const data = editor.getData();
  setOptionDTO({ ...optionDTO, description3: data });
};

const editorHandleChangeDesc4 = (event,editor) => {
  const data = editor.getData();
  setOptionDTO({ ...optionDTO, description4: data });
};

const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await axiosPrivate.put(`/api/Options`, optionDTO);
        showConfirmPopupHandler();
        setTimeout(() => { 
          navigate('/AdminUI/QuestionList');
        }, 2000); 
    } 
    catch (error) {
        console.error(error);
        alert("Error editing question");
    }
};

  return (
    <div className="container">
       <SuccessModal
          showModal={showModal}
          title="Success"
          body="Question edited successfully!"
          closeConfirmPopupHandler={closeConfirmPopupHandler}
     ></SuccessModal>
      <h2>Edit Options</h2>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="questionId" value={optionDTO.questionId} />
        <div className="form-group mt-4">
          <label className="pb-2">Option 1</label>
          <MyCKEditor
            className="form-control"
            type="text"
            name="description1"
            value={optionDTO.description1}
            onChange={editorHandleChangeDesc1}
          />
        </div>
        <div className="form-group mt-4">
          <label className="pb-2">Option 2</label>
          <MyCKEditor
            className="form-control"
            type="text"
            name="description2"
            value={optionDTO.description2}
            onChange={editorHandleChangeDesc2}
          />
        </div>
        <div className="form-group mt-4">
          <label className="pb-2">Option 3</label>
          <MyCKEditor
            className="form-control"
            type="text"
            name="description3"
            value={optionDTO.description3}
            onChange={editorHandleChangeDesc3}
          />
        </div>
        <div className="form-group mt-4">
          <label className="pb-2">Option 4</label>
          <MyCKEditor
            className="form-control"
            type="text"
            name="description4"
            value={optionDTO.description4}
            onChange={editorHandleChangeDesc4}
          />
        </div>
        <div className="form-group mt-4">
          <label className="pb-2">Correct Answer</label>
          <select
            className="form-control"
            name="correctAnswer"
            value={optionDTO.correctAnswer}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Correct Answer
            </option>
            <option value={1}>Option 1</option>
            <option value={2}>Option 2</option>
            <option value={3}>Option 3</option>
            <option value={4}>Option 4</option>
          </select>
        </div>
        <div className="d-flex">
          <button type="submit" className="btn btn-primary align-self-start">
            Edit
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditOptionsForm;
