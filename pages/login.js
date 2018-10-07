import React from 'react';

import api from 'index/api';
import { LogIn } from 'index/components';
import { redirect } from 'index/utils';

const Page = () => <LogIn />;
Page.getInitialProps = async ({ req, res }) => {
  const result = await api.getUserSession(req);
  if (result.status === 200) return redirect({ pathname: '/' }, res);
  return {};
};

export default Page;
