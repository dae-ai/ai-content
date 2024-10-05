document.getElementById('aiForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const prompt = document.getElementById('prompt').value.trim();

  if (!prompt) {
    document.getElementById('result').textContent = 'Please enter a prompt.';
    return;
  }

  // Show a loading message while waiting for the response
  document.getElementById('result').textContent = 'Generating content...';

  try {
    const response = await fetch('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: prompt }),
    });

    // Check if the response has valid JSON content type
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();

      // Strip asterisks (**) from the output using regex
      const cleanedResult = (data.Result || 'No content generated.').replace(/\*\*/g, '');

      // Display the cleaned content in the result box
      document.getElementById('result').textContent = cleanedResult;
    } else {
      document.getElementById('result').textContent = 'Error: Invalid response format (not JSON).';
    }
  } catch (error) {
    document.getElementById('result').textContent = `Error: ${error.message}`;
  } finally {
    // Clear the input field after processing the request
    document.getElementById('prompt').value = '';
  }
});
