// Hent slug_id fra URL'en
const urlParams = new URLSearchParams(window.location.search);
const slugId = urlParams.get("slug_id");

if (!slugId) {
  document.body.innerHTML = "<p>❌ Mangler slug_id i URL'en</p>";
} else {
  fetch(`/.netlify/functions/getHoldData?slug_id=${slugId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        document.body.innerHTML = `<p>❌ Fejl: ${data.error}</p>`;
        return;
      }

      const html = `
        <h1>${data.team_name}</h1>
        <p>${data.description}</p>
        <ul>
          <li><strong>Dato:</strong> ${new Date(data.datetime).toLocaleString("da-DK")}</li>
          <li><strong>Instruktør:</strong> ${data.instructor_name}</li>
          <li><strong>Email:</strong> ${data.instructor_email}</li>
          <li><strong>Pris:</strong> ${data.price} kr.</li>
          <li><strong>Status:</strong> ${data.status}</li>
          <li><strong>Max deltagere:</strong> ${data.max_participants}</li>
        </ul>
      `;

      document.body.innerHTML = html;
    })
    .catch((error) => {
      console.error("Noget gik galt:", error);
      document.body.innerHTML = "<p>❌ Kunne ikke hente data.</p>";
    });
}
