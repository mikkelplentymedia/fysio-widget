document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("hold-booking-widget");
  if (!container) return;

  const recordId = container.getAttribute("data-recordid");
  if (!recordId) {
    container.innerHTML = "<p>❌ Mangler recordId.</p>";
    return;
  }

  try {
    const response = await fetch(
      `https://celadon-toffee-953b1f.netlify.app/.netlify/functions/getHoldData?recordId=${recordId}`
    );
    const data = await response.json();

    if (data.error) {
      container.innerHTML = `<p>❌ Kunne ikke hente holdoplysninger.</p>`;
      return;
    }

    // Byg billedgalleri
    const pictures = data.pictures || [];
    let galleryHTML = "";

    if (pictures.length > 0) {
      const firstImage = pictures[0].url;
      const otherImages = pictures.slice(1, 4); // op til 3 ekstra

      galleryHTML += `<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px; padding: 0 64px 32px 64px;">`;

      galleryHTML += `<div><img src="${firstImage}" alt="Galleri billede" style="width: 100%; height: auto; border-radius: 8px;" /></div>`;

      galleryHTML += `<div style="display: flex; flex-direction: column; gap: 10px;">`;
      otherImages.forEach((img) => {
        galleryHTML += `<img src="${img.url}" alt="Galleri billede" style="width: 100%; height: auto; border-radius: 8px;" />`;
      });
      galleryHTML += `</div>`;

      galleryHTML += `</div>`;
    }

    // Byg info-boksen
    const infoHTML = `
      <div style="font-family: sans-serif; border:1px solid #ccc; padding:20px 64px; border-radius:8px;">
        <h2>${data.team_name}</h2>
        <p><strong>Dato:</strong> ${new Date(data.datetime).toLocaleString("da-DK")}</p>
        <p><strong>Instruktør:</strong> ${data.instructor_name}</p>
        <p><strong>Pris:</strong> ${data.price} DKK</p>
        <p><strong>Beskrivelse:</strong> ${data.description}</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Max deltagere:</strong> ${data.max_participants}</p>
      </div>
    `;

    // Kombinér og vis
    container.innerHTML = galleryHTML + infoHTML;
  } catch (error) {
    console.error("Fejl:", error);
    container.innerHTML = "<p>❌ Kunne ikke hente holdoplysninger.</p>";
  }
});
