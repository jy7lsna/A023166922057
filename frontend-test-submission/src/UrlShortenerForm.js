import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { Log } from "./log";

const SHORTENED_URL_PREFIX = "http://short.ly/";

function generateShortcode(preferred, existing) {
  if (
    preferred &&
    /^[a-zA-Z0-9_-]{4,16}$/.test(preferred) &&
    !existing.includes(preferred)
  ) {
    return preferred;
  }
  let code;
  do {
    code = Math.random().toString(36).substring(2, 8);
  } while (existing.includes(code));
  return code;
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function UrlShortenerForm() {
  const [urls, setUrls] = useState([""]);
  const [expiry, setExpiry] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Load existing short URLs from localStorage
  const getStoredShortened = () => {
    return JSON.parse(localStorage.getItem("shortenedUrls") || "[]");
  };

  const saveShortened = (data) => {
    localStorage.setItem("shortenedUrls", JSON.stringify(data));
  };

  const handleUrlChange = (idx, value) => {
    const newUrls = [...urls];
    newUrls[idx] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    if (urls.length < 5) setUrls([...urls, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // Validation
    const validUrls = urls.filter((u) => u.trim() !== "");
    if (validUrls.length === 0) {
      setError("Please enter at least one URL.");
      await Log("frontend", "error", "form", "No URLs entered");
      return;
    }
    for (let url of validUrls) {
      if (!isValidUrl(url)) {
        setError(`Invalid URL: ${url}`);
        await Log("frontend", "error", "form", `Invalid URL: ${url}`);
        return;
      }
    }
    if (expiry && (!/^[0-9]+$/.test(expiry) || parseInt(expiry) <= 0)) {
      setError("Expiry must be a positive integer (minutes).");
      await Log("frontend", "error", "form", "Invalid expiry value");
      return;
    }

    // Shorten logic
    const existing = getStoredShortened().map((s) => s.shortcode);
    const newShortened = validUrls.map((url, idx) => {
      const code = generateShortcode(
        idx === 0 ? shortcode : undefined,
        existing
      );
      existing.push(code);
      return {
        original: url,
        shortcode: code,
        shortUrl: SHORTENED_URL_PREFIX + code,
        createdAt: new Date().toISOString(),
        expiry: expiry ? parseInt(expiry) : 30, // default 30 min
      };
    });
    const allShortened = [...getStoredShortened(), ...newShortened];
    saveShortened(allShortened);
    setResult(newShortened);
    await Log(
      "frontend",
      "info",
      "api",
      `Shortened ${newShortened.length} URL(s)`
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6">Shorten up to 5 URLs</Typography>
      {urls.map((url, idx) => (
        <TextField
          key={idx}
          label={`URL ${idx + 1}`}
          value={url}
          onChange={(e) => handleUrlChange(idx, e.target.value)}
          fullWidth
          margin="normal"
        />
      ))}
      {urls.length < 5 && (
        <Button onClick={addUrlField} variant="outlined" sx={{ mb: 2 }}>
          Add another URL
        </Button>
      )}
      <TextField
        label="Expiry (minutes, optional)"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Preferred Shortcode (optional, for first URL)"
        value={shortcode}
        onChange={(e) => setShortcode(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Shorten URLs
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {result && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Shortened URLs:</Typography>
          {result.map((r, i) => (
            <Box key={i} sx={{ mb: 1 }}>
              <Typography>Original: {r.original}</Typography>
              <Typography>
                Short:{" "}
                <a href={r.shortUrl} target="_blank" rel="noopener noreferrer">
                  {r.shortUrl}
                </a>
              </Typography>
              <Typography>Expiry: {r.expiry} min</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
