using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using Newtonsoft.Json.Linq;
using System;
using System.Web;




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

			var token = GetToken(postData);

			 _contextAccessor.HttpContext.Session.SetString("token", token);


			return Ok(new
			{
				Token = token,
			});
		}

		[HttpGet("image")]
		public async Task<IActionResult> Image()
		{
			string getData =  getImage();


			if (getData != null)
			{
				return Ok(getData);
			}

			else
			{
				return BadRequest();
			}
				

		}


		private string GetToken(User user)
		{
			using (var client = new HttpClient())
			{
				var endPoint = "https://services2.i-centrum.se/recruitment/auth";

				var post = new User()
				{
					UserName = user.UserName,
					Password = user.Password,
				};

				var postJson = JsonConvert.SerializeObject(post);

				var payload = new StringContent(postJson, Encoding.UTF8, "application/json");

				var result = client.PostAsync(endPoint, payload).Result.Content.ReadAsStringAsync().Result;

				var desData = (JObject)JsonConvert.DeserializeObject(result);

				var token = desData.SelectToken("token").Value<string>();

				return token;
			}
		}



		private string getImage()
		{
			using (var client = new HttpClient())
			{
				var endPoint = "https://services2.i-centrum.se/recruitment/profile/avatar";

				var token = _contextAccessor.HttpContext.Session.GetString("token");

				client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
				var response = client.GetStringAsync(endPoint).Result;

				var desData = (JObject)JsonConvert.DeserializeObject(response);

				var code64 = desData.SelectToken("data").Value<string>();

				var image = spliteText(code64);

				return image;
			}

		}

		private string spliteText(string base64Code)
		{
			string input = base64Code;
			int index = input.IndexOf("//");
			if (index >= 0)
				input = input.Substring(0, index);

			return input;
		}

		//public Image Base64ToImage(string base64String)
		//{


		//	// Remove the data URI scheme prefix if present
		//	if (base64String.StartsWith("data:image"))
		//	{
		//		base64String = base64String.Substring(base64String.IndexOf(',') + 1);
		//	}

		//	// Convert the Base64 string to bytes
		//	byte[] imageBytes = Convert.FromBase64String(base64String);

		//	// Create a memory stream from the byte array
		//	using (MemoryStream ms = new MemoryStream(imageBytes))
		//	{
		//		// Create an Image object from the memory stream
		//		System.Drawing.Image image = System.Drawing.Image.FromStream(ms);

		//		// Save the image to a file (optional)
		//		image.Save("output.png", System.Drawing.Imaging.ImageFormat.Png);

		//		// Display image or perform further operations
		//	}
		//}


		//private void SaveByteArrayAsImage(string fullOutputPath, string base64String)
		//{
		//	byte[] bytes = Convert.FromBase64String(base64String);

		//	Image image;
		//	using (MemoryStream ms = new MemoryStream(bytes))
		//	{
		//		image = Image.FromStream(ms);
		//	}

		//	image.Save(fullOutputPath, System.Drawing.Imaging.ImageFormat.Png);
		//}

		public void SaveTokenInCookie(string token)
		{
			string tokenn = "your_token_here";

			// Save the token to the session variable
			HttpContext.Request.Session["Token"] = token;
			// Create a new cookie
			//HttpCookie cookie = new HttpCookie("Token");

			//// Set the value of the cookie to the token
			//cookie.Value = token;

			//// Set the expiration date of the cookie (optional)
			//cookie.Expires = DateTime.Now.AddDays(7); // Expires in 7 days

			//// Add the cookie to the response
			//HttpContext.Current.Response.Cookies.Add(cookie);
		}
	}
}
