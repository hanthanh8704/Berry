import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <Grid container spacing={3}>
      {/* Banner Section */}
      <Grid item xs={12}>
        <Paper
          elevation={0}
          sx={{
            backgroundImage: `url('/path/to/your/banner-image.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Typography variant="h3" gutterBottom>
            Bug tum lum
          </Typography>
          <Typography variant="body1" paragraph>
            This dashboard provides an overview of your orders. Use the navigation on the left to explore different sections.
          </Typography>
          <Box>
            <Button component={Link} to="/orders" variant="contained" color="primary">
              View Orders
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Main Content Section */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Xem tiếp
          </Typography>
          {/* Add your recent orders or other content here */}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
