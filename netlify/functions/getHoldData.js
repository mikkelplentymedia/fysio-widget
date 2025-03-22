export default async (req, context) => {
  const query = context?.queryStringParameters || {};
  const slug_id = query.slug_id;

  if (!slug_id) {
    return new Response(JSON.stringify({ error: 'slug_id mangler i URL\'en 😬' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch(`https://hook.eu2.make.com/t2sx95vvn9guk0wvlopopzrafclcnexu?slug_id=${slug_id}`);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Noget gik galt 😅' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
