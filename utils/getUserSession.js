const getUserSession = async req => {
  const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
  const result = await fetch(`${baseUrl}/api/getUserSession`, {
    method: 'POST',
    headers: new Headers(req ? req.headers : {}),
    credentials: 'include',
  });
  return result;
};

export default getUserSession;
