const https = require('https');
const BASE_URL = 'https://jsonplaceholder.typicode.com';

function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

function getPostsSortedByTitleLength(callback) {
    fetchData(`${BASE_URL}/posts`).then(posts => {
        const sorted = posts.sort((a, b) => b.title.length - a.title.length);
        callback(null, sorted.slice(0, 3));
    }).catch(callback);
}

function getCommentsSortedByName(callback) {
    fetchData(`${BASE_URL}/comments`).then(comments => {
        const sorted = comments.sort((a, b) => a.name.localeCompare(b.name));
        callback(null, sorted.slice(0, 3));
    }).catch(callback);
}

function getUsersWithSelectedFields() {
    return fetchData(`${BASE_URL}/users`).then(users => 
        users.map(({id, name, username, email, phone}) => 
            ({id, name, username, email, phone})
        ).slice(0, 3)
    );
}

function getTodosUncompleted() {
    return fetchData(`${BASE_URL}/todos`).then(todos => 
        todos.filter(todo => !todo.completed).slice(0, 3)
    );
}

async function getAllDataAsync() {
    try {
        const posts = await fetchData(`${BASE_URL}/posts`);
        const sortedPosts = posts.sort((a, b) => b.title.length - a.title.length).slice(0, 3);
        
        const comments = await fetchData(`${BASE_URL}/comments`);
        const sortedComments = comments.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 3);
        
        const users = await fetchData(`${BASE_URL}/users`);
        const filteredUsers = users.map(({id, name, username, email, phone}) => 
            ({id, name, username, email, phone})).slice(0, 3);
        
        const todos = await fetchData(`${BASE_URL}/todos`);
        const uncompletedTodos = todos.filter(todo => !todo.completed).slice(0, 3);
        
        return { sortedPosts, sortedComments, filteredUsers, uncompletedTodos };
    } catch (error) {
        throw error;
    }
}

function displayResults(title, data, type) {
    console.log(`\n${title}`);
    console.log('─'.repeat(50));
    
    data.forEach((item, index) => {
        console.log(`${index + 1}.`);
        if (type === 'posts') {
            console.log(`   Title: ${item.title}`);
            console.log(`   Length: ${item.title.length} characters`);
            console.log(`   User ID: ${item.userId}`);
        } else if (type === 'comments') {
            console.log(`   Name: ${item.name}`);
            console.log(`   Email: ${item.email}`);
            console.log(`   Comment: ${item.body.substring(0, 60)}...`);
        } else if (type === 'users') {
            console.log(`   Name: ${item.name}`);
            console.log(`   Username: ${item.username}`);
            console.log(`   Email: ${item.email}`);
            console.log(`   Phone: ${item.phone}`);
        } else if (type === 'todos') {
            console.log(`   Task: ${item.title}`);
            console.log(`   Status: ${item.completed ? 'Completed' : 'Not completed'}`);
            console.log(`   User ID: ${item.userId}`);
        }
        console.log('');
    });
}

async function runAllExamples() {
    console.log('Laboratory Work 4 - HTTP Protocol and Async JavaScript');
    console.log('======================================================\n');
    
    console.log('PART A - CALLBACKS');
    
    getPostsSortedByTitleLength((error, posts) => {
        if (error) {
            console.error('Error:', error);
        } else {
            displayResults('A.i - POSTS (sorted by title length)', posts, 'posts');
        }
    });
    
    getCommentsSortedByName((error, comments) => {
        if (error) {
            console.error('Error:', error);
        } else {
            displayResults('A.ii - COMMENTS (sorted by name)', comments, 'comments');
        }
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('PART B - PROMISES');
    
    getUsersWithSelectedFields()
        .then(users => {
            displayResults('B.i - USERS (selected fields only)', users, 'users');
        })
        .catch(error => console.error('Error:', error));
    
    getTodosUncompleted()
        .then(todos => {
            displayResults('B.ii - TODOS (uncompleted tasks only)', todos, 'todos');
        })
        .catch(error => console.error('Error:', error));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('PART C - ASYNC/AWAIT');
    
    try {
        const results = await getAllDataAsync();
        
        displayResults('C/A.i - POSTS via async/await', results.sortedPosts, 'posts');
        displayResults('C/A.ii - COMMENTS via async/await', results.sortedComments, 'comments');
        displayResults('C/B.i - USERS via async/await', results.filteredUsers, 'users');
        displayResults('C/B.ii - TODOS via async/await', results.uncompletedTodos, 'todos');
        
    } catch (error) {
        console.error('Error in async/await:', error);
    }
    
    console.log('\nLaboratory work completed successfully!');
    console.log('All requests have been processed.');
}

runAllExamples().catch(console.error);
