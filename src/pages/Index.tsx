
import React, { useEffect, useState } from "react";
import { getLyrics, Lyric } from "@/lib/localStorage";
import LyricCard from "@/components/LyricCard";
import NewLyricForm from "@/components/NewLyricForm";
import { Music, MusicIcon } from "lucide-react";

const Index = () => {
  const [lyrics, setLyrics] = useState<Lyric[]>([]);

  useEffect(() => {
    loadLyrics();
  }, []);

  const loadLyrics = () => {
    const storedLyrics = getLyrics();
    setLyrics(storedLyrics);
  };

  return (
    <div className="page-gradient min-h-screen pb-20">
      <header className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MusicIcon size={32} className="text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Lyric Locker
          </h1>
        </div>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Create and share your song lyrics with the world. Add your own creative lyrics by clicking the + button.
          <span className="block mt-1 text-sm text-primary">Click on any card to view the full lyrics!</span>
        </p>
      </header>

      <main className="container mx-auto px-4">
        {lyrics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lyrics.map((lyric) => (
              <LyricCard key={lyric.id} lyric={lyric} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-background/50 rounded-lg border border-border">
            <Music size={48} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No Lyrics Yet</h2>
            <p className="text-muted-foreground mb-4">
              Be the first to add your creative lyrics!
            </p>
          </div>
        )}
      </main>

      <NewLyricForm onLyricAdded={loadLyrics} />
    </div>
  );
};

export default Index;
