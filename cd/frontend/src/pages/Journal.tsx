import { Box, Button, Container, Paper, TextField, Typography, Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

type JournalEntry = {
  content: string;
  createdAt: string;
};

const Journal = () => {
  const auth = useAuth();
  const [content, setContent] = useState("");
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    // Fetch journal entries when component mounts
    const fetchJournals = async () => {
      try {
        const response = await fetch("/api/v1/journal/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setJournals(data.journals);
        } else {
          setFeedback({
            message: data.message || "Failed to fetch journals",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Failed to fetch journals:", error);
        setFeedback({
          message: "Failed to fetch journals",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (auth?.isLoggedIn) {
      fetchJournals();
    }
  }, [auth?.isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/v1/journal/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setJournals([data.journal, ...journals]);
        setContent(""); // Clear the input
        setFeedback({
          message: data.message || "Journal entry saved successfully",
          type: "success",
        });
      } else {
        setFeedback({
          message: data.message || "Failed to save journal entry",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to create journal entry:", error);
      setFeedback({
        message: "Failed to save journal entry",
        type: "error",
      });
    }
  };

  const handleCloseFeedback = () => {
    setFeedback(null);
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Journal
        </Typography>

        {/* Journal Entry Form */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Write your journal entry here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!content.trim()}
            >
              Save Entry
            </Button>
          </form>
        </Paper>

        {/* Journal Entries List */}
        <Typography variant="h6" gutterBottom>
          Previous Entries
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : journals.length === 0 ? (
          <Typography>No journal entries yet</Typography>
        ) : (
          <Box sx={{ maxHeight: 600, overflow: "auto" }}>
            {journals.map((entry, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {entry.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(entry.createdAt).toLocaleString()}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}

        {/* Feedback Snackbar */}
        <Snackbar
          open={!!feedback}
          autoHideDuration={6000}
          onClose={handleCloseFeedback}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseFeedback}
            severity={feedback?.type}
            sx={{ width: "100%" }}
          >
            {feedback?.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Journal; 