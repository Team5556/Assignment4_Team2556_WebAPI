﻿using Assignment4_Team2556_WebAPI.Models;
using Assignment4_Team2556_WebAPI.Models.DTOModels;

namespace Assignment4_Team2556_WebAPI.Services
{
    public interface ICandidateExamService
    {
        Task<IList<Certificate>> GetActiveCertificateList();
        Task<ExamForm> GenerateExamForm(int candidateId, int certificateId);



    }
}