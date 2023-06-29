using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using Newtonsoft.Json.Linq;

namespace BackEnd.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	
	public class UserController : ControllerBase
	{
		[HttpPost("authenticate")]
		public async Task<IActionResult> Authenticate([FromBody] User postData)
		{			
			
			var token = GetToken(postData);

			return Ok(new
			{
				Token = token,
			});			
		}	
		
		private string GetToken(User user)
		{
			using (var client = new HttpClient())
			{
				var endpoint = "https://services2.i-centrum.se/recruitment/auth";

				var post = new User()
				{
					UserName = user.UserName,
					Password = user.Password,
				};

				var postJson = JsonConvert.SerializeObject(post);

				var payload = new StringContent(postJson, Encoding.UTF8, "application/json");

				var result = client.PostAsync(endpoint, payload).Result.Content.ReadAsStringAsync().Result;

				var desData = (JObject)JsonConvert.DeserializeObject(result);

				var token = desData.SelectToken("token").Value<string>();

				return token;
			}
		}
	}
}
