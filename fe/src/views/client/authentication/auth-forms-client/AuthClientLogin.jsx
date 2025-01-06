import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthLogin = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [checked, setChecked] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Đăng nhập với địa chỉ Email</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Phải đúng là email').max(255).required('Email đang trống'),
                    password: Yup.string().max(255).required('Password đang trống')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        const response = await axios.post('http://localhost:8080/api/client/auth/login', {
                            email: values.email,
                            password: values.password
                        });

                        if (response.status === 200) {
                            const userData = response.data;
                            // Lưu thông tin đăng nhập vào localStorage
                            localStorage.setItem('isAuthenticated', 'true');
                            localStorage.setItem('userRole', userData.role);
                            localStorage.setItem('userRoleId', userData.roleId);
                            localStorage.setItem('userEmail', userData.email);
                            // Kiểm tra roleId, nếu là 3 thì từ chối đăng nhập
                            if (userData.roleId === 3) {
                                toast.error('Bạn không có quyền truy cập vào hệ thống client.');
                                setSubmitting(false);
                                return;
                            }



                            // Lưu thông tin khách hàng nếu có
                            if (userData.customerId) {
                                localStorage.setItem('customerId', userData.customerId);
                                localStorage.setItem('customerName', userData.customerName);
                                localStorage.setItem('customerEmail', userData.customerEmail);
                                localStorage.setItem('customerPhoneNumber', userData.customerPhoneNumber);
                            }

                            setStatus({ success: true });
                            setSubmitting(false);
                            toast.success('Đăng nhập thành công! Đang chuyển hướng đến trang chủ...');

                            setTimeout(() => {
                                navigate('/'); // Điều hướng sang trang chủ hoặc trang khác
                            }, 2000);
                        }
                    } catch (err) {

                        setStatus({ success: false });
                        // setErrors({ submit: err.response?.data || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.' });
                        setSubmitting(false);
                        toast.error(err.response?.data);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email"
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-password-login">Mật khẩu</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                                }
                                label="Ghi nhớ đăng nhập"
                            />
                        </Stack>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                                    Đăng nhập
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
            <ToastContainer />
        </>
    );
};

export default AuthLogin;
