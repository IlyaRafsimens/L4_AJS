const https = require('https');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

function makeRequest(url, callback) {
  https.get(url, (response) => {
    let data = '';
    response.on('data', (chunk) => data += chunk);
    response.on('end', () => {
      try {
        callback(null, JSON.parse(data));
      } catch (error) {
        callback(error, null);
      }
    });
  }).on('error', (error) => callback(error, null));
}

function makeRequestPromise(url) {
  return new Promise((resolve, reject) => {
    makeRequest(url, (error, data) => error ? reject(error) : resolve(data));
  });
}

function getPostsSortedByTitleLength(callback) {
  makeRequest(`${BASE_URL}/posts`, (error, posts) => {
    if (error) return callback(error, null);
    callback(null, posts.sort((a, b) => b.title.length - a.title.length));
  });
}

function getCommentsSortedByName(callback) {
  makeRequest(`${BASE_URL}/comments`, (error, comments) => {
    if (error) return callback(error, null);
    callback(null, comments.sort((a, b) => a.name.localeCompare(b.name)));
  });
}

function getUsersWithSelectedFields() {
  return makeRequestPromise(`${BASE_URL}/users`)
    .then(users => users.map(({id, name, username, email, phone}) => 
      ({id, name, username, email, phone})));
}

function getTodosUncompleted() {
  return makeRequestPromise(`${BASE_URL}/todos`)
    .then(todos => todos.filter(todo => !todo.completed));
}

async function getPostsSortedByTitleLengthAsync() {
  const posts = await makeRequestPromise(`${BASE_URL}/posts`);
  return posts.sort((a, b) => b.title.length - a.title.length);
}

async function getCommentsSortedByNameAsync() {
  const comments = await makeRequestPromise(`${BASE_URL}/comments`);
  return comments.sort((a, b) => a.name.localeCompare(b.name));
}

async function getUsersWithSelectedFieldsAsync() {
  const users = await makeRequestPromise(`${BASE_URL}/users`);
  return users.map(({id, name, username, email, phone}) => 
    ({id, name, username, email, phone}));
}

async function getTodosUncompletedAsync() {
  const todos = await makeRequestPromise(`${BASE_URL}/todos`);
  return todos.filter(todo => !todo.completed);
}

async function demonstrateAllMethods() {
  console.log('=== ЛАБОРАТОРНАЯ РАБОТА 4 ===\n');
  
  getPostsSortedByTitleLength((error, posts) => {
    if (!error) {
      console.log('A.i - Posts по длине title:');
      console.log(`Получено ${posts.length} постов`);
    }
  });
  
  getCommentsSortedByName((error, comments) => {
    if (!error) {
      console.log('A.ii - Comments по имени:');
      console.log(`Получено ${comments.length} комментариев`);
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  getUsersWithSelectedFields().then(users => {
    console.log('B.i - Users с выбранными полями:');
    console.log(`Получено ${users.length} пользователей`);
  });
  
  getTodosUncompleted().then(todos => {
    console.log('B.ii - Todos невыполненные:');
    console.log(`Получено ${todos.length} задач`);
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const postsAsync = await getPostsSortedByTitleLengthAsync();
  const commentsAsync = await getCommentsSortedByNameAsync();
  const usersAsync = await getUsersWithSelectedFieldsAsync();
  const todosAsync = await getTodosUncompletedAsync();
  
  console.log('\nC - Async/await результаты:');
  console.log(`Posts: ${postsAsync.length}, Comments: ${commentsAsync.length}`);
  console.log(`Users: ${usersAsync.length}, Todos: ${todosAsync.length}`);
  
  console.log('\n=== ВСЕ ЗАДАНИЯ ВЫПОЛНЕНЫ ===');
}

demonstrateAllMethods().catch(console.error);