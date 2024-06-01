import React, { useState } from 'react';
import MistralClient from '@mistralai/mistralai';
import 'tailwindcss/tailwind.css';

const MistralComponent = ({ parentVariable }) => {
  const [content, setContent] = useState('');
  const [response, setResponse] = useState('');

  const apiKey = "nUIqldErbGUwC6Nrf5mlvJ5kYyCHjdFZ";

  const getBestFrenchMeal = async () => {
    const client = new MistralClient(apiKey);

    // Construit le message de chat en combinant le parentVariable et du la question saisie
    const message = `Voici un échange entre des joueurs de jeu de rôle : \n ${parentVariable}. \n Voici la question à laquelle tu dois répondre concernant cette discussion : \n ${content}. Soit bref.`;

    try {
      const chatResponse = await client.chat({
        model: 'mistral-large-latest',
        response_format: { 'type': 'json_object' },
        messages: [{ role: 'user', content: message }],
      });

      const responseContent = chatResponse.choices[0].message.content;
      let formattedResponse;
      try {
        formattedResponse = JSON.stringify(JSON.parse(responseContent), null, 2);
      } catch (e) {
        formattedResponse = responseContent;
      }

      setResponse(formattedResponse);

    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while fetching the response.');
    }
  };

  return (
    <div className="container mx-auto mt-5 p-4 bg-gray-900 text-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Mistral Chat</h1>
      <form onSubmit={(e) => { e.preventDefault(); getBestFrenchMeal(); }}>
        <div className="mb-3">
          <label htmlFor="userMessage" className="form-label block mb-2">Enter your message:</label>
          <input
            type="text"
            className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            id="userMessage"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">Get Response</button>
      </form>
      <h2 className="text-xl font-semibold mt-4">Response:</h2>
      <pre className="bg-gray-800 text-white p-3 border rounded whitespace-pre-wrap">{response}</pre>
    </div>
  );
};

export default MistralComponent;
