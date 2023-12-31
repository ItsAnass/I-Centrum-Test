﻿using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using Newtonsoft.Json.Linq;
using System;
using System.Web;
using Microsoft.Extensions.Primitives;
using Microsoft.AspNetCore.WebUtilities;
using System.Xml.Linq;

namespace BackEnd.Controllers
{
	[Route("api/[controller]")]
	[ApiController]

	public class UserController : ControllerBase
	{
		private readonly IHttpContextAccessor _contextAccessor;

		public UserController(IHttpContextAccessor contextAccessor)
		{
			_contextAccessor = contextAccessor;
		}



		[HttpPost("authenticate")]
		public async Task<IActionResult> Authenticate([FromBody] User postData)
		{
			var token = _getToken(postData);

			if (token == null) return BadRequest("Invalid Token");
			
			_contextAccessor.HttpContext.Session.SetString("token", token);

			return Ok(new{Token = token});
		}


		[HttpGet("image")]
		public async Task<IActionResult> GetBase64Image([FromHeader(Name = "Authorization")] string? jwt)
		{
			var b64Code = _getBase64Code(jwt);

			if (b64Code == null|| b64Code ==string.Empty) return BadRequest("Not Authorized");

			return Ok( new {b64Code});			
		}


		private string _getToken(User user)
		{
			using (var client = new HttpClient())
			{
				var endPoint = "https://services2.i-centrum.se/recruitment/auth";

				var credential = new User()
				{
					UserName = user.UserName,
					Password = user.Password,
				};

				var serData = JsonConvert.SerializeObject(credential);

				var payload = new StringContent(serData, Encoding.UTF8, "application/json");

				var getTokenObj = client.PostAsync(endPoint, payload).Result.Content.ReadAsStringAsync().Result;

				var desData = (JObject)JsonConvert.DeserializeObject(getTokenObj);

				var token = desData.SelectToken("token").Value<string>();

				if (token == null) return null;

				return token;
			}
		}


		private string _getBase64Code(string token)
		{
			using (var client = new HttpClient())
			{
				var endPoint = "https://services2.i-centrum.se/recruitment/profile/avatar";

				client.DefaultRequestHeaders.Add("Authorization", token);

				var getBase64CodeFromEndpoint = client.GetStringAsync(endPoint).Result;

				var desData = (JObject)JsonConvert.DeserializeObject(getBase64CodeFromEndpoint);

				var code64 = desData.SelectToken("data").Value<string>();

				return code64;
			}
		}		
	}
}
