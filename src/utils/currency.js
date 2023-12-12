export default function (key) {
  const myHeaders = new Headers();
  myHeaders.append('apikey', key);

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders,
  };

  return fetch(
    'https://api.apilayer.com/fixe[r]/latest?symbols=USD%2CEUR%2CKZT%2CGBP&base=KZT',
    requestOptions
  );
}
