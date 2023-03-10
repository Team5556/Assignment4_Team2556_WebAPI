import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import DualListBox from "react-dual-listbox";
import htmlParse from "html-react-parser";
import "../GenericCss/Buttons.css";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-dual-listbox/src/scss/react-dual-listbox.scss";
import SuccessModal from "../SuccessModal";

function CreateExams() {
  const [count, setCount] = useState(0);
  const [exam, setExam] = useState({
    certificateId: "",
    passMark: "",
    maximumScore: "",
  });
  const [examQuestions, setExamQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [showModal, setShowModal] = useState(false);
  const closeConfirmPopupHandler = () => {
    setShowModal(false);
  };
  const showConfirmPopupHandler = () => {
    setShowModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/api/Certificates");
        setCertificates(response.data);
        const response2 = await axiosPrivate.get("/api/Questions");
        setQuestions(response2.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setExam({ ...exam, [name]: value });
  };
  const handleBoxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setExamQuestions((pre) => [...pre, value]);
      setCount(count + 1);
    } else {
      setExamQuestions((pre) => {
        return [...pre.filter((skill) => skill !== value)];
      });
      setCount(count - 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //setExam({ ...exam, [maximumScore]: examQuestions.length });
    exam.maximumScore = examQuestions.length;
    console.log(exam);
    try {
      const response = await axiosPrivate.post("/api/Exams", exam);
      console.log(response.data);
      const examId = response.data.examId;
      await axiosPrivate.post(
        `/api/ExamQuestions?examId=${examId}`,
        examQuestions
      );
      showConfirmPopupHandler();
      setTimeout(() => { 
        navigate("/AdminUI/Exams");
      }, 2000); 
    } catch (error) {
      console.error(error);
      alert("Error creating Exam");
    }
  };

  // filters the questions from the topics of the certificate
  const filteredQuestions = [];
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    if (question.topic.certificateId == exam.certificateId) {
      filteredQuestions.push(question);
    }
  }

  // create an object with topics as keys and arrays of questions as values
  const groupedQuestions = filteredQuestions.reduce((acc, question) => {
    const { topicDescription } = question.topic;
    if (!acc[topicDescription]) {
      acc[topicDescription] = [];
    }
    acc[topicDescription].push(question);
    return acc;
  }, {});

  const options = Object.keys(groupedQuestions).map((topic) => {
    const topicQuestions = groupedQuestions[topic];
    const topicOptions = topicQuestions.map((question) => ({
      value: question.questionId,
      label: htmlParse(question.descriptionStem),
    }));
    return { label: topic, options: topicOptions };
  });

  return (
    <div className="container-xl">
      <SuccessModal
          showModal={showModal}
          title="Success"
          body="Exam created successfully!"
          closeConfirmPopupHandler={closeConfirmPopupHandler}
     ></SuccessModal>
      <h1>Create New Exam</h1>
      <form onSubmit={handleSubmit} className="row g-3 form-container">
        <div className="form-group  mt-4">
          <label className="pb-2" htmlFor="certificateId">
            Certificates
          </label>
          <select
            className="form-control"
            id="certificateId"
            name="certificateId"
            value={exam.certificateId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a Certificate
            </option>
            {certificates.map((certificate) => (
              <option
                key={certificate.certificateId}
                value={certificate.certificateId}
              >
                {certificate.title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group mt-4">
          <label className="pb-2">Add Exam Questions</label>
          <DualListBox
            options={options}
            selected={examQuestions}
            onChange={(value) => {
              setExamQuestions(value);
              setCount(value.length);
            }}
            icons={{
              moveLeft: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-arrow-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                  />
                </svg>
              ),
              moveAllLeft: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-chevron-double-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                  />
                </svg>
              ),
              moveRight: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-arrow-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                  />
                </svg>
              ),
              moveAllRight: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-chevron-double-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              ),
            }}
          />
        </div>
        <div className="form-group mt-4 col-md-6">
          <label for="passMark" className="form-label pb-2">
            {" "}
            Pass Mark
          </label>
          <input
            id="passMark"
            name="passMark"
            type="number"
            className="form-control"
            value={exam.passMark}
            onChange={handleChange}
          ></input>
        </div>
        <div className="form-group mt-4 col-md-6">
          <label for="maximumScore" className="form-label pb-2">
            {" "}
            Maximum Mark
          </label>
          <input
            id="exam.maximumScore"
            name="exam.maximumScore"
            type="number"
            className="form-control col-md-6"
            //value={exam.maximumScore}
            value={examQuestions.length}
            // onChange={handleChange}
          ></input>
        </div>

        <div className="d-flex">
        <button type="submit" className="btn btn-primary align-self-start">
          Create
        </button>
        <Link id="backButton" className='btn btn-secondary align-self-start'  to={"../AdminUI/Exams"}>Back to List</Link>
        </div>
      </form>
    </div>
  );
}
export default CreateExams;
