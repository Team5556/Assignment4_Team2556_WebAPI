﻿using Assignment4_Team2556_WebAPI.Models.DTOModels;
using Assignment4_Team2556_WebAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Assignment4_Team2556_WebAPI.Controllers
{
    [Route("api/authentication")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _service;

        public AuthenticationController(IAuthenticationService service)
        {
            _service = service;
        }

        [HttpPost]
        //[ServiceFilter(typeof(ValidationFilterAttribute))]
        public async Task<IActionResult> RegisterUser([FromBody] UserForRegistrationDTO userForRegistration)
        {
            var result = await _service.RegisterUser(userForRegistration);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.TryAddModelError(error.Code, error.Description);
                }
                return BadRequest(ModelState);
            }

            return StatusCode(201);
        }

        [HttpPost("login")]

        public async Task<IActionResult> Authenticate([FromBody] UserForAuthenticationDTO user)
        {
            if(!await _service.ValidateUser(user))
            {
                return Unauthorized();
            }

            return Ok(new { Token = await _service.CreateToken() });
        }


        //[HttpPost("login")]
        ////[ServiceFilter(typeof(ValidationFilterAttribute))]
        //public async Task<IActionResult> Authenticate([FromBody] UserForAuthenticationDto user)
        //{
        //    if (!await _service.AuthenticationService.ValidateUser(user))
        //        return Unauthorized();

        //    return Ok(new
        //    {
        //        Token = await _service
        //        .AuthenticationService.CreateToken()
        //    });
        //}
    }
}