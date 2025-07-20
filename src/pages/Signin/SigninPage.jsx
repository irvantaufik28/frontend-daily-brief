import React, { useEffect } from 'react';
import FormSignin from './components/FormSigin';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, signin } from '../../features/authSlice';
import { jwtDecode } from 'jwt-decode';

import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const SigninPage = () => {
  const [cookies, setCookie] = useCookies(['token']);
  const dispatch = useDispatch();
  const data = useSelector(authSelector.selectToken);
  const loading = useSelector(authSelector.loading);
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    await dispatch(signin(payload));
  };

  useEffect(() => {
    if (data) {
      setCookie('token', data, { path: '/' });
      const user = jwtDecode(data);
      if (user.role === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/test');
      }
    }
  }, [data, cookies, setCookie, navigate]);

  return <FormSignin onSubmit={handleSubmit} />;
};

export default SigninPage;
