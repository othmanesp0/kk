import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Typography, Link, styled } from '@mui/material';
import logo from '../../assets/logo.png'; // Adjust the path to your logo

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3, 0),
}));

function CustomFooter({ appName = 'MyApp', slogan = 'Enhancing Learning Experiences' }) {
  return (
    <StyledBox>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
          <img src={logo} alt="logo" style={{ width: '50px', marginRight: '10px' }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {appName}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}{' '}
          <Link color="inherit" href="/">
            {appName}
          </Link>{' '}
          . All rights reserved.
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
          {slogan}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
          {/* ...existing links */}
        </Box>
      </Container>
    </StyledBox>
  );
}

CustomFooter.propTypes = {
  appName: PropTypes.string,
  slogan: PropTypes.string,
};

export default CustomFooter;