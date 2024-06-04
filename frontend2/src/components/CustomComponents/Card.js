import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, styled, CardActionArea, CardMedia } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme, variant }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    boxShadow: theme.shadows[6],
    backgroundColor: theme.palette.action.hover,
  },
  outline: 'none',
  '&:focus-within': {
    outline: `3px solid ${theme.palette.primary.main}`,
    boxShadow: `0 0 5px ${theme.palette.primary.main}`,
  },
  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette.grey[400]}`,
  }),
...(variant === 'default' && {
    border: `1px solid ${theme.palette.grey[300]}`,
}),
...(variant === 'elevation' && {
    border: `1px solid ${theme.palette.grey[200]}`,
}),
}));

function CustomCard({ title, content, image, variant = 'default', sx, ...props }) {
  const theme = useTheme();

  return (
    <StyledCard theme={theme} variant={variant} sx={sx} {...props}>
      <CardActionArea>
        {image && (
          <CardMedia
            component="img"
            height="140"
            image={image}
            alt={title}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {content}
          </Typography>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
}

CustomCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  image: PropTypes.string, // Make image prop optional
  variant: PropTypes.oneOf(['default', 'outlined']), // Allow different variants
  sx: PropTypes.object,
};

export default CustomCard;
