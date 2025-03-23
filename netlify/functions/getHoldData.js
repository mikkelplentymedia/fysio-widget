const Airtable = require("airtable");

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async function (event, context) {
  const recordId = event.queryStringParameters.recordId;

  if (!recordId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "❌ Mangler recordId i URL" }),
    };
  }

  try {
    const record = await base("Team").find(recordId); // Din tabel hedder stadig "Team"

    return {
      statusCode: 200,
      body: JSON.stringify({
        team_name: record.fields["Team name"] || "",
        description: record.fields["Beskrivelse"] || "",
        datetime: `${record.fields["Date/time"] || ""}`,
        instructor_name: record.fields["Name (from Instructor)"] || "",
        instructor_email: record.fields["Email (from Instructor)"] || "",
        instructor_active: record.fields["Active (from Instructor)"] || "",
        max_participants: record.fields["Max participants"] || "",
        price: record.fields["Price"] || "",
        status: record.fields["Status"] || "",
        participants: record.fields["Participants"] || [],
        images: (record.fields["Pictures"] || []).map(img => img.url), // ✅ Ændret til "Pictures"
      }),
    };
  } catch (error) {
    console.error("Fejl ved hentning:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Kunne ikke hente data fra Airtable." }),
    };
  }
};
