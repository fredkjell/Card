
import React, { useEffect, useState } from "react";
import { getLyrics, Lyric } from "@/lib/localStorage";
import LyricCard from "@/components/LyricCard";
import NewLyricForm from "@/components/NewLyricForm";
import Header from "@/components/Header";
import { Music } from "lucide-react";
import { AuthProvider } from "@/contexts/AuthContext";

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
    <AuthProvider>
      <div className="page-gradient min-h-screen pb-20">
        <Header />

        <main className="container mx-auto px-4 py-4">
          {lyrics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lyrics.map((lyric) => (
                <LyricCard 
                  key={lyric.id} 
                  lyric={lyric} 
                  onDelete={loadLyrics}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-background/50 rounded-lg border border-border shadow-sm">
              <Music size={64} className="mx-auto text-primary/50 mb-4" />
              <h2 className="text-2xl font-medium mb-3">No Lyrics Yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Be the first to add your creative lyrics! Click the + button to get started.
              </p>
            </div>
          )}
        </main>

        <NewLyricForm onLyricAdded={loadLyrics} />
      </div>
    </AuthProvider>
  );
};

export default Index;
