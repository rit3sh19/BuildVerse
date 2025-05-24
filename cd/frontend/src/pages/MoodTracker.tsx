import { Box, Container, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

type MoodEntry = {
  date: string;
  mood: string;
  sentiment: number;
  notes: string;
};

const MoodTracker = () => {
  const auth = useAuth();
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch mood history when component mounts
    const fetchMoodHistory = async () => {
      try {
        const response = await fetch("/api/v1/mood/history", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setMoodHistory(data.moodHistory);
        }
      } catch (error) {
        console.error("Failed to fetch mood history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.isLoggedIn) {
      fetchMoodHistory();
    }
  }, [auth?.isLoggedIn]);

  const getAverageMood = () => {
    if (moodHistory.length === 0) return 0;
    const sum = moodHistory.reduce((acc, entry) => acc + entry.sentiment, 0);
    return (sum / moodHistory.length).toFixed(2);
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mood Tracker
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3 
        }}>
          {/* Overview Card */}
          <Box sx={{ 
            flex: { xs: '1', md: '0 0 300px' },
            width: '100%'
          }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <Typography>
                Average Mood: {getAverageMood()}
              </Typography>
              <Typography>
                Total Entries: {moodHistory.length}
              </Typography>
            </Paper>
          </Box>

          {/* Recent Moods */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Moods
              </Typography>
              {loading ? (
                <Typography>Loading...</Typography>
              ) : moodHistory.length === 0 ? (
                <Typography>No mood entries yet</Typography>
              ) : (
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {moodHistory.map((entry, index) => (
                    <Paper 
                      key={index} 
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        backgroundColor: entry.sentiment > 0.5 ? '#e8f5e9' : '#ffebee'
                      }}
                    >
                      <Typography variant="subtitle1">
                        Date: {new Date(entry.date).toLocaleDateString()}
                      </Typography>
                      <Typography>Mood: {entry.mood}</Typography>
                      <Typography>Sentiment: {entry.sentiment}</Typography>
                      <Typography>Notes: {entry.notes}</Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default MoodTracker; 