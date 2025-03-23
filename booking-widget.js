document.addEventListener("DOMContentLoaded", async function () {
  const widget = document.getElementById("hold-booking-widget");
  if (!widget) return;

  const recordId = widget.dataset.recordid;
  if (!recordId) {
    widget.innerHTML = "<p>❌ Mangler recordId på widget</p>";
    return;
  }

  try {
    const response = await fetch(`https://celadon-toffee-953b1f.netlify.app/.netlify/functions/getHoldData?recordId=${recordId}`);
    const data = await response.json();

    if (data.error) {
      widget.innerHTML = `<p>❌ Fejl: ${data.error}</p>`;
      return;
    }

    // HTML til billedegalleri
    const imageGallery = (data.pictures || [])
      .map(pic => `<img src="${pic.url}" alt="Billede" style="max-width:100%; border-radius:8px; margin-bottom:12px;" />`)
      .join("");

    // Samlet HTML
    widget.innerHTML = `
      <div style="font-family: sans-serif; border:1px solid #ccc; padding:20px; border-radius:8px;">
        ${imageGallery}
        <h2>${data.team_name}</h2>
        <p><strong>Dato:</strong> ${new Date(data.datetime).toLocaleString("da-DK")}</p>
        <p><strong>Instruktør:</strong> ${data.instructor_name}</p>
        <p><strong>Pris:</strong> ${data.price} DKK</p>
        <p><strong>Beskrivelse:</strong> ${data.description}</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Max deltagere:</strong> ${data.max_participants}</p>
      </div>
    `;
  } catch (error) {
    console.error("Fejl:", error);
    widget.innerHTML = "<p>❌ Kunne ikke hente data.</p>";
  }
});
