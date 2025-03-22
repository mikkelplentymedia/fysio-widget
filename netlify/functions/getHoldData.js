export default async (req, context) => {
  const { slug_id } = context.queryStringParameters;

  try {
    const response = await fetch(`https://hook.eu2.make.com/t2sx95vvn9guk0wvlopopzrafclcnexu?slug_id=${slug_id}`);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Noget gik galt 😢' }),
    };
  }
};
