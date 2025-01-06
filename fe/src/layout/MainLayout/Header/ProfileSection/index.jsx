import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PerfectScrollbar from 'react-perfect-scrollbar';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import { IconLogout, IconSettings } from '@tabler/icons-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Thêm import cho Dialog, TextField, Button, IconButton, InputAdornment
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, InputAdornment } from '@mui/material';
import axios from 'axios';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { message } from 'antd';

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);
    if (route && route !== '') {
      navigate(route);
    }
  };

  // Mở dialog đổi mật khẩu
  const handleOpenChangePassword = () => {
    setOpenChangePasswordDialog(true);
  };

  // Đóng dialog đổi mật khẩu
  const handleCloseChangePassword = () => {
    setOpenChangePasswordDialog(false);
    // Xoá các trường cũ
    setOldPassword('');
    setNewPassword('');
  };

  const handleLogout = async () => {
    // Xóa tất cả thông tin người dùng khỏi localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    localStorage.removeItem('userRoleId');
    localStorage.removeItem('token');
    localStorage.removeItem('employee');
    localStorage.removeItem('userProfile');

    // Hiển thị thông báo đăng xuất thành công
    toast.success('Bạn đã đăng xuất thành công!');
    // Điều hướng người dùng về trang đăng nhập sau 2 giây
    setTimeout(() => {
      navigate('/login');
    }, 2000);
    roleId = null;
    updateAccessState();
  };

  // Hàm cập nhật trạng thái quyền truy cập khi logout
  const updateAccessState = () => {
    // Cập nhật lại quyền truy cập của ứng dụng sau khi logout
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  // Gửi yêu cầu đổi mật khẩu
  const handleChangePassword = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      toast.error('Không tìm thấy email người dùng, vui lòng đăng nhập lại.');
      return;
    }

    if (!oldPassword || !newPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin mật khẩu.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/auth/change-password', {
        email,
        oldPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      message.success('Đổi mật khẩu thành công!');
      handleCloseChangePassword();
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        message.error(error.response.data.message || 'Đổi mật khẩu thất bại!');
      } else {
        message.error('Có lỗi xảy ra, vui lòng thử lại.');
      }
    }
  };

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={'/path/to/avatar.jpg'}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2, pb: 0 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">Xin Chào,</Typography>
                        <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                          {localStorage.getItem('employee') || 'Người dùng'}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Divider />
                  </Box>
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Divider />
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        {/* Nút đổi mật khẩu */}
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          onClick={handleOpenChangePassword}
                        >
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Đổi mật khẩu</Typography>} />
                        </ListItemButton>

                        {/* Nút đăng xuất */}
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 4}
                          onClick={handleLogout}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Đăng xuất</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>

      {/* Dialog đổi mật khẩu */}
      <Dialog open={openChangePasswordDialog} onClose={handleCloseChangePassword} fullWidth maxWidth="sm">
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Mật khẩu cũ"
            type={showOldPass ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowOldPass(!showOldPass)}>
                    {showOldPass ? <IconEyeOff /> : <IconEye />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Mật khẩu mới"
            type={showNewPass ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPass(!showNewPass)}>
                    {showNewPass ? <IconEyeOff /> : <IconEye />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChangePassword} color="secondary">Hủy</Button>
          <Button onClick={handleChangePassword} variant="contained" color="primary">Xác nhận</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default ProfileSection;
