﻿using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Amazon.Util.Internal;

namespace Lab3_Ejeh_Ombao_
{
    public class S3Service
    {
        private readonly IAmazonS3 _s3Client;

        public S3Service(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        public async Task<bool> DeleteFileAsync(string fileName)
        {
            try
            {
                var deleteObjectRequest = new DeleteObjectRequest
                {
                    BucketName = "lab3-ejeh-ombao",
                    Key = fileName
                };

                await _s3Client.DeleteObjectAsync(deleteObjectRequest);
                return true;
            }
            catch (Exception ex)
            {
                // Log the exception as needed
                Console.WriteLine($"Error deleting file: {ex.Message}");
                return false;
            }
        }

        public async Task<Stream> DownloadFileAsync(string name)
        {
            var request = new GetObjectRequest
            {
                BucketName = "lab3-ejeh-ombao",
                Key = name
            };

            var response = await _s3Client.GetObjectAsync(request);

            // Return the response stream
            return response.ResponseStream;
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            var fileTransferUtility = new TransferUtility(_s3Client);
            string fileName = $"{DateTime.Now.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss")}_{Guid.NewGuid()}";
            var memoryStream = new MemoryStream();

            await file.CopyToAsync(memoryStream);

            // Upload the file to the specified S3 bucket
            await fileTransferUtility.UploadAsync(memoryStream, "lab3-ejeh-ombao", fileName);

            // Return the URL of the uploaded file
            return $"https://lab3-ejeh-ombao.s3.amazonaws.com/{fileName}";
        }
    }
}
