using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var key = Encoding.ASCII.GetBytes("SUA_CHAVE_SECRETA_SUPER_SEGURA_2024_WEATHERAPP");

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors("AllowLocalhost");
app.UseAuthentication();
app.UseAuthorization();

// In-memory database de usuários (em produção, use um banco de dados real)
var users = new Dictionary<string, User>();

// Helper para gerar hash de senha simples (em produção, use BCrypt)
string HashPassword(string password) => Convert.ToBase64String(Encoding.UTF8.GetBytes(password));

// ============= ENDPOINTS DE AUTENTICAÇÃO =============
app.MapPost("/api/auth/register", (RegisterRequest req) =>
{
    if (users.Values.Any(u => u.Email == req.Email || u.Username == req.Username))
        return Results.BadRequest("Usuário ou email já existe");

    var user = new User { Id = Guid.NewGuid().ToString(), Email = req.Email, Username = req.Username, PasswordHash = HashPassword(req.Password) };
    users[user.Username] = user;
    return Results.Ok(new { message = "Usuário registrado com sucesso" });
});

app.MapPost("/api/auth/login", (LoginRequest req) =>
{
    if (!users.TryGetValue(req.Username, out var user) || user.PasswordHash != HashPassword(req.Password))
        return Results.Unauthorized();

    var tokenHandler = new JwtSecurityTokenHandler();
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email)
        }),
        Expires = DateTime.UtcNow.AddHours(24),
        SigningCredentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256Signature)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    var tokenString = tokenHandler.WriteToken(token);

    return Results.Ok(new AuthResponse { Token = tokenString, Username = user.Username, Email = user.Email });
});

// ============= ENDPOINTS DE WEATHER (PROTEGIDOS) =============
app.MapGet("/api/weather/search/{city}", (string city) =>
{
    // Dados fictícios - em produção, chamar a API real do weatherapi.com
    var random = new Random();
    var mockData = new WeatherResponse
    {
        City = city,
        Temperature = random.NextDouble() * 35,
        Condition = "Ensolarado",
        ConditionIcon = "https://cdn.weatherapi.com/weather/128x128/day/113.png",
        Humidity = random.NextDouble() * 100,
        WindSpeed = random.NextDouble() * 30,
        FeelsLike = random.NextDouble() * 35,
        UvIndex = random.Next(0, 11),
        Visibility = 10.0,
        Pressure = 1013.0,
        LastUpdated = DateTime.Now.ToString("yyyy-MM-dd HH:mm")
    };
    return Results.Ok(mockData);
}).RequireAuthorization();

app.MapGet("/api/weather/forecast/{city}", (string city) =>
{
    var forecast = Enumerable.Range(1, 7).Select(i => new
    {
        day = DateTime.Now.AddDays(i).ToString("yyyy-MM-dd"),
        maxTemp = 25 + i,
        minTemp = 15 + i,
        condition = "Parcialmente Nublado",
        icon = "https://cdn.weatherapi.com/weather/128x128/day/116.png"
    }).ToList();

    return Results.Ok(new { city, forecast });
}).RequireAuthorization();

app.MapGet("/api/weather/details/{city}", (string city) =>
{
    var details = new
    {
        city = city,
        currentTemp = 28.5,
        feelsLike = 30.2,
        tempMin = 22.1,
        tempMax = 32.3,
        humidity = 65,
        windSpeed = 12.5,
        windGust = 18.3,
        windDirection = "NE",
        pressure = 1013,
        visibility = 10,
        uvIndex = 8,
        dewPoint = 20.5,
        cloudCover = 45,
        precipitationChance = 10,
        precipitationAmount = 0,
        lastUpdated = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
    };
    return Results.Ok(details);
}).RequireAuthorization();

app.MapGet("/api/weather/alerts/{city}", (string city) =>
{
    var alerts = new List<object>
    {
        new { severity = "low", title = "Vento Moderado", description = "Esperado vento moderado nos próximos dias" }
    };
    return Results.Ok(new { city, alerts });
}).RequireAuthorization();

app.Run();

// ============= MODELOS =============
class User
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
}

class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

class RegisterRequest
{
    public string Email { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
}

class AuthResponse
{
    public string Token { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
}

class WeatherResponse
{
    public string City { get; set; }
    public double Temperature { get; set; }
    public string Condition { get; set; }
    public string ConditionIcon { get; set; }
    public double Humidity { get; set; }
    public double WindSpeed { get; set; }
    public double FeelsLike { get; set; }
    public int UvIndex { get; set; }
    public double Visibility { get; set; }
    public double Pressure { get; set; }
    public string LastUpdated { get; set; }
}