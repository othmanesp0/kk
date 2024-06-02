import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, RadioGroup, FormControlLabel, Radio, Alert, Typography, Avatar, Box, Card, CardContent, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Comment from './Comment';
import CommentList from './CommentList';
import CustomButton from './CustomButton';  // Assuming it's in the same directory

function ForumPost({ post, user }) {
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [openLikeDialog, setOpenLikeDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [likeStatus, setLikeStatus] = useState(false);

  const handleClickOpen = () => {
    setOpenReportDialog(true);
    setReportSuccess(false);
    setReportError(null);
  };

  const handleClose = () => {
    setOpenReportDialog(false);
    setSelectedReason('');
  };

  const handleLikeClose = () => {
    setOpenLikeDialog(false);
  };

  const handleReportPost = async () => {
    try {
      const response = await axios.post('/api/moderate/', {
        post: post.id,
        reason: selectedReason,
      });
      setReportSuccess(true);
      setReportError(null);
      setSelectedReason('');
      setOpenReportDialog(false);
      console.log('Post reported successfully:', response.data);
    } catch (error) {
      setReportSuccess(false);
      setReportError(error.response?.data?.detail || 'Failed to submit the report. Please try again.');
      console.error('Error reporting post:', error);
    }
  };

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
    setReportError(null);
  };

  const handleLikePost = () => {
    setLikeStatus(!likeStatus);  // Toggle like status
    setOpenLikeDialog(true);     // Show feedback dialog
  };

  const isReportButtonDisabled = !selectedReason;
  const isInstructorOrSupervisor = ['instructor', 'supervisor'].includes(user.role);

  return (
    <div>
      <Card sx={{ boxShadow: 3, '&:hover': { boxShadow: 6 }, mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={post.authorAvatar || 'path/to/placeholder.jpg'} alt={post.authorName} sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h6" component="div">
                {post.title}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                by {post.authorUsername} {formatDistanceToNow(new Date(post.createdAt))} ago
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" component="p">
            {post.content.length > 100 ? `${post.content.slice(0, 100)}...` : post.content}
          </Typography>
          {post.content.length > 100 && (
            <Link to={`/posts/${post.id}`}>
              <Button size="small">Read More</Button>
            </Link>
          )}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Link to={`/posts/${post.id}`} component={Button} variant="text" color="primary">
              View Comments
            </Link>
            <CustomButton onClick={handleLikePost} variant="text" color={likeStatus ? "secondary" : "primary"} startIcon={<ThumbUpIcon />}>
              {likeStatus ? 'Unlike' : 'Like'}
            </CustomButton>
            {!isInstructorOrSupervisor && (
              <CustomButton
                onClick={handleClickOpen}
                variant="outlined"
                color="error"
                sx={{
                  '&:hover': {
                    backgroundColor: '#ffebee',
                  },
                  '&:focus': {
                    outline: '2px solid #f44336',
                  },
                }}
                aria-label="Report Post"
              >
                Report
              </CustomButton>
            )}
            {isInstructorOrSupervisor && (
              <CustomButton onClick={() => { /* Handle delete functionality */ }} variant="text" color="error">
                Delete
              </CustomButton>
            )}
          </Box>
          <Comment postId={post.id} />
          <CommentList postId={post.id} />
        </CardContent>
      </Card>

      {/* Report Dialog */}
      <Dialog open={openReportDialog} onClose={handleClose}>
        <DialogTitle>Report Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select a reason for reporting this post:
          </DialogContentText>
          <RadioGroup value={selectedReason} onChange={handleReasonChange}>
            <FormControlLabel value="spam" control={<Radio />} label="Spam" />
            <FormControlLabel value="offensive" control={<Radio />} label="Offensive Content" />
            <FormControlLabel value="irrelevant" control={<Radio />} label="Irrelevant" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
          {reportSuccess && (
            <Alert severity="success">
              Report submitted successfully for the post: "{post.content.slice(0, 30)}..." with reason: "{selectedReason}".
            </Alert>
          )}
          {reportError && (
            <Alert severity="error">
              {reportError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" aria-label={reportSuccess ? 'Close' : 'Cancel'}>
            {reportSuccess ? 'Close' : 'Cancel'}
          </Button>
          {!reportSuccess && (
            <Button onClick={handleReportPost} variant="contained" color="error" disabled={isReportButtonDisabled} aria-label="Submit Report">
              Report
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Like Feedback Dialog */}
      <Dialog open={openLikeDialog} onClose={handleLikeClose}>
        <DialogTitle>{likeStatus ? 'Liked!' : 'Unliked!'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have {likeStatus ? 'liked' : 'unliked'} this post.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLikeClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ForumPost;
