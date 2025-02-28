let changingDirection = false; 
const slideInterval = 3000; // Time for auto slide transition (3 seconds)
        let slideIndex = 0;

        function showSlides() {
            const slides = document.getElementsByClassName("slides");

            // Hide all slides initially
            Array.from(slides).forEach(slide => slide.style.display = "none");

            // Increment slide index and wrap it around
            slideIndex = (slideIndex + 1) % slides.length;

            // Show the current slide
            slides[slideIndex].style.display = "block";

            // Set the next slide transition
            setTimeout(showSlides, slideInterval);
        }

        // Start the slideshow on page load
        showSlides();
        let snakeGameInitialized = false;
        // Navigation between sections
        function navigate(section) {
            const screens = document.querySelectorAll('.screen');
            
            // Hide all sections
            screens.forEach(screen => screen.style.display = 'none');
            
            // Show the selected section
            const selectedSection = document.getElementById(section);
            if (selectedSection) {
                selectedSection.style.display = 'block';
            }

              // Initialize the Snake game when "Projects" section is opened, but only once
    if (section === "projects" && !snakeGameInitialized) {
        startSnakeGame();
        snakeGameInitialized = true; // Set the flag to true after initializing the game
    }
        }

        // Snake Game Logic
        function startSnakeGame() {
            const canvas = document.getElementById("snake-game");
            const ctx = canvas.getContext("2d");
            canvas.style.display = "block";
            
            // Game variables
            const snakeSize = 10;
            let snake = [{ x: 10, y: 10 }];
            let direction = "RIGHT";
            let food = generateFood();

            // Event listener for controlling snake direction
            window.addEventListener('keydown', changeDirection);

            // Function to update snake position
            function update() {
                const head = { ...snake[0] };

                switch (direction) {
                    case "RIGHT": head.x++; break;
                    case "LEFT": head.x--; break;
                    case "UP": head.y--; break;
                    case "DOWN": head.y++; break;
                }

                // Add new head to the snake
                snake.unshift(head);
                changingDirection = false; 
                // Check for collisions with walls or self
                if (
                    head.x < 0 || 
                    head.x >= canvas.width / snakeSize || 
                    head.y < 0 || 
                    head.y >= canvas.height / snakeSize || 
                    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
                ) {
                    // alert("Game Over!");
                    return resetGame();
                }

                // Check if snake eats food
                if (head.x === food.x && head.y === food.y) {
                    food = generateFood(); // Generate new food
                } else {
                    snake.pop(); // Remove last segment
                }
            }

            // Function to draw the game on canvas
            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw snake
                ctx.fillStyle = "limegreen";
                snake.forEach(segment => ctx.fillRect(segment.x * snakeSize, segment.y * snakeSize, snakeSize, snakeSize));

                // Draw food
                ctx.fillStyle = "red";
                ctx.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);
            }

            // Function to generate random food position
            function generateFood() {
                const foodX = Math.floor(Math.random() * (canvas.width / snakeSize));
                const foodY = Math.floor(Math.random() * (canvas.height / snakeSize));
                return { x: foodX, y: foodY };
            }

            // Function to change direction based on user input
            function changeDirection(event) {
                event.preventDefault(); // Prevents scrolling when using arrow keys
            
                if (changingDirection) return;
                
                const keyPressed = event.key;
                if (
                    (keyPressed === "ArrowUp" && direction !== "DOWN") ||
                    (keyPressed === "ArrowDown" && direction !== "UP") ||
                    (keyPressed === "ArrowLeft" && direction !== "RIGHT") ||
                    (keyPressed === "ArrowRight" && direction !== "LEFT")
                ) {
                    direction = keyPressed.replace("Arrow", "").toUpperCase();
                    changingDirection = true;
                }
            }

            // Function to reset the game after game over
            function resetGame() {
                snake = [{ x: 10, y: 10 }];
                direction = "RIGHT";
                food = generateFood();
                setTimeout(loop, 200);
            }

           // Throttled game loop using requestAnimationFrame
    let lastUpdateTime = 0;
    const updateInterval = 200; // Update every 200ms

    function loop(timestamp) {
        if (!lastUpdateTime) lastUpdateTime = timestamp;
        const deltaTime = timestamp - lastUpdateTime;
        if (deltaTime > updateInterval) {
            update();
            draw();
            lastUpdateTime = timestamp;
        }
        requestAnimationFrame(loop);
    }

    // Start the game loop
    requestAnimationFrame(loop);
        }