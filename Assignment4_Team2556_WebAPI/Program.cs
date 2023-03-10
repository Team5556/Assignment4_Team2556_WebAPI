using Assignment4_Team2556_WebAPI.Data;
using Assignment4_Team2556_WebAPI.Data.Repositories;
using Assignment4_Team2556_WebAPI.Models;
using Assignment4_Team2556_WebAPI.Security;
using Assignment4_Team2556_WebAPI.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace Assignment4_Team2556_WebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //Candidate candidate = new Candidate();
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            //builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));
            builder.Services.AddRazorPages();
            builder.Services.AddAutoMapper(typeof(Program));

            builder.Services.AddScoped<ICandidateExamService, CandidateExamService>();
            builder.Services.AddScoped<ICandidateExamRepository, CandidateExamRepository>();
            builder.Services.AddScoped<ICandidateExamAnswerService, CandidateExamAnswerService>();
            builder.Services.AddScoped<ICandidateExamAnswerRepository, CandidateExamAnswerRepository>();

            builder.Services.AddScoped<IGenericRepository<Option>, OptionsRepository>();
            builder.Services.AddScoped<IOptionsService, OptionsService>();
            builder.Services.AddScoped<IGenericRepository<Question>, QuestionsRepository>();
            builder.Services.AddScoped<IGenericRepository<CandidateCertificate>, CandidateCertificateRepository>();
            builder.Services.AddScoped<ICandidateCertificateService, CandidateCertificateService>();
            builder.Services.AddScoped<IQuestionsService, QuestionsService>();
            builder.Services.AddScoped<IGenericRepository<Topic>, TopicsRepository>();
            builder.Services.AddScoped<ITopicsService, TopicsService>();
            builder.Services.AddScoped<IGenericRepository<Certificate>, CertificateRepository>();
            builder.Services.AddScoped<ICertificateService, CertificateService>();
            builder.Services.AddScoped<IGenericService<Voucher>, VouchersService>();
            builder.Services.AddScoped<IGenericRepository<Voucher>, VouchersRepository>();
            builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
            builder.Services.AddScoped<ICandidateRepository, CandidateRepository>();
            builder.Services.AddScoped<ICandidateService, CandidateService>();            
            builder.Services.AddScoped<IGenericRepository<Exam>, ExamRepository>();
            builder.Services.AddScoped<IGenericService<Exam>, ExamService>();


            builder.Services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder =>
                builder.WithOrigins("http://localhost:3000")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());
            });



            builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie();
            builder.Services.ConfigureIdentity();
            builder.Services.ConfigureJWT(builder.Configuration);

            builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
            //builder.Services.AddControllers();



            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();

            app.UseCors("CorsPolicy");
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
            app.MapRazorPages();

            app.Run();
        }
    }
}