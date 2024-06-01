import React, { useState } from 'react';
import MistralClient from '@mistralai/mistralai';

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
    <div>
      <h1>Mistral Chat</h1>
      <form onSubmit={(e) => { e.preventDefault(); getBestFrenchMeal(); }}>
        <label>
          Enter your message:
          <input
            type="text"
            className="text-gray-900"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        <button type="submit">Get Response</button>
      </form>
      <h2>Response:</h2>
      <pre>{response}</pre>
    </div>
  );
};

export default MistralComponent;
