
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addLyric, validatePassword } from "@/lib/localStorage";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { LockKeyhole, Plus } from "lucide-react";

interface NewLyricFormProps {
  onLyricAdded: () => void;
}

const NewLyricForm: React.FC<NewLyricFormProps> = ({ onLyricAdded }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const verifyPassword = () => {
    if (validatePassword(password)) {
      setIsPasswordVerified(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !author.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      addLyric({ title, content, author });
      
      toast({
        title: "Lyrics added!",
        description: "Your lyrics have been successfully added",
      });
      
      // Reset form
      setTitle("");
      setContent("");
      setAuthor("");
      setIsPasswordVerified(false);
      setPassword("");
      
      // Notify parent component
      onLyricAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add lyrics. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg z-10">
          <Plus size={24} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        {!isPasswordVerified ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LockKeyhole size={18} />
                Password Required
              </DialogTitle>
              <DialogDescription>
                You need a password to add new lyrics to the collection.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the site password"
                className="mt-1"
              />
              {passwordError && (
                <p className="text-destructive text-sm mt-1">{passwordError}</p>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={verifyPassword}>Verify Password</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Lyrics</DialogTitle>
              <DialogDescription>
                Create and share your song lyrics with the community.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Song Title</Label>
                <Input 
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter song title"
                  maxLength={100}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Lyrics</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your lyrics here..."
                  className="min-h-[150px]"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="author">Your Name</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={50}
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Lyrics</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewLyricForm;
