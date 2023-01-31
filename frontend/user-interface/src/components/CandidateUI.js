﻿import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function CandidateUI() {
    const [examDetailsDTO, setExamDetailsDTO] = useState({
        certificateId: "",
        candidateId: "",
    });
    //const [examForm, setExamForm] = useState({
    //    candidateExamId: "",
    //    questions: [],
    //    chosenOptionsId:[]
    //});
    const [certificates, setCertificates] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await axios.get("https://localhost:7015/api/CandidateExams");
                setCertificates(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCertificates();
    }, []);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setExamDetailsDTO({ ...examDetailsDTO, [name]: value });

    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "https://localhost:7015/api/CandidateExams/ExamForm",
                examDetailsDTO
            );
            console.log(response.data);
            const candidateExamId = response.data.candidateExamId;
            const questionsList = response.data.questions;
            navigate("/CandidateUI/GenerateExam",
                {
                    state: { candidateExamId: candidateExamId, questionList: questionsList }

            });
        } catch (error) {
            console.error(error);
            alert("Error creating Exam");
        }
    };
    return (
        <>
            <h3>Welcome Candidate, insert id and certificate to start your Exam :</h3>
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label htmlFor="candidateId">Candidate ID:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="candidateId"
                        name="candidateId"
                        value={examDetailsDTO.candidateId}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="certificateId">Certificates:</label>
                    <select
                        className="form-control"
                        id="certificateId"
                        name="certificateId"
                        value={examDetailsDTO.certificateId}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Select a Certificate
                        </option>
                        {certificates.map((certificate) => (
                            <option key={certificate.certificateId} value={certificate.certificateId}>
                                {certificate.title}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">
                    Generate Exam
                </button>
            </form>
        </>
    );
}

export default CandidateUI;