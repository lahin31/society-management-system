/**
 * fetching authenticated user
 */

const fetchAuthUser = (context) => {
  return fetch('/students/fetch-authenticate-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: context.userId,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      return res.student;
    })
    .catch((err) => err);
};

export default fetchAuthUser;
