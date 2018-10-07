import Router from 'next/router';

const redirect = (route, res) => {
  if (res) {
    res.writeHead(303, { Location: route.pathname });
    res.end();
  } else {
    Router.replace(route.pathname, route.as || route.pathname);
  }
};

export default redirect;
