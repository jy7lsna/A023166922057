import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

function getShortenedUrls() {
  return JSON.parse(localStorage.getItem("shortenedUrls") || "[]");
}

function getClicks() {
  return JSON.parse(localStorage.getItem("urlClicks") || "{}");
}

export default function UrlStats() {
  const [urls, setUrls] = useState([]);
  const [clicks, setClicks] = useState({});

  useEffect(() => {
    setUrls(getShortenedUrls());
    setClicks(getClicks());
  }, []);

  // Simulate a click for demo
  const handleSimulateClick = (shortcode) => {
    const now = new Date().toISOString();
    const allClicks = { ...getClicks() };
    if (!allClicks[shortcode]) allClicks[shortcode] = [];
    allClicks[shortcode].push({
      timestamp: now,
      origin: window.location.origin,
      location: "IN",
    });
    localStorage.setItem("urlClicks", JSON.stringify(allClicks));
    setClicks(allClicks);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Shortener Statistics</Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Expiry (min)</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Simulate Click</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url) => (
              <TableRow key={url.shortcode}>
                <TableCell>
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {url.shortUrl}
                  </a>
                </TableCell>
                <TableCell>{url.original}</TableCell>
                <TableCell>
                  {new Date(url.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{url.expiry}</TableCell>
                <TableCell>{(clicks[url.shortcode] || []).length}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleSimulateClick(url.shortcode)}
                  >
                    Simulate Click
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
