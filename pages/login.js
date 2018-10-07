import React from 'react';

import { LogIn } from 'index/components';
import { getUserSession, redirect } from 'index/utils';

const Page = () => <LogIn />;
Page.getInitialProps = async ({ req, res }) => {
  const result = await getUserSession(req);
  if (result.status === 200) return redirect({ pathname: '/' }, res);
  return {};
};

export default Page;
