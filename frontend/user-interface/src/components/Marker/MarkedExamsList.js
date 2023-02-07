import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Table } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const MarkedExamsList = () => {
    const [candidateExams, setCandidateExams] = useState([]); //set marked exam array state
    const { auth } = useAuth(); //retrieve logged in user's data
    const navigate = useNavigate(); //navigate function to automatically redirect page
    const axiosPrivate = useAxiosPrivate(); //custom axios function with user credentials in header


    //
    //Summary: Get all marked exams by logged-in marker
    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosPrivate.get(`/api/CandidateExams/markedexams/${auth.userName}`);
            setCandidateExams(response.data);
        }

        fetchData();
    }, []);


    //
    //Summary: Redirect to Candidate Exam Details page with chosen candidate exam
    const handleReview = async (candidateExamId) => {
        try {
            const response = await axiosPrivate.get(`/api/CandidateExams/${candidateExamId}`);
            const candidateExam = response.data;
            navigate("/MarkerUI/MarkedExamDetails", { state: { candidateExam: candidateExam } });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container>
            {candidateExams.length === 0 ? <div>You do not have any marked exams.</div> :
                <Table>
                    <thead>
                        <tr>
                            <th style={{ whiteSpace: "nowrap" }}>Candidate Exam ID</th>
                            <th style={{ whiteSpace: "nowrap" }}>Certificate Type</th>
                            <th style={{ whiteSpace: "nowrap" }}>Candidate First Name</th>
                            <th style={{ whiteSpace: "nowrap" }}>Candidate Last Name</th>
                            <th style={{ whiteSpace: "nowrap" }}>Exam Date</th>
                            <th style={{ whiteSpace: "nowrap" }}>Marked?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidateExams.map(candidateExam => (
                            <tr key={candidateExam.candidateExamId}>
                                <td style={{ whiteSpace: "nowrap" }}>{candidateExam.candidateExamId}</td>
                                <td style={{ whiteSpace: "nowrap" }}>{candidateExam.exam.certificate.title}</td>
                                <td style={{ whiteSpace: "nowrap" }}>{candidateExam.candidate.firstName}</td>
                                <td style={{ whiteSpace: "nowrap" }}>{candidateExam.candidate.lastName}</td>
                                <td style={{ whiteSpace: "nowrap" }}>{candidateExam.examDate.toLocaleString()}</td>
                                <td style={{ whiteSpace: "nowrap" }}>{candidateExam.isMarked.toString()}</td>
                                <td><Button
                                    className="btn btn-secondary"
                                    onClick={() => handleReview(candidateExam.candidateExamId)}>View Exam</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>}
        </Container>
    )
}

export default MarkedExamsList;