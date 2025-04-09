
import React from "react";
import { Lyric } from "@/lib/localStorage";
import { Music } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface LyricCardProps {
  lyric: Lyric;
}

const LyricCard: React.FC<LyricCardProps> = ({ lyric }) => {
  // Format date to be more readable
  const formattedDate = new Date(lyric.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="lyric-card overflow-hidden">
      <div className="music-note-bg top-4 right-4">
        <Music size={24} className="text-primary/30" />
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl md:text-2xl">{lyric.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="lyric-content text-base text-muted-foreground">{lyric.content}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <p className="text-sm font-medium">By: {lyric.author}</p>
        <p className="text-xs text-muted-foreground">{formattedDate}</p>
      </CardFooter>
    </Card>
  );
};

export default LyricCard;
