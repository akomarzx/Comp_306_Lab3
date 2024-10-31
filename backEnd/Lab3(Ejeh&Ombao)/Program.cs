using Amazon.DynamoDBv2;
using Amazon.Runtime;
using Amazon.S3;
using Amazon;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


namespace Lab3_Ejeh_Ombao_
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllersWithViews();

            // Add AWS options from configuration
            var awsOptions = builder.Configuration.GetAWSOptions();

            // Configure credentials
            builder.Services.AddSingleton<IAmazonDynamoDB>(sp => new AmazonDynamoDBClient(
                new BasicAWSCredentials(
                    builder.Configuration["AWS:AccessKey"],
                    builder.Configuration["AWS:SecretKey"]
                ),
                RegionEndpoint.GetBySystemName(builder.Configuration["AWS:Region"])
            ));

            builder.Services.AddSingleton<IAmazonS3>(sp => new AmazonS3Client(
                new BasicAWSCredentials(
                    builder.Configuration["AWS:AccessKey"],
                    builder.Configuration["AWS:SecretKey"]
                ),
                RegionEndpoint.GetBySystemName(builder.Configuration["AWS:Region"])
            ));
            builder.Services.AddScoped<MovieRepository>();
            builder.Services.AddScoped<S3Service>();
            // Configure services
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // Add CORS policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins", policy =>
                    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });

            builder.Services.AddControllers();

            var app = builder.Build();

            // Configure middleware
            app.UseCors("AllowAllOrigins");

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
