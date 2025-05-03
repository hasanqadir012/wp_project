namespace MyWebsite.Services
{
    public class EncryptionService : IEncryption
    {
        public string Encrypt(string input)
        {
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(input));
        }

        public string Decrypt(string input)
        {
            return System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(input));
        }
    }
}
