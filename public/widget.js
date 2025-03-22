document.addEventListener("DOMContentLoaded", async function () {
  const widget = document.querySelector(".fysio-widget");
  if (!widget) return;

  const slug = widget.dataset.slug;
  if (!slug) {
    widget.innerHTML = "<p>❌ Mangler slug_id</p>";
    return;
  }

  try {
    const response = await fetch(`/.netlify/functions/getHoldData?slug_id=${slug}`);
    const data = await response.json();

    if (data.error) {
      widget.innerHTML = `<p>❌ Fejl: ${data.error}</p>`;
      return;
    }

    widget.innerHTML = `
      <div style="font-family: sans-serif; border:1px solid #ccc; padding:20px; border-radius:8px;">
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
