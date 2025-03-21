import { Home } from "./Home.js";

export function setBody() {
    const container = document.createElement('div');
    container.classList.add('container');
    container.innerHTML = `
    <a onclick="window.scrollTo({top: 0});" class="back-to-top">
        <i class="fa-solid fa-arrow-up"></i>
    </a>
    <header>
        <div class="header-container">
            <div>
                <nav>
                    <div>
                        <a href="/" class="header-logo">
                            <i class="fas fa-comments"></i>
                            Forum
                        </a>
                    </div>
            </div>
            <div class="header-nav">
                
                <ul class="header-list">
                    <li>
                        <p id="header-logout">Welcome</p>
                        <button type="button" id="users-btn">Users</button>
                        <a id="logout-btn">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </header>
            <div class="left-sidebar">
                <div class="logo">
                    <i class="fas fa-comments"></i> Forum
                </div>
                <ul class="categories">
                    <li><i class="fas fa-home"></i>General</li>
                    <li><i class="fas fa-microchip"></i>Tech</li>
                    <li><i class="fas fa-gamepad"></i>Sports</li>
                    <li><i class="fa-solid fa-heart-pulse"></i>Health</li>
                    <li><i class="fa-solid fa-book-open"></i>Education</li>
                </ul>
                <div class="filters">
                    <div class="post-filters">
                        <button id="my-posts-filter" class="filter-button">My Posts</button>
                    </div>
                    <div class="like-filters">
                        <button id="my-likes-filter" class="filter-button">My 👍</button>
                    </div>
                </div>
            </div>
    
            <main class="main-content">
                <div class="add-post">
                    <div class="create-post-form">
                        <div class="publisher-info">
                            <img src="https://www.w3schools.com/w3images/avatar2.png" alt="Profile Picture"
                                class="profile-pic">
                            <span class="publisher-name">Want to share Something? </span>
                        </div>
                        <input type="text" name="title" placeholder="Enter post title" required>
                        <textarea name="content" placeholder="Write a new post..." required></textarea>
                        <label>Select Categories:</label>
                        <div class="checkbox-group">
                            <div>
                                <input type="checkbox" id="general" name="category" value="general">
                                <label for="general">General</label>
                            </div>
                            <div>
                                <input type="checkbox" id="tech" name="category" value="tech">
                                <label for="tech">Tech</label>
                            </div>
                            <div>
                                <input type="checkbox" id="health" name="category" value="health">
                                <label for="health">Health</label>
                            </div>
                            <div>
                                <input type="checkbox" id="sports" name="category" value="sports">
                                <label for="sports">Sports</label>
                            </div>
                            <div>
                                <input type="checkbox" id="education" name="category" value="education">
                                <label for="education">Education</label>
                            </div>
                        </div>
                        <button type="submit" id="create-post-button" class="submitButton">Add Post</button>
                    </div>
                </div>
                <div id="posts-container">
                </div>
                <button id="load-more" style="display: none;">Load More Posts</button>
    
            </main>
    
            <div class="right-sidebar">
                <div class="chat-users">
                    <h2>Users</h2>
                    <ul id="users-list">
                    </ul>
                </div>
            </div> 
        `;

    const script = document.createElement('script');
    script.innerHTML = `
        window.addEventListener('scroll', () => {
            let scroll = document.querySelector('.back-to-top');
            scroll.classList.toggle('active', window.scrollY > 500);
        });
        `;

    document.body.appendChild(container);
    document.body.appendChild(script);
    requestAnimationFrame(() => {
        console.log("Calling Home() after DOM update...");
        Home();
    });
}