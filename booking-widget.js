document.addEventListener("DOMContentLoaded", async function () {
  const widget = document.getElementById("hold-booking-widget");
  const slug = widget.dataset.holdslug;

  if (!slug) {
    widget.innerText = "Hold slug mangler.";
    return;
  }

  const endpoint = `https://hook.eu2.make.com/t2sx95vvn9guk0wvlopopzrafclcnexu?slug_id=${slug}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    widget.innerHTML = `
      <div style="font-family:sans-serif; border:1px solid #ccc; padding:20px; border-radius:8px;">
        <h2>${data.team_name}</h2>
        <p><strong>Dato:</strong> ${new Date(data.datetime).toLocaleString()}</p>
        <p><strong>Instruktør:</strong> ${data.instructor_name}</p>
        <p><strong>Beskrivelse:</strong> ${data.description}</p>
        <p><strong>Pris:</strong> ${data.price} DKK</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Max deltagere:</strong> ${data.max_participants}</p>
      </div>
    `;
  } catch (err) {
    console.error("Fejl ved hentning af data", err);
    widget.innerText = "Kunne ikke hente holdoplysninger.";
  }
});
