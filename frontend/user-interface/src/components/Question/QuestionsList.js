import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import DeleteQuestion from "./DeleteQuestion";

function QuestionsList() {
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://localhost:7015/api/Questions");
                setQuestions(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const showConfirmPopupHandler=(id) =>{
        setShowModal(true);
        setItemToDelete(id);
        console.log(id);
        
    }
    const closeConfirmPopupHandler = ()=>
    {
        setShowModal(false);
        setItemToDelete(0);
    }

    const deleteConfirmHandler = async() => 
    {
        await axios.delete(`https://localhost:7015/api/Questions/${itemToDelete}`)
        .then((response)=>{
            setQuestions((existingData)=> {return existingData.filter(_=>_.questionId !==itemToDelete)});  
            setItemToDelete(0);
            setShowModal(false);
        });
    }

    const handleDetails = async (questionId) =>  {
        try {
            const response = await axios.get(`https://localhost:7015/api/Questions/${questionId}`);
            const questionDetails = response.data;
            navigate('/AdminUI/DetailsQuestion', {state: { questionDetails: questionDetails}});
        } catch (error) {
            console.error(error);
            alert("Error the Question requested doesn't exist.");
        }
    }

    const handleEdit = async (questionId) =>  {
        try {
            const response = await axios.get(`https://localhost:7015/api/Questions/${questionId}`);
            const question = response.data;
            console.log(question);
            navigate('/AdminUI/EditQuestionForm', {state: { question: question}});
        } catch (error) {
            console.error(error);
            alert("Error the Question requested doesn't exist.");
        }
    }


    return (
        <>
        <DeleteQuestion showModal={showModal}
        title ="Delete Confirmation!"
        body ="Are you sure to delete this Question?"
        closeConfirmPopupHandler ={closeConfirmPopupHandler}
        deleteConfirmHandler ={deleteConfirmHandler}
        >
        </DeleteQuestion>
            <h1>Question List</h1>

            <p>
                {/* <button className='btn btn-primary'>Create New</button> */}
                <Link className='btn btn-primary' to="CreateQuestionForm">Create New</Link>
            </p>
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            Description
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map(question => (
                        <tr key={question.questionId}>
                            <td>
                                {(question).descriptionStem}
                            </td>
                            <td>
                                <button className='btn btn-secondary' onClick={() => handleEdit(question.questionId)}>Edit</button> | 
                                <button className='btn btn-success' onClick={() => handleDetails(question.questionId)}>Details</button> | 
                                <button className='btn btn-danger' onClick={()=>{showConfirmPopupHandler(question.questionId)}} >Delete</button>
                            </td>
                        </tr>
                    ))} 
                </tbody>
            </table>
        </>
    );
}

export default QuestionsList;