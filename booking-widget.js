document.addEventListener("DOMContentLoaded", async function () {
  const widget = document.getElementById("hold-booking-widget");
  const recordId = widget.dataset.recordid;

  if (!recordId) {
    widget.innerText = "❌ recordId mangler.";
    return;
  }

  const endpoint = `https://celadon-toffee-953b1f.netlify.app/.netlify/functions/getHoldData?recordId=${recordId}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    if (data.error) {
      widget.innerText = "❌ " + data.error;
      return;
    }

    widget.innerHTML = `
      <div style="font-family:sans-serif; border:1px solid #ccc; padding:20px; border-radius:8px;">
        <h2>${data.team_name}</h2>
        <p><strong>Dato:</strong> ${new Date(data.datetime).toLocaleString("da-DK")}</p>
        <p><strong>Instruktør:</strong> ${data.instructor_name}</p>
        <p><strong>Beskrivelse:</strong> ${data.description}</p>
        <p><strong>Pris:</strong> ${data.price} DKK</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Max deltagere:</strong> ${data.max_participants}</p>
      </div>
    `;
  } catch (err) {
    console.error("Fejl ved hentning af data", err);
    widget.innerText = "❌ Kunne ikke hente holdoplysninger.";
  }
});
