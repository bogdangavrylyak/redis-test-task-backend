const endpointUrl = 'http://localhost:3000/api';

const generateRandomString = (length: number): string => {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

const sendRequest = async (payload: any): Promise<void> => {
  try {
    await fetch(`${endpointUrl}/`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Request sent successfully');
  } catch (error) {
    console.error('Error sending request:', error.message);
  }
};

const sendConcurrentRequests = (concurrency: number): void => {
  const interval = 1000;

  setInterval(async () => {
    const promises: Promise<void>[] = [];

    for (let i = 0; i < concurrency; i++) {
      const key = generateRandomString(5);
      const value = generateRandomString(10);
      const payload = {
        [key]: value,
      };
      console.log('payload: ', payload);
      const requestPromise = sendRequest(payload);
      promises.push(requestPromise);
    }

    await Promise.all(promises);
    console.log('Set of requests completed');
  }, interval);
};

sendConcurrentRequests(5);
