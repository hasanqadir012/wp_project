namespace backend.Services
{
    public interface IEncryption
    {
        string Encrypt(string input);
        string Decrypt(string input);
    }
}
