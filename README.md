```markdown
# NextAI

NextAI is a web application built with Next.js that leverages OpenAI's powerful API to enable users to interact with and generate text. It provides a user-friendly interface for exploring AI-powered text generation capabilities.

## Description

This project aims to provide a simple yet effective platform for interacting with OpenAI's language models. Users can input prompts and receive AI-generated responses, facilitating creative writing, idea generation, and exploration of AI capabilities. The application is built using modern web technologies, focusing on a smooth user experience and efficient integration with the OpenAI API.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/htoann/NextAI.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd NextAI
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

4.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your OpenAI API key:
    ```
    OPENAI_API_KEY=your_openai_api_key_here
    ```
    Replace `your_openai_api_key_here` with your actual OpenAI API key. You can obtain an API key from the OpenAI platform: [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)

## Usage

1.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

2.  Open your browser and navigate to `http://localhost:3000`.

3.  You will see an interface where you can:
    *   Enter your text prompt in the input field.
    *   Click the "Generate" button.
    *   View the AI-generated response.

## Features

*   **Text Generation:** Utilize OpenAI's language models to generate creative and informative text based on user prompts.
*   **User-Friendly Interface:** A clean and intuitive UI built with Next.js for a seamless user experience.
*   **API Integration:** Seamless integration with the OpenAI API for powerful AI capabilities.
*   **Responsive Design:** The application is designed to be responsive and work well on various devices.

## Technologies Used

*   **Next.js:** A React framework for building full-stack web applications.
*   **React:** A JavaScript library for building user interfaces.
*   **OpenAI API:** Powers the AI text generation capabilities.
*   **JavaScript/TypeScript:** The programming language used for development.
*   **HTML/CSS:** For structuring and styling the web interface.

## License

The repository does not explicitly state a license. In the absence of a specified license, all rights are reserved by the author. For commercial use or any specific usage, please contact the author.
```