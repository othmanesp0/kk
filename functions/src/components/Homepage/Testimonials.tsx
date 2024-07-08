import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Grid, styled } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Testimonial } from '../../interfaces/types';

interface TestimonialProps {
  testimonials: Testimonial[];
  onTestimonialClick: (id: number) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: 16,
  marginBottom: 16,
  boxShadow: theme.shadows[3],
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const Testimonials: React.FC<TestimonialProps> = ({ testimonials, onTestimonialClick }) => {
  return (
    <Box sx={{ padding: 4, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h4" gutterBottom>
        What Our Students Say
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} sm={6} md={4} key={testimonial.id}>
            <StyledCard onClick={() => onTestimonialClick(testimonial.id)}>
              <Avatar sx={{ marginRight: 2 }}>
                <PersonIcon />
              </Avatar>
              <CardContent>
                <Typography variant="h6" gutterBottom>{testimonial.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {testimonial.text}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Testimonials;
