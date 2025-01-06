import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthRegister = ({ ...others }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const customization = useSelector((state) => state.customization);
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    return (
        <>
            <ToastContainer />

            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Đăng ký tài khoản mới</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    email: '',
                    phoneNumber: '',
                    password: '',
                    customerName: '', // Thêm customerName vào initialValues
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .email('Email không hợp lệ')
                        .matches(
                            /^[a-zA-Z0-9._%+-]+@(gmail\.com|fpt\.edu\.vn)$/,
                            'Email phải có đuôi @gmail.com hoặc @fpt.edu.vn'
                        )
                        .required('Email là bắt buộc'),
                    phoneNumber: Yup.string()
                        .matches(/^0[0-9]{9,10}$/, 'Số điện thoại phải bắt đầu bằng số 0 và có từ 10 đến 11 chữ số')
                        .required('Số điện thoại là bắt buộc'),
                    password: Yup.string()
                        .required('Mật khẩu là bắt buộc')
                        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
                        .matches(
                            /^[A-Z]/,
                            'Mật khẩu phải bắt đầu bằng chữ cái viết hoa'
                        )
                        .matches(
                            /[^a-zA-Z0-9]/,
                            'Mật khẩu phải chứa ít nhất một ký tự đặc biệt'
                        ),
                    customerName: Yup.string()
                        .max(255, 'Tên khách hàng không được vượt quá 255 ký tự')
                        .required('Tên khách hàng là bắt buộc')
                })}

                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        const response = await axios.post('http://localhost:8080/api/client/auth/register', {
                            email: values.email,
                            password: values.password,
                            phoneNumber: values.phoneNumber,
                            customerName: values.customerName // Gửi thêm customerName
                        });

                        if (response.data) {
                            setStatus({ success: true });
                            toast.success('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');

                            setTimeout(() => {
                                navigate('/login'); // Đổi hướng sang trang đăng nhập
                            }, 2000);
                        } else {
                            setStatus({ success: false });
                            // setErrors({ submit: err.response?.data || 'Có lỗi xảy ra, vui lòng thử lại.' });
                            toast.error(err.response?.data);
                        }
                    } catch (err) {
                        // Kiểm tra mã lỗi trả về từ server
                        if (err.response?.status === 409) { // 409 Conflict
                            setErrors({ submit: 'Email, số điện thoại hoặc tên khách hàng đã tồn tại.' });
                            toast.error('Đăng ký thất bại! Email, số điện thoại hoặc tên khách hàng đã tồn tại.');
                        } else {
                            // setErrors({ submit: err.response?.data || 'Có lỗi xảy ra, vui lòng thử lại.' });
                            toast.error(err.response?.data);
                        }
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.customerName && errors.customerName)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-customerName">Tên khách hàng</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-customerName"
                                type="text"
                                value={values.customerName}
                                name="customerName"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Tên khách hàng"
                            />
                            {touched.customerName && errors.customerName && (
                                <FormHelperText error id="standard-weight-helper-text-customerName">
                                    {errors.customerName}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email"
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.phoneNumber && errors.phoneNumber)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-phoneNumber">Số điện thoại</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-phoneNumber"
                                type="text"
                                value={values.phoneNumber}
                                name="phoneNumber"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Số điện thoại"
                            />
                            {touched.phoneNumber && errors.phoneNumber && (
                                <FormHelperText error id="standard-weight-helper-text-phoneNumber">
                                    {errors.phoneNumber}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Mật khẩu"
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Đăng ký
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthRegister;
