// import { useSelector } from 'react-redux';
// import { RouterProvider } from 'react-router-dom';

// import { ThemeProvider } from '@mui/material/styles';
// import { CssBaseline, StyledEngineProvider } from '@mui/material';

// // routing
// import router from 'routes';

// // defaultTheme
// import themes from 'themes';

// // project imports
// import NavigationScroll from 'layout/NavigationScroll';

// // ==============================|| APP ||============================== //

// const App = () => {
//   const customization = useSelector((state) => state.customization);

//   return (
//     <StyledEngineProvider injectFirst>
//       <ThemeProvider theme={themes(customization)}>
//         <CssBaseline />
//         <NavigationScroll>
//           <RouterProvider router={router} />
//         </NavigationScroll>
//       </ThemeProvider>
//     </StyledEngineProvider>
//   );
// };

// export default App;


import { useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// Import các file cần thiết
import themes from 'themes'; // Nếu có

// project imports
import NavigationScroll from 'layout/NavigationScroll';

// Import router từ file routes
import { adminRouter, clientRouter } from 'routes';


// routing
import router from 'routes';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

  // Lựa chọn router dựa trên điều kiện, ví dụ dựa trên đường dẫn
  const selectedRouter = location.pathname.startsWith('/admin') ? adminRouter : clientRouter;
  

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}> {/* Sử dụng theme customization */}
        <CssBaseline />
        <NavigationScroll>
          <RouterProvider router={selectedRouter} /> {/* Sử dụng selectedRouter */}
        </NavigationScroll>
        <NavigationScroll>
          <RouterProvider router={router} />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
