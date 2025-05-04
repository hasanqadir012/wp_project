import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <div className="grid gap-4">
        <p>Have questions or need assistance? Get in touch with us:</p>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="font-medium">Name</label>
            <Input 
              id="name" 
              className="mt-1" 
              required 
            />
          </div>
          <div>
            <label htmlFor="email" className="font-medium">Email</label>
            <Input 
              id="email" 
              type="email" 
              className="mt-1" 
              required 
            />
          </div>
          <div>
            <label htmlFor="message" className="font-medium">Message</label>
            <Textarea 
              id="message" 
              rows={4}
              className="mt-1" 
              required 
            />
          </div>
          <Button 
            type="submit"
            variant="primary"
            className="px-6 py-2"
          >
            Send Message
          </Button>
        </form>
      </div>
    </main>
  );
}
