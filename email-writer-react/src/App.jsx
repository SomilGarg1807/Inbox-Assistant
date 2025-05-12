import { Box, CircularProgress, Container, FormControl, InputLabel, Snackbar, Typography } from '@mui/material';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert'; // Add this for better styling
import './App.css'
import axios from 'axios';

// Optional: Create an Alert component for Snackbar
const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('An error occurred while generating the reply. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant='h3' component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label="Original Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone(Optional)</InputLabel>
          <Select
            value={tone || ''}
            label="Tone(Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Formal">Formal</MenuItem>
            <MenuItem value="Concise">Concise</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
        </Button>
      </Box>

      {error && (
        <Typography color='error' sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {generatedReply && (
        <Box sx={{ mt: 3 }}>
          <Typography variant='h6' gutterBottom>
            Generated Reply:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={generatedReply || ''}
            inputProps={{ readOnly: true }}
          />

          <Button
            variant='outlined'
            sx={{ mt: 2 }}
            onClick={handleCopy}
          >
            Copy to Clipboard
          </Button>
        </Box>
      )}

      {/* Snackbar Component */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={800}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default App;