const { EndpointServiceClient } = require('@google-cloud/aiplatform');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const { createCanvas, loadImage } = require('canvas');
const app = express();

app.use(bodyParser.json());

const projectId = "shift-aihack-nantes24-14";
const region = "europe-west1";
const endpointId = "6605131385910853632";
const geminiApiKey = "c5e95c51-c819-417a-96e5-c6b805fab962";

const clientOptions = { apiEndpoint: `${region}-aiplatform.googleapis.com` };
const client = new EndpointServiceClient(clientOptions);

function base64ToImage(imageStr) {
    return loadImage(`data:image/png;base64,${imageStr}`);
}

function imageToBase64(image) {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    return canvas.toDataURL().split(',')[1];
}

function imageGrid(imgs, rows = 2, cols = 2) {
    const w = imgs[0].width;
    const h = imgs[0].height;
    const canvas = createCanvas(cols * w + 10 * cols, rows * h);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    imgs.forEach((img, i) => {
        ctx.drawImage(img, (i % cols) * w + 10 * i, Math.floor(i / cols) * h);
    });

    return canvas;
}

async function generateResponse(data) {
    try {
        // Generate prompt using Gemini
        const geminiPrompt = `write the following in English, then Generate a prompt for an image based on the following JSON:\n\n${JSON.stringify(data, null, 2)}`;
        const geminiResponse = await axios.post('https://api.gemini.com/v1/generate', {
            prompt: geminiPrompt,
            apiKey: geminiApiKey
        });
        const prompt = geminiResponse.data.text;

        const instances = [
            {
                prompt: prompt,
                num_inference_steps: 2,
                guidance_scale: 1.0,
            },
        ];

        const [response] = await client.predict({
            endpoint: `projects/${projectId}/locations/${region}/endpoints/${endpointId}`,
            instances: instances,
        });

        const images = await Promise.all(response.predictions.map(base64ToImage));
        const gridImage = imageGrid(images, 1);
        const base64Image = imageToBase64(gridImage);

        const responseText = "Here's an image based on the generated prompt:";

        return {
            prompt: prompt,
            response: responseText,
            image: base64Image
        };
    } catch (error) {
        console.error('Error generating response:', error);
        throw new Error('Internal Server Error');
    }
}

